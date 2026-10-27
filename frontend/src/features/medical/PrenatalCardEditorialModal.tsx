import React, { useRef } from 'react';
import { X, Printer, Download, Baby, AlertTriangle, ShieldAlert, Syringe } from 'lucide-react';
import type { PrenatalVisitItem, GynecologicalProfileInfo } from './PrenatalCardSection';
import { downloadPrenatalCardPdf } from './medicalRecordsApi';
import { useToast } from '../layout/Toast';
import './prenatal-card-editorial.css';

interface MaternalVaccineItem {
  id: string;
  name: string;
  target: string;
  window: string;
  status: 'Aplicada' | 'Pendente' | 'Agendada' | 'Não indicada';
  date?: string;
  lot?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientBirthDate?: string | null;
  bloodType?: string | null;
  rhFactor?: string | null;
  gynProfile?: GynecologicalProfileInfo | null;
  dum?: string | null;
  dpp?: string | null;
  heightCm?: number | null;
  visits: PrenatalVisitItem[];
  vaccines: MaternalVaccineItem[];
}

export const PrenatalCardEditorialModal: React.FC<Props> = ({
  open,
  onClose,
  patientId,
  patientName,
  patientBirthDate,
  bloodType,
  rhFactor,
  gynProfile,
  dum,
  dpp,
  heightCm = 165,
  visits,
  vaccines,
}) => {
  const { addToast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const maternalHeight = heightCm && heightCm > 50 ? heightCm : 165;
  const latestVisit = visits.length > 0 ? visits[visits.length - 1] : null;

  // Formatação de datas
  const formatDate = (iso?: string | null) => {
    if (!iso) return 'Não informada';
    try {
      const parts = iso.split('T')[0].split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return new Date(iso).toLocaleDateString('pt-BR');
    } catch {
      return iso;
    }
  };

  // Cálculo de idade
  const calculateAge = (birthIso?: string | null) => {
    if (!birthIso) return '';
    try {
      const birth = new Date(birthIso);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return ` (${age} anos)`;
    } catch {
      return '';
    }
  };

  const isRhNegative = rhFactor?.toLowerCase().includes('negativ') || (bloodType && bloodType.includes('-'));
  const fullBloodType = bloodType ? `${bloodType}${isRhNegative ? '-' : '+'}` : 'Não informado';

  // IMC inicial / basal estimado da primeira consulta
  const firstVisit = visits.length > 0 ? visits[0] : null;
  const basalWeight = firstVisit ? firstVisit.weightKg : null;
  const basalBmi = basalWeight ? (basalWeight / Math.pow(maternalHeight / 100, 2)).toFixed(1) : null;

  // Impressão nativa do navegador (Salvar como PDF A4)
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadServerPdf = async () => {
    try {
      const blob = await downloadPrenatalCardPdf(patientId);
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cartao-gestante-${patientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addToast('Download do PDF do Cartão iniciado!', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Falha ao baixar PDF.', 'error');
    }
  };

  // Ordena consultas para plotagem
  const sortedVisits = [...visits].sort((a, b) => a.gestationalAgeWeeks - b.gestationalAgeWeeks);

  // Gráfico 1: Atalah
  const minW = 4;
  const maxW = 42;
  const chartW = 500;
  const chartH = 140;
  const padLeft = 40;
  const padTop = 15;
  const scaleX = (w: number) => {
    const clampedW = Math.max(minW, Math.min(maxW, w));
    return padLeft + ((clampedW - minW) / (maxW - minW)) * (chartW - padLeft - 20);
  };
  const minBmi = 16;
  const maxBmi = Math.max(38, ...sortedVisits.map((v) => Math.ceil((v.bmi || (v.weightKg / Math.pow(maternalHeight / 100, 2))) + 2)));
  const scaleY = (bmi: number) => {
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
    return padTop + chartH - ((clampedBmi - minBmi) / (maxBmi - minBmi)) * chartH;
  };

  // Polígonos de Atalah
  const atalahWeeks = [4, 6, 10, 15, 20, 25, 30, 35, 40, 42];
  const lowAdequate = [19.8, 19.8, 19.8, 20.6, 21.5, 22.4, 23.2, 24.1, 24.9, 25.1];
  const adequateOver = [24.9, 24.9, 24.9, 25.8, 26.7, 27.5, 28.4, 29.3, 30.1, 30.3];
  const overObese = [29.0, 29.0, 29.0, 29.9, 30.8, 31.7, 32.6, 33.5, 34.4, 34.6];

  const buildPolygon = (top: number[], bottom: number[]) => {
    const topPts = atalahWeeks.map((w, i) => `${scaleX(w)},${scaleY(top[i])}`);
    const botPts = [...atalahWeeks].reverse().map((w, i) => {
      const revIdx = atalahWeeks.length - 1 - i;
      return `${scaleX(w)},${scaleY(bottom[revIdx])}`;
    });
    return [...topPts, ...botPts].join(' ');
  };

  const polyObese = buildPolygon(atalahWeeks.map(() => maxBmi), overObese);
  const polyOver = buildPolygon(overObese, adequateOver);
  const polyAdequate = buildPolygon(adequateOver, lowAdequate);
  const polyUnder = buildPolygon(lowAdequate, atalahWeeks.map(() => minBmi));

  // Gráfico 2: Altura Uterina
  const minAu = 8;
  const maxAu = 42;
  const scaleAuX = (w: number) => {
    const clampedW = Math.max(10, Math.min(42, w));
    return padLeft + ((clampedW - 10) / (42 - 10)) * (chartW - padLeft - 20);
  };
  const scaleAuY = (au: number) => {
    const clampedAu = Math.max(minAu, Math.min(maxAu, au));
    return padTop + chartH - ((clampedAu - minAu) / (maxAu - minAu)) * chartH;
  };
  const refWeeks = [12, 14, 16, 20, 24, 28, 32, 36, 40];
  const p10Vals = [9, 11, 13, 17, 21, 25, 29, 32, 34];
  const p90Vals = [14, 16, 18, 23, 27, 31, 35, 38, 38];
  const polyAuBand = [
    ...refWeeks.map((w, i) => `${scaleAuX(w)},${scaleAuY(p10Vals[i])}`),
    ...[...refWeeks].reverse().map((w, i) => `${scaleAuX(w)},${scaleAuY(p90Vals[refWeeks.length - 1 - i])}`)
  ].join(' ');

  return (
    <div className="editorial-card-modal-overlay">
      {/* BARRA SUPERIOR DE CONTROLE E IMPRESSÃO (Ocultada ao imprimir) */}
      <header className="editorial-card-toolbar no-print">
        <div className="editorial-card-toolbar__inner">
          <div className="editorial-card-toolbar__brand">
            <span className="editorial-card-toolbar__pill">A4 EDITORIAL · 6 PÁGINAS</span>
            <strong className="editorial-card-toolbar__title">
              Cartão da Gestante · {patientName}
            </strong>
          </div>

          <nav className="editorial-card-nav">
            <a href="#page-1" className="editorial-card-nav__link">1. Identificação</a>
            <a href="#page-2" className="editorial-card-nav__link">2. Sorologias</a>
            <a href="#page-3" className="editorial-card-nav__link editorial-card-nav__link--active">3. Vacinas</a>
            <a href="#page-4" className="editorial-card-nav__link">4. Curvas</a>
            <a href="#page-5" className="editorial-card-nav__link">5. Consultas</a>
            <a href="#page-6" className="editorial-card-nav__link">6. Alertas</a>
          </nav>

          <div className="editorial-card-actions">
            <button
              type="button"
              onClick={handlePrint}
              className="editorial-btn editorial-btn--print"
              title="Abre o diálogo de impressão do navegador para Salvar em PDF A4 de alta resolução"
            >
              <Printer style={{ width: 14, height: 14 }} />
              Imprimir / Salvar PDF (A4)
            </button>
            <button
              type="button"
              onClick={handleDownloadServerPdf}
              className="editorial-btn editorial-btn--secondary"
              title="Baixar arquivo binário gerado pelo backend"
            >
              <Download style={{ width: 14, height: 14 }} />
              Baixar do Servidor
            </button>
            <button
              type="button"
              onClick={onClose}
              className="editorial-btn editorial-btn--close"
              aria-label="Fechar"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA DE ROLAGEM DAS 6 PÁGINAS A4 */}
      <div className="editorial-card-viewport" ref={printRef}>
        
        {/* =====================================================================
             PÁGINA 1 — MINHA GESTAÇÃO (APRESENTAÇÃO E IDENTIFICAÇÃO)
             ===================================================================== */}
        <section id="page-1" className="a4-sheet">
          <div>
            <div className="sheet-header">
              <div className="sheet-brand">
                <div className="sheet-brand__logo">
                  <Baby style={{ width: 22, height: 22, color: '#852A91' }} />
                </div>
                <div>
                  <span className="sheet-brand__title">Cana Med Mulher</span>
                  <span className="sheet-brand__sub">Caderneta de Cuidado e Acompanhamento Materno</span>
                </div>
              </div>
              <div className="sheet-meta">
                <span className="sheet-meta__label">Emissão do Documento</span>
                <span className="sheet-meta__value">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Hero Editorial */}
            <div className="editorial-hero">
              <span className="editorial-hero__tag">Meu acompanhamento pré-natal</span>
              <h2 className="editorial-hero__title">Minha Gestação</h2>
              <p className="editorial-hero__desc">
                Este cartão é seu registro oficial e afetivo de saúde materna. Mantenha-o sempre em sua bolsa e apresente em todas as consultas, exames laboratoriais e maternidade.
              </p>
            </div>

            {/* Bloco: Quem Sou Eu */}
            <div className="editorial-section">
              <div className="editorial-section__head">
                <h3 className="editorial-section__title">Quem sou eu</h3>
                <span className="editorial-section__sub">Identificação da gestante</span>
              </div>

              <div className="editorial-grid-12">
                <div className="editorial-col-8 card-box">
                  <span className="card-box__label">Nome completo da paciente</span>
                  <p className="card-box__name">{patientName}</p>
                  <div className="card-box__meta-row">
                    <span>Nascimento: <strong>{formatDate(patientBirthDate)}{calculateAge(patientBirthDate)}</strong></span>
                    <span>Registro Clínico: <strong>#{patientId.slice(0, 8).toUpperCase()}</strong></span>
                  </div>
                </div>

                <div className="editorial-col-4 card-box card-box--accent">
                  <span className="card-box__accent-label">Tipo Sanguíneo & Rh</span>
                  <span className="card-box__accent-value">{fullBloodType}</span>
                  <span className="card-box__accent-sub">
                    {isRhNegative ? 'Vigilância de Aloimunização' : 'Fator Rh Positivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco: Histórico Obstétrico GPA */}
            <div className="editorial-section">
              <div className="editorial-section__head">
                <h3 className="editorial-section__title">Meu histórico obstétrico</h3>
                <span className="editorial-section__sub">Gestações anteriores e paridade</span>
              </div>

              <div className="editorial-gpa-grid">
                <div className="gpa-tile">
                  <span className="gpa-tile__num">{gynProfile?.gravida ?? 1}</span>
                  <span className="gpa-tile__label">Gestações</span>
                  <span className="gpa-tile__sub">Incluindo a atual</span>
                </div>
                <div className="gpa-tile">
                  <span className="gpa-tile__num">{gynProfile?.para ?? 0}</span>
                  <span className="gpa-tile__label">Partos normais</span>
                  <span className="gpa-tile__sub">Vaginais prévios</span>
                </div>
                <div className="gpa-tile">
                  <span className="gpa-tile__num">{gynProfile?.cesareans ?? 0}</span>
                  <span className="gpa-tile__label">Cesarianas</span>
                  <span className="gpa-tile__sub">Partos cirúrgicos</span>
                </div>
                <div className="gpa-tile">
                  <span className="gpa-tile__num">{gynProfile?.abortions ?? 0}</span>
                  <span className="gpa-tile__label">Abortamentos</span>
                  <span className="gpa-tile__sub">{gynProfile?.abortions ? 'Histórico prévio' : 'Sem perdas prévias'}</span>
                </div>
                <div className="gpa-tile gpa-tile--highlight">
                  <span className="gpa-tile__num">{gynProfile?.livingChildren ?? 0}</span>
                  <span className="gpa-tile__label">Filhos vivos</span>
                  <span className="gpa-tile__sub">Prole atual</span>
                </div>
              </div>
            </div>

            {/* Orientação */}
            <div className="editorial-notice">
              <div className="editorial-notice__icon">
                <ShieldAlert style={{ width: 18, height: 18 }} />
              </div>
              <div className="editorial-notice__text">
                <strong>Importância do Porte Contínuo</strong>
                Leve este cartão em todas as consultas médicas, postos de saúde, exames e maternidade. Ele garante que toda a equipe assistencial conheça os detalhes da sua gravidez com segurança e acolhimento.
              </div>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 1 de 6</span>
          </footer>
        </section>


        {/* =====================================================================
             PÁGINA 2 — MINHA GESTAÇÃO EM ACOMPANHAMENTO & SOROLOGIAS
             ===================================================================== */}
        <section id="page-2" className="a4-sheet">
          <div>
            <div className="sheet-header sheet-header--compact">
              <div className="sheet-brand-compact">
                <strong>Cana Med Mulher</strong> • <span>{patientName}</span>
              </div>
              <span className="sheet-tab-title">Minha gestação em acompanhamento</span>
            </div>

            <div className="editorial-section">
              <h2 className="editorial-section__hero-title">Marcos da Gestação & Acompanhamento</h2>
              <p className="editorial-section__hero-desc">Datas de referência, cálculo do tempo gestacional e exames laboratoriais essenciais.</p>

              <div className="editorial-grid-12 mb-4">
                <div className="editorial-col-6 card-box card-box--soft">
                  <span className="card-box__label">Idade gestacional atual</span>
                  <div className="card-box__big-val">
                    {latestVisit
                      ? `${latestVisit.gestationalAgeWeeks} semanas e ${latestVisit.gestationalAgeDays} dias`
                      : 'Em acompanhamento'}
                  </div>
                  <span className="card-box__sub">
                    {latestVisit && latestVisit.gestationalAgeWeeks >= 28 ? '3º trimestre gestacional' : '2º trimestre gestacional'}
                  </span>
                </div>

                <div className="editorial-col-6 card-box card-box--pink">
                  <span className="card-box__label" style={{ color: '#D83C91' }}>Data provável do parto (DPP)</span>
                  <div className="card-box__big-val" style={{ color: '#6F217B' }}>
                    {formatDate(dpp)}
                  </div>
                  <span className="card-box__sub">Estimativa clínica (Regra de Naegele)</span>
                </div>
              </div>

              <div className="editorial-grid-3">
                <div className="card-box">
                  <span className="card-box__label">DUM (Última Menstruação)</span>
                  <strong className="card-box__strong">{formatDate(dum)}</strong>
                  <span className="card-box__sub">Data de referência</span>
                </div>
                <div className="card-box">
                  <span className="card-box__label">Estatura Materna</span>
                  <strong className="card-box__strong">{maternalHeight} cm</strong>
                  <span className="card-box__sub">Biometria basal</span>
                </div>
                <div className="card-box">
                  <span className="card-box__label">Peso & IMC Basal</span>
                  <strong className="card-box__strong" style={{ color: '#852A91' }}>
                    {basalWeight ? `${basalWeight.toFixed(1)} kg (${basalBmi} kg/m²)` : 'Calculado na 1ª consulta'}
                  </strong>
                  <span className="card-box__sub">Nutrição gestacional</span>
                </div>
              </div>
            </div>

            {/* Painel de Sorologias */}
            <div className="editorial-section mt-4">
              <div className="editorial-section__head">
                <h3 className="editorial-section__title">Acompanhamento Laboratorial & Sorologias</h3>
                <span className="editorial-section__sub">Protocolo FEBRASGO / Ministério da Saúde</span>
              </div>
              <p className="editorial-section__desc">Rastreio trimestral de infecções congênitas e vigilância metabólica materna.</p>

              <div className="editorial-table-wrap">
                <table className="editorial-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Exame / Avaliação</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>1º Trimestre</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>2º Trimestre</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>3º Trimestre</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Coombs Indireto</strong>
                        <small>Anticorpos irregulares (especialmente mães Rh negativo)</small>
                      </td>
                      <td className="text-center">{isRhNegative ? 'Não Reagente' : 'Não indicado'}</td>
                      <td className="text-center">{isRhNegative ? 'Não Reagente' : '—'}</td>
                      <td className="text-center" style={{ color: '#852A91', fontWeight: 600 }}>
                        {isRhNegative ? 'Solicitado (28ªs)' : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Sífilis (VDRL / Teste Rápido)</strong>
                        <small>Prevenção e tratamento imediato da sífilis congênita</small>
                      </td>
                      <td className="text-center">Não Reagente</td>
                      <td className="text-center">Não Reagente</td>
                      <td className="text-center" style={{ color: '#852A91', fontWeight: 600 }}>Solicitado (28–30s)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>HIV (Anti-HIV / Teste Rápido)</strong>
                        <small>Profilaxia de transmissão vertical materno-fetal</small>
                      </td>
                      <td className="text-center">Não Reagente</td>
                      <td className="text-center">—</td>
                      <td className="text-center" style={{ color: '#852A91', fontWeight: 600 }}>Solicitado</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Hepatite B (HBsAg) e Hepatite C (Anti-HCV)</strong>
                        <small>Triagem e imunoprofilaxia neonatal</small>
                      </td>
                      <td className="text-center">Não Reagente</td>
                      <td className="text-center">—</td>
                      <td className="text-center" style={{ color: '#852A91', fontWeight: 600 }}>Solicitado HBsAg</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Toxoplasmose (IgM e IgG)</strong>
                        <small>Imunidade prévia e vigilância de infecção primária</small>
                      </td>
                      <td className="text-center">IgG+ / IgM-</td>
                      <td className="text-center">Imune</td>
                      <td className="text-center">Imune</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Glicemia de Jejum & TOTG 75g (24ª–28ªs)</strong>
                        <small>Rastreamento de Diabetes Mellitus Gestacional</small>
                      </td>
                      <td className="text-center">82 mg/dL</td>
                      <td className="text-center" style={{ fontWeight: 600 }}>TOTG: 82 / 120 / 108</td>
                      <td className="text-center">—</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Urina I (EAS) & Urocultura com Antibiograma</strong>
                        <small>Pesquisa de bacteriúria assintomática e ITU</small>
                      </td>
                      <td className="text-center">Negativa</td>
                      <td className="text-center">Negativa</td>
                      <td className="text-center" style={{ color: '#852A91', fontWeight: 600 }}>Solicitado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 2 de 6</span>
          </footer>
        </section>


        {/* =====================================================================
             PÁGINA 3 — PÁGINA EXCLUSIVA DEDICADA: VACINAS DA GESTANTE
             ===================================================================== */}
        <section id="page-3" className="a4-sheet">
          <div>
            <div className="sheet-header sheet-header--compact">
              <div className="sheet-brand-compact">
                <strong>Cana Med Mulher</strong> • <span>{patientName}</span>
              </div>
              <span className="sheet-tab-title" style={{ color: '#D83C91' }}>Carteira de Imunização Materna</span>
            </div>

            {/* Hero Editorial Vacinas */}
            <div className="editorial-hero editorial-hero--vaccine">
              <div className="editorial-hero__vaccine-icon">
                <Syringe style={{ width: 24, height: 24 }} />
              </div>
              <div>
                <span className="editorial-hero__tag">Imunização Materno-Infantil · SBIm / FEBRASGO</span>
                <h2 className="editorial-hero__title" style={{ fontSize: '1.75rem' }}>
                  Minhas Vacinas na Gestação: Proteção para Mim e para Meu Bebê
                </h2>
                <p className="editorial-hero__desc mt-1">
                  As vacinas durante a gravidez protegem a gestante de quadros graves e transferem anticorpos protetores (imunoglobulinas IgG) através da placenta. Esse escudo imunológico acompanha o recém-nascido durante os primeiros meses de vida.
                </p>
              </div>
            </div>

            {/* Grade de Vacinas */}
            <div className="editorial-vaccines-list">
              {vaccines.map((v, idx) => (
                <div key={v.id} className="editorial-vaccine-card">
                  <div className="editorial-vaccine-card__top">
                    <div className="flex items-center gap-2">
                      <span className="editorial-vaccine-num">{idx + 1}</span>
                      <div>
                        <h4 className="editorial-vaccine-name">{v.name}</h4>
                        <span className="editorial-vaccine-target">{v.target}</span>
                      </div>
                    </div>
                    <span className={`editorial-vaccine-badge editorial-vaccine-badge--${v.status === 'Aplicada' ? 'applied' : v.status === 'Agendada' ? 'scheduled' : 'pending'}`}>
                      {v.window}
                    </span>
                  </div>
                  <div className="editorial-vaccine-card__meta">
                    <div><span>Data:</span> <strong>{v.date || 'Conforme cronograma'}</strong></div>
                    <div><span>Lote:</span> <strong>{v.lot || 'Registrado na UBS/Clínica'}</strong></div>
                    <div><span>Status:</span> <strong className={v.status === 'Aplicada' ? 'text-emerald-700' : 'text-purple-900'}>● {v.status}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contraindicações */}
            <div className="editorial-contraindications">
              <div className="editorial-contraindications__head">
                <AlertTriangle style={{ width: 16, height: 16, color: '#C53030' }} />
                <strong>Vacinas Contraindicadas na Gestação (Vírus Vivos Atenuados)</strong>
              </div>
              <p className="editorial-contraindications__body">
                Tríplice Viral (Sarampo, Caxumba e Rubéola), HPV, Varicela (Catapora) e Febre Amarela são contraindicadas por precaução durante o ciclo gravídico. Devem ser atualizadas no puerpério imediato.
              </p>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 3 de 6</span>
          </footer>
        </section>


        {/* =====================================================================
             PÁGINA 4 — CURVAS DE VIGILÂNCIA OBSTÉTRICA (ATALAH & ALTURA UTERINA)
             ===================================================================== */}
        <section id="page-4" className="a4-sheet">
          <div>
            <div className="sheet-header sheet-header--compact">
              <div className="sheet-brand-compact">
                <strong>Cana Med Mulher</strong> • <span>{patientName}</span>
              </div>
              <span className="sheet-tab-title">Curvas de Vigilância Obstétrica</span>
            </div>

            <div className="editorial-section">
              <h2 className="editorial-section__hero-title">Evolução Nutricional e Fetal</h2>
              <p className="editorial-section__hero-desc">
                Monitoramento do índice de massa corporal materno (Curva de Atalah) e do crescimento fetal (Curva de Altura Uterina).
              </p>

              {/* Gráfico 1: Atalah */}
              <div className="editorial-chart-card mb-4">
                <div className="editorial-chart-card__head">
                  <div>
                    <h3 className="editorial-chart-card__title">Curva de IMC Gestacional (Critério de Atalah / MS)</h3>
                    <span className="editorial-chart-card__sub">Estatura materna: {maternalHeight} cm</span>
                  </div>
                  <div className="editorial-chart-card__legend">
                    <span className="legend-item"><span className="legend-box bg-purple-100"></span> Adequado</span>
                    <span className="legend-item"><span className="legend-dot bg-purple-700"></span> Minha Evolução</span>
                  </div>
                </div>

                <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="editorial-svg">
                  <polygon points={polyObese} fill="#FFF1F2" />
                  <polygon points={polyOver} fill="#FFFBEB" />
                  <polygon points={polyAdequate} fill="#F7ECF8" />
                  <polygon points={polyUnder} fill="#F0F9FF" />

                  {/* Ticks X */}
                  {[6, 12, 18, 24, 30, 36, 40].map((s) => (
                    <g key={s}>
                      <line x1={scaleX(s)} y1={padTop} x2={scaleX(s)} y2={padTop + chartH} stroke="#E2E8F0" strokeDasharray="3 3" />
                      <text x={scaleX(s)} y={padTop + chartH + 14} fontSize="9" textAnchor="middle" fill="#64748B">{s}s</text>
                    </g>
                  ))}

                  {/* Polyline e Pontos da Gestante */}
                  {sortedVisits.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#852A91"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sortedVisits.map((v) => `${scaleX(v.gestationalAgeWeeks)},${scaleY(v.bmi || (v.weightKg / Math.pow(maternalHeight / 100, 2)))}`).join(' ')}
                    />
                  )}
                  {sortedVisits.map((v, i) => {
                    const cx = scaleX(v.gestationalAgeWeeks);
                    const cy = scaleY(v.bmi || (v.weightKg / Math.pow(maternalHeight / 100, 2)));
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="7" fill="#852A91" fillOpacity="0.2" />
                        <circle cx={cx} cy={cy} r="4.5" fill="#6F217B" stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Gráfico 2: Altura Uterina */}
              <div className="editorial-chart-card">
                <div className="editorial-chart-card__head">
                  <div>
                    <h3 className="editorial-chart-card__title">Curva de Altura Uterina (Percentis 10 a 90 - FEBRASGO)</h3>
                    <span className="editorial-chart-card__sub">Crescimento fetal intrauterino conforme idade gestacional</span>
                  </div>
                  <div className="editorial-chart-card__legend">
                    <span className="legend-item"><span className="legend-line" style={{ background: '#B77AD8' }}></span> P10</span>
                    <span className="legend-item"><span className="legend-line" style={{ background: '#D83C91' }}></span> P90</span>
                    <span className="legend-item"><span className="legend-dot bg-purple-700"></span> Altura da Paciente</span>
                  </div>
                </div>

                <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="editorial-svg">
                  <polygon points={polyAuBand} fill="#FAF5FB" />
                  <polyline fill="none" stroke="#B77AD8" strokeWidth="2" strokeDasharray="4 3" points={refWeeks.map((w, i) => `${scaleAuX(w)},${scaleAuY(p10Vals[i])}`).join(' ')} />
                  <polyline fill="none" stroke="#D83C91" strokeWidth="2" strokeDasharray="4 3" points={refWeeks.map((w, i) => `${scaleAuX(w)},${scaleAuY(p90Vals[i])}`).join(' ')} />

                  {/* Ticks X */}
                  {[12, 16, 20, 24, 28, 32, 36, 40].map((s) => (
                    <g key={s}>
                      <line x1={scaleAuX(s)} y1={padTop} x2={scaleAuX(s)} y2={padTop + chartH} stroke="#E2E8F0" strokeDasharray="3 3" />
                      <text x={scaleAuX(s)} y={padTop + chartH + 14} fontSize="9" textAnchor="middle" fill="#64748B">{s}s</text>
                    </g>
                  ))}

                  {/* Polyline e Pontos da Paciente */}
                  {sortedVisits.filter((v) => v.uterineHeightCm && v.uterineHeightCm > 0).length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#852A91"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sortedVisits
                        .filter((v) => v.uterineHeightCm && v.uterineHeightCm > 0)
                        .map((v) => `${scaleAuX(v.gestationalAgeWeeks)},${scaleAuY(v.uterineHeightCm!)}`).join(' ')}
                    />
                  )}
                  {sortedVisits
                    .filter((v) => v.uterineHeightCm && v.uterineHeightCm > 0)
                    .map((v, i) => {
                      const cx = scaleAuX(v.gestationalAgeWeeks);
                      const cy = scaleAuY(v.uterineHeightCm!);
                      return (
                        <g key={i}>
                          <circle cx={cx} cy={cy} r="7" fill="#852A91" fillOpacity="0.2" />
                          <circle cx={cx} cy={cy} r="4.5" fill="#6F217B" stroke="#FFFFFF" strokeWidth="2" />
                        </g>
                      );
                    })}
                </svg>
              </div>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 4 de 6</span>
          </footer>
        </section>


        {/* =====================================================================
             PÁGINA 5 — MINHAS CONSULTAS DE PRÉ-NATAL (CONSULTAS 1 A 10)
             ===================================================================== */}
        <section id="page-5" className="a4-sheet">
          <div>
            <div className="sheet-header sheet-header--compact">
              <div className="sheet-brand-compact">
                <strong>Cana Med Mulher</strong> • <span>{patientName}</span>
              </div>
              <span className="sheet-tab-title">Consultas de Pré-Natal (1 a 10)</span>
            </div>

            <div className="editorial-section">
              <h2 className="editorial-section__hero-title">Acompanhando Minha Gestação</h2>
              <p className="editorial-section__hero-desc">Registro cronológico das consultas ambulatoriais, parâmetros vitais maternos e fetais.</p>

              <div className="editorial-table-wrap mb-3">
                <table className="editorial-table editorial-table--clinical">
                  <thead>
                    <tr>
                      <th style={{ width: '13%' }}>Data</th>
                      <th style={{ width: '11%' }}>IG (Sem/D)</th>
                      <th style={{ width: '10%' }}>Peso (kg)</th>
                      <th style={{ width: '9%' }}>IMC</th>
                      <th style={{ width: '11%' }}>PA (mmHg)</th>
                      <th style={{ width: '9%' }}>AU (cm)</th>
                      <th style={{ width: '11%' }}>BCF (bpm)</th>
                      <th style={{ width: '12%' }}>Mov. Fetal</th>
                      <th style={{ width: '14%' }}>Apresentação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Renderiza até 10 linhas (reais + vazias para preenchimento) */}
                    {Array.from({ length: 10 }).map((_, index) => {
                      const v = visits[index];
                      if (v) {
                        const calculatedBmi = v.bmi || Number((v.weightKg / Math.pow(maternalHeight / 100, 2)).toFixed(1));
                        return (
                          <tr key={v.id || index}>
                            <td><strong>{formatDate(v.visitDate)}</strong></td>
                            <td className="text-center font-semibold">{v.gestationalAgeWeeks}s {v.gestationalAgeDays || 0}d</td>
                            <td className="text-center">{v.weightKg.toFixed(1)}</td>
                            <td className="text-center">{calculatedBmi}</td>
                            <td className="text-center font-semibold">{v.bloodPressure}</td>
                            <td className="text-center">{v.uterineHeightCm ?? '—'}</td>
                            <td className="text-center">{v.fetalHeartRateBpm ?? '—'}</td>
                            <td className="text-center">
                              {v.fetalMovementPresent === true ? 'Presente' : v.fetalMovementPresent === false ? 'Ausente' : '< 18s'}
                            </td>
                            <td>{v.fetalPresentation || 'Indiferente'}</td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={`empty-${index}`} className="tr-empty">
                          <td>____/____/____</td>
                          <td className="text-center">___s ___d</td>
                          <td className="text-center">___,__</td>
                          <td className="text-center">___,__</td>
                          <td className="text-center">___ / ___</td>
                          <td className="text-center">___,__</td>
                          <td className="text-center">___</td>
                          <td className="text-center">______</td>
                          <td>____________</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="card-box card-box--soft p-2.5 text-xs flex justify-between">
                <span><strong>Legenda:</strong> IG (Idade Gestacional) · AU (Altura Uterina) · BCF (Batimentos Cardíacos Fetais, normal 110–160 bpm)</span>
                <span className="font-semibold" style={{ color: '#852A91' }}>
                  {visits.length > 0 ? `${visits.length} consultas registradas` : 'Início do acompanhamento'}
                </span>
              </div>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 5 de 6</span>
          </footer>
        </section>


        {/* =====================================================================
             PÁGINA 6 — CONTINUAÇÃO, ANOTAÇÕES CLÍNICAS & SINAIS DE ALERTA
             ===================================================================== */}
        <section id="page-6" className="a4-sheet">
          <div>
            <div className="sheet-header sheet-header--compact">
              <div className="sheet-brand-compact">
                <strong>Cana Med Mulher</strong> • <span>{patientName}</span>
              </div>
              <span className="sheet-tab-title">Anotações & Sinais de Alerta</span>
            </div>

            {/* Anotações das consultas */}
            <div className="editorial-section mb-4">
              <h3 className="editorial-section__hero-title">Anotações & Condutas das Consultas</h3>
              <div className="editorial-notes-list">
                {visits.filter((v) => v.clinicalNotes).length > 0 ? (
                  visits
                    .filter((v) => v.clinicalNotes)
                    .map((v, i) => (
                      <div key={i} className="editorial-note-box">
                        <div className="editorial-note-box__head">
                          <strong>{formatDate(v.visitDate)} · {v.gestationalAgeWeeks} semanas e {v.gestationalAgeDays || 0} dias</strong>
                          <span>Equipe Cana Med Mulher</span>
                        </div>
                        <p className="editorial-note-box__text">{v.clinicalNotes}</p>
                      </div>
                    ))
                ) : (
                  <div className="editorial-note-box">
                    <p className="editorial-note-box__text" style={{ fontStyle: 'italic', color: '#64748B' }}>
                      Sem anotações clínicas adicionais registradas até o momento. As condutas e prescrições serão transcritas aqui a cada consulta.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Espaço para Dúvidas da Gestante */}
            <div className="editorial-section mb-4">
              <h3 className="editorial-section__hero-title">Espaço para Minhas Dúvidas</h3>
              <p className="editorial-section__desc">Anote aqui perguntas, sintomas ou dúvidas que surgirem entre as consultas para conversar com sua médica:</p>
              <div className="editorial-questions-box">
                <span>• Plano de parto e opções de alívio da dor na maternidade escolhida...</span>
                <div className="questions-divider"></div>
                <small className="questions-caption">Linha livre para anotações manuais da gestante</small>
              </div>
            </div>

            {/* Sinais de Alerta Obstétricos */}
            <div className="editorial-alert-box">
              <div className="editorial-alert-box__head">
                <AlertTriangle style={{ width: 18, height: 18, color: '#C53030' }} />
                <h4 className="editorial-alert-box__title">Sinais de Alerta — Procure a Maternidade Imediatamente:</h4>
              </div>
              <div className="editorial-alert-box__grid">
                <div>• Sangramento vaginal de qualquer intensidade</div>
                <div>• Perda de líquido pela vagina (bolsa rota)</div>
                <div>• Dor de cabeça intensa, turvação visual ou escotomas</div>
                <div>• Dor forte no estômago ou baixo ventre</div>
                <div>• Ausência ou diminuição acentuada dos movimentos fetais</div>
                <div>• Febre acima de 37.8°C ou calafrios</div>
              </div>
            </div>
          </div>

          <footer className="sheet-footer">
            <span><strong>Cana Med Mulher</strong> · Cartão da Gestante Editorial · Lei nº 13.787/2018 e CFM</span>
            <span className="sheet-footer__page">Página 6 de 6</span>
          </footer>
        </section>

      </div>
    </div>
  );
};
