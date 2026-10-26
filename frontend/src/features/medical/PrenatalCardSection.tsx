import React, { useState, useEffect, useMemo } from 'react';
import { Download, Plus, Baby, Calendar, Activity, ShieldAlert, Syringe, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../layout/Toast';
import { AtalahWeightGainChart } from './AtalahWeightGainChart';
import { UterineHeightChart } from './UterineHeightChart';

export interface PrenatalVisitItem {
  id: string;
  visitDate: string;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  weightKg: number;
  bmi?: number | null;
  bloodPressure: string;
  uterineHeightCm?: number | null;
  fetalHeartRateBpm?: number | null;
  fetalMovementPresent?: boolean | null;
  edemaClassification?: string | null;
  fetalPresentation?: string | null;
  clinicalNotes?: string | null;
}

export interface GynecologicalProfileInfo {
  gravida?: number | null;
  para?: number | null;
  cesareans?: number | null;
  abortions?: number | null;
  livingChildren?: number | null;
}

export interface PrenatalCardSectionProps {
  patientId: string;
  patientName: string;
  visits: PrenatalVisitItem[];
  onAddVisit?: (visit: Omit<PrenatalVisitItem, 'id'>) => Promise<void>;
  loading?: boolean;
  initialGestationalAgeWeeks?: number;
  initialGestationalAgeDays?: number;
  heightCm?: number | null;
  dum?: string | null;
  dpp?: string | null;
  bloodType?: string | null;
  rhFactor?: string | null;
  gynProfile?: GynecologicalProfileInfo | null;
}

interface MaternalVaccineItem {
  id: string;
  name: string;
  target: string;
  window: string;
  status: 'Aplicada' | 'Pendente' | 'Agendada' | 'Não indicada';
  date?: string;
  lot?: string;
}

interface MaternalSerologyItem {
  exam: string;
  description: string;
  tri1: string;
  tri2: string;
  tri3: string;
}

export const PrenatalCardSection: React.FC<PrenatalCardSectionProps> = ({
  patientId,
  patientName,
  visits,
  onAddVisit,
  loading = false,
  initialGestationalAgeWeeks,
  initialGestationalAgeDays,
  heightCm = 165,
  dum,
  dpp,
  bloodType,
  rhFactor,
  gynProfile,
}) => {
  const { addToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'consultas' | 'vacinas' | 'sorologias'>('consultas');

  // Form states
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [weeks, setWeeks] = useState(
    initialGestationalAgeWeeks !== undefined ? String(initialGestationalAgeWeeks) : '12'
  );
  const [days, setDays] = useState(
    initialGestationalAgeDays !== undefined ? String(initialGestationalAgeDays) : '0'
  );
  const [maternalHeightInput, setMaternalHeightInput] = useState(String(heightCm && heightCm > 50 ? heightCm : 165));
  const [weight, setWeight] = useState('');
  const [bp, setBp] = useState('');
  const [uterineHeight, setUterineHeight] = useState('');
  const [fhr, setFhr] = useState('');
  const [movement, setMovement] = useState<boolean | null>(true);
  const [edema, setEdema] = useState('Ausente');
  const [presentation, setPresentation] = useState('Cefálica');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialGestationalAgeWeeks !== undefined) {
      setWeeks(String(initialGestationalAgeWeeks));
    }
    if (initialGestationalAgeDays !== undefined) {
      setDays(String(initialGestationalAgeDays));
    }
  }, [initialGestationalAgeWeeks, initialGestationalAgeDays]);

  // Cálculo dinâmico de IMC no modal
  const calculatedBmi = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(maternalHeightInput);
    if (!w || !h || h <= 0) return null;
    const bmiVal = w / Math.pow(h / 100, 2);
    return Number(bmiVal.toFixed(1));
  }, [weight, maternalHeightInput]);

  const bmiClassification = useMemo(() => {
    if (!calculatedBmi) return null;
    if (calculatedBmi < 19.8) return { label: 'Baixo Peso', color: '#2B6CB0', bg: '#EBF8FF' };
    if (calculatedBmi <= 26.0) return { label: 'Adequado', color: '#852A91', bg: '#F7ECF8' };
    if (calculatedBmi <= 29.0) return { label: 'Sobrepeso', color: '#C05621', bg: '#FFFAF0' };
    return { label: 'Obesidade', color: '#C53030', bg: '#FFF5F5' };
  }, [calculatedBmi]);

  // Vacinas com persistência em localStorage por paciente
  const defaultVaccines: MaternalVaccineItem[] = [
    {
      id: 'dtpa',
      name: 'dTpa (Adulto)',
      target: 'Difteria, Tétano e Coqueluche',
      window: 'A partir da 20ª sem (ideal 27ª–36ªs) · 1 dose a cada gestação',
      status: 'Aplicada',
      date: '14/09/2026',
      lot: 'AD24B918',
    },
    {
      id: 'flu',
      name: 'Influenza (Gripe)',
      target: 'Gripe Sazonal e complicações respiratórias',
      window: 'Qualquer Idade Gestacional · 1 dose anual',
      status: 'Aplicada',
      date: '01/06/2026',
      lot: 'FLU2026-X1',
    },
    {
      id: 'hepb',
      name: 'Hepatite B (Recombinante)',
      target: 'Prevenção de infecção e transmissão vertical',
      window: '3 doses (0, 1 e 6 meses) ou comprovação de esquema prévio',
      status: 'Aplicada',
      date: 'Esquema prévio',
      lot: 'Comprovado',
    },
    {
      id: 'covid',
      name: 'COVID-19 (Atualizada)',
      target: 'Formas graves de infecção respiratória',
      window: 'Qualquer Idade Gestacional conforme esquema vigente',
      status: 'Aplicada',
      date: '10/05/2026',
      lot: 'CV260519',
    },
    {
      id: 'vsr',
      name: 'Vírus Sincicial Respiratório (VSR / Abrysvo)',
      target: 'Prevenção de bronquiolite grave no recém-nascido',
      window: 'Entre 32ª e 36ª semanas · Dose única intramuscular',
      status: 'Agendada',
      date: 'Agendada 32s',
      lot: 'Pendente',
    },
    {
      id: 'antid',
      name: 'Imunoglobulina Anti-D',
      target: 'Profilaxia de aloimunização Rh (se mãe Rh negativo)',
      window: '28ª semana e até 72h pós-parto se Coombs Indireto negativo',
      status: rhFactor === 'Negativo' ? 'Pendente' : 'Não indicada',
      date: rhFactor === 'Negativo' ? 'Pendente 28s' : 'Não se aplica (Rh+)',
    },
  ];

  const [vaccines, setVaccines] = useState<MaternalVaccineItem[]>(() => {
    try {
      const saved = localStorage.getItem(`canamed_vaccines_${patientId}`);
      return saved ? JSON.parse(saved) : defaultVaccines;
    } catch {
      return defaultVaccines;
    }
  });

  const handleUpdateVaccine = (id: string, newStatus: MaternalVaccineItem['status']) => {
    setVaccines((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
      try {
        localStorage.setItem(`canamed_vaccines_${patientId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Sorologias Trimestrais
  const serologies: MaternalSerologyItem[] = [
    {
      exam: 'Coombs Indireto',
      description: 'Pesquisa de anticorpos irregulares (especial se Rh negativo)',
      tri1: 'Não Reagente (02/06)',
      tri2: '—',
      tri3: rhFactor === 'Negativo' ? 'Indicado na 28ªs' : '—',
    },
    {
      exam: 'Sífilis (VDRL / Teste Rápido)',
      description: 'Rastreio de sífilis congênita',
      tri1: 'Não Reagente (02/06)',
      tri2: 'Não Reagente (24/08)',
      tri3: 'Solicitado em 28-30s',
    },
    {
      exam: 'HIV (Anti-HIV)',
      description: 'Prevenção de transmissão vertical',
      tri1: 'Não Reagente (02/06)',
      tri2: '—',
      tri3: 'Solicitado',
    },
    {
      exam: 'Hepatite B (HBsAg) & C (Anti-HCV)',
      description: 'Rastreio de hepatites virais',
      tri1: 'Não Reagente (02/06)',
      tri2: '—',
      tri3: 'Solicitado HBsAg',
    },
    {
      exam: 'Toxoplasmose (IgG / IgM)',
      description: 'Imunidade e infecção recente',
      tri1: 'IgG+ / IgM- (Imune)',
      tri2: '—',
      tri3: '—',
    },
    {
      exam: 'Glicemia de Jejum / TOTG 75g',
      description: 'Rastreio de Diabetes Gestacional (DMG)',
      tri1: '84 mg/dL (< 92)',
      tri2: 'TOTG: 82/118/104 mg/dL',
      tri3: '—',
    },
    {
      exam: 'Urina I (EAS) e Urocultura',
      description: 'Rastreio de bacteriúria assintomática e ITU',
      tri1: 'Normal / Negativa',
      tri2: 'Normal / Negativa',
      tri3: 'Solicitado',
    },
  ];

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`/api/v1/patients/${patientId}/prenatal-card/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('canamed_token') || ''}`,
        },
      });

      if (!res.ok) {
        throw new Error('Não foi possível gerar o Cartão da Gestante em PDF.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cartao-gestante-${patientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('Cartão da Gestante baixado com sucesso.', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Erro ao baixar PDF.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !bp) {
      addToast('Peso e Pressão Arterial são obrigatórios.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (onAddVisit) {
        await onAddVisit({
          visitDate,
          gestationalAgeWeeks: parseInt(weeks, 10),
          gestationalAgeDays: parseInt(days, 10),
          weightKg: parseFloat(weight),
          bmi: calculatedBmi,
          bloodPressure: bp.trim(),
          uterineHeightCm: uterineHeight ? parseFloat(uterineHeight) : null,
          fetalHeartRateBpm: fhr ? parseInt(fhr, 10) : null,
          fetalMovementPresent: movement,
          edemaClassification: edema,
          fetalPresentation: presentation,
          clinicalNotes: notes.trim() || null,
        });
        addToast('Consulta pré-natal registrada com sucesso.', 'success');
        setModalOpen(false);
      }
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Falha ao registrar consulta.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Formatação de datas auxiliares
  const formatIsoDate = (d?: string | null) => {
    if (!d) return 'Não informada';
    try {
      const [year, month, day] = d.slice(0, 10).split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return d;
    }
  };

  const isRhNegative = rhFactor?.toLowerCase().includes('negativ') || (bloodType && bloodType.includes('-'));
  const fullBloodType = bloodType ? `${bloodType}${isRhNegative ? '-' : '+'}` : null;

  return (
    <div
      data-testid="prenatal-card-section"
      className="bg-white rounded-xl border border-[#E9D5FF] p-5 shadow-sm space-y-4"
    >
      {/* 1. TOPO DA SEÇÃO: Cabeçalho com ações */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9D5FF] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#F7ECF8] text-[#852A91] border border-[#B77AD8]/40">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#6F217B]">
              Cartão da Gestante & Consultas de Pré-Natal
            </h3>
            <p className="text-xs text-[#64748B]">
              Acompanhamento longitudinal materno-fetal · Diretrizes FEBRASGO / Ministério da Saúde
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAddVisit && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#852A91] text-[#852A91] font-semibold text-xs bg-white hover:bg-[#F7ECF8] transition-colors"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              + Nova Consulta
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#852A91] text-white font-semibold text-xs hover:bg-[#6F217B] transition-colors shadow-sm disabled:opacity-50"
            onClick={handleDownloadPdf}
            disabled={downloading || visits.length === 0}
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Gerando...' : 'Exportar Cartão (PDF)'}
          </button>
        </div>
      </div>

      {/* 2. RESUMO OBSTÉTRICO EXECUTIVO (Fundo #F7ECF8, Borda #B77AD8) */}
      <div className="rounded-xl bg-[#F7ECF8] border border-[#B77AD8]/60 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          {/* DUM */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">DUM</span>
            <strong className="text-sm text-[#1E293B] block mt-0.5">{formatIsoDate(dum)}</strong>
            <span className="text-[10px] text-[#852A91]">Última menstruação</span>
          </div>

          {/* DPP */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">DPP (Naegele)</span>
            <strong className="text-sm text-[#1E293B] block mt-0.5">{formatIsoDate(dpp)}</strong>
            <span className="text-[10px] text-[#852A91]">Data provável parto</span>
          </div>

          {/* IG Atual */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">IG Atual</span>
            <strong className="text-sm text-[#6F217B] block mt-0.5">
              {visits.length > 0
                ? `${visits[visits.length - 1].gestationalAgeWeeks}s ${visits[visits.length - 1].gestationalAgeDays}d`
                : initialGestationalAgeWeeks
                ? `${initialGestationalAgeWeeks}s ${initialGestationalAgeDays || 0}d`
                : '—'}
            </strong>
            <span className="text-[10px] text-[#64748B]">Idade gestacional</span>
          </div>

          {/* GPA */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Histórico GPA</span>
            <strong className="text-sm text-[#1E293B] block mt-0.5">
              {gynProfile
                ? `G${gynProfile.gravida ?? 1} P${gynProfile.para ?? 0} C${gynProfile.cesareans ?? 0} A${gynProfile.abortions ?? 0}`
                : 'G1 P0 C0 A0'}
            </strong>
            <span className="text-[10px] text-[#64748B]">
              {gynProfile?.livingChildren ? `${gynProfile.livingChildren} filhos vivos` : 'Primeira gravidez'}
            </span>
          </div>

          {/* Tipagem ABO/Rh */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Tipagem ABO/Rh</span>
            <strong className="text-sm text-[#852A91] block mt-0.5">
              {fullBloodType || (bloodType ? `${bloodType} ${rhFactor || ''}` : 'Não informada')}
            </strong>
            <span className="text-[10px] text-[#64748B]">
              {isRhNegative ? 'Rh Negativo' : 'Rh Positivo'}
            </span>
          </div>

          {/* Estatura & IMC Basal */}
          <div className="bg-white rounded-lg p-2.5 border border-[#E9D5FF]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">Estatura / IMC</span>
            <strong className="text-sm text-[#1E293B] block mt-0.5">{heightCm || 165} cm</strong>
            <span className="text-[10px] text-[#852A91]">
              {visits.length > 0 && visits[visits.length - 1].bmi
                ? `IMC: ${visits[visits.length - 1].bmi?.toFixed(1)}`
                : 'Acompanhamento'}
            </span>
          </div>
        </div>

        {/* Alerta de Rh Negativo e Aloimunização */}
        {isRhNegative && (
          <div className="mt-3 bg-[#FDF2F8] border border-[#D83C91]/40 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-[#9D174D]">
            <ShieldAlert className="w-4 h-4 text-[#D83C91] shrink-0" />
            <div>
              <strong>Gestante Rh Negativo — Vigilância de Aloimunização:</strong> Realizar Coombs Indireto trimestral e aplicar Imunoglobulina Anti-D (300 mcg) na 28ª semana e até 72h pós-parto caso o RN seja Rh+.
            </div>
          </div>
        )}
      </div>

      {/* 3. NAVEGAÇÃO ENTRE ABAS (Segmented Control) */}
      <div className="flex border-b border-[#E9D5FF] gap-2 pt-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('consultas')}
          className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'consultas'
              ? 'border-[#852A91] text-[#852A91]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Consultas & Gráficos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vacinas')}
          className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'vacinas'
              ? 'border-[#852A91] text-[#852A91]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <Syringe className="w-3.5 h-3.5" />
          Vacinas da Gestante
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sorologias')}
          className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'sorologias'
              ? 'border-[#852A91] text-[#852A91]'
              : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Sorologias por Trimestre
        </button>
      </div>

      {/* 4. CONTEÚDO DAS ABAS */}
      {activeTab === 'consultas' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-sm text-neutral-400">Carregando consultas pré-natais...</div>
          ) : visits.length === 0 ? (
            <div className="py-8 text-center bg-neutral-50 rounded-xl border border-dashed border-[#E9D5FF]">
              <Calendar className="w-8 h-8 text-[#B77AD8] mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-700">Nenhuma consulta pré-natal registrada</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Clique em "+ Nova Consulta" para registrar os parâmetros da visita obstétrica.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E9D5FF] rounded-xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E9D5FF] bg-[#FAF5FB] text-[#6F217B] font-bold">
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">IG (Sem/D)</th>
                    <th className="py-2.5 px-3">Peso (kg)</th>
                    <th className="py-2.5 px-3">IMC</th>
                    <th className="py-2.5 px-3">PA (mmHg)</th>
                    <th className="py-2.5 px-3">AU (cm)</th>
                    <th className="py-2.5 px-3">BCF (bpm)</th>
                    <th className="py-2.5 px-3">Mov. Fetal</th>
                    <th className="py-2.5 px-3">Edema</th>
                    <th className="py-2.5 px-3">Apresentação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9D5FF]/50">
                  {visits.map((v) => {
                    const effectiveBmi = v.bmi ?? (v.weightKg ? Number((v.weightKg / Math.pow((heightCm || 165) / 100, 2)).toFixed(1)) : null);
                    return (
                      <React.Fragment key={v.id}>
                        <tr className="hover:bg-[#FAF5FB] transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-[#1E293B]">
                            {new Date(v.visitDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-2.5 px-3 text-[#6F217B] font-medium">
                            {v.gestationalAgeWeeks}s {v.gestationalAgeDays}d
                          </td>
                          <td className="py-2.5 px-3 text-[#1E293B] font-medium">{v.weightKg.toFixed(1)}</td>
                          <td className="py-2.5 px-3 text-[#852A91] font-bold">{effectiveBmi ?? '-'}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#1E293B]">{v.bloodPressure}</td>
                          <td className="py-2.5 px-3 text-[#1E293B]">{v.uterineHeightCm ?? '-'}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#852A91]">{v.fetalHeartRateBpm ?? '-'}</td>
                          <td className="py-2.5 px-3 text-[#1E293B]">
                            {v.fetalMovementPresent === true
                              ? 'Presente'
                              : v.fetalMovementPresent === false
                              ? 'Ausente'
                              : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-[#64748B]">{v.edemaClassification || 'Ausente'}</td>
                          <td className="py-2.5 px-3 font-medium text-[#6F217B]">{v.fetalPresentation || '-'}</td>
                        </tr>
                        {v.clinicalNotes && (
                          <tr className="bg-[#FAF5FB]/60 text-[11px] text-[#64748B]">
                            <td colSpan={10} className="py-1 px-3 italic border-b border-[#E9D5FF]/40">
                              <span className="font-semibold text-[#6F217B]">Conduta/Notas:</span> {v.clinicalNotes}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Gráficos sempre visíveis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            <AtalahWeightGainChart visits={visits} heightCm={heightCm} />
            <UterineHeightChart visits={visits} />
          </div>
        </div>
      )}

      {/* ABA 2: VACINAS DA GESTANTE */}
      {activeTab === 'vacinas' && (
        <div className="space-y-3">
          <div className="bg-[#FAF5FB] p-3 rounded-lg border border-[#E9D5FF] text-xs text-[#64748B] leading-relaxed">
            <strong className="text-[#6F217B] font-bold block mb-0.5">Calendário Vacinal da Gestante (SBIm / FEBRASGO / Ministério da Saúde)</strong>
            As vacinas na gravidez induzem produção de imunoglobulinas maternas (IgG) que atravessam a barreira placentária, conferindo imunidade passiva ao bebê nos primeiros meses de vida.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {vaccines.map((vac) => {
              const isApplied = vac.status === 'Aplicada';
              return (
                <div key={vac.id} className="p-3.5 rounded-xl border border-[#E9D5FF] bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-[#6F217B] text-sm">{vac.name}</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isApplied
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : vac.status === 'Agendada'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : vac.status === 'Não indicada'
                            ? 'bg-neutral-100 text-neutral-600'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {vac.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mb-2">{vac.target}</p>
                    <span className="text-[10px] text-[#852A91] font-medium block mb-2">{vac.window}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1E8F5] text-[11px]">
                    <span className="text-[#64748B]">{vac.date || 'Sem data'} {vac.lot ? `(${vac.lot})` : ''}</span>
                    <div className="flex gap-1">
                      {(['Aplicada', 'Pendente', 'Agendada'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateVaccine(vac.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                            vac.status === st ? 'bg-[#852A91] text-white' : 'bg-[#FAF5FB] text-[#64748B] hover:bg-[#F7ECF8]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: SOROLOGIAS POR TRIMESTRE */}
      {activeTab === 'sorologias' && (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-[#E9D5FF] rounded-xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#6F217B] text-white text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">Exame / Parâmetro</th>
                  <th className="py-2.5 px-3 text-center">1º Trimestre</th>
                  <th className="py-2.5 px-3 text-center">2º Trimestre</th>
                  <th className="py-2.5 px-3 text-center">3º Trimestre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D5FF]/60 text-xs">
                {serologies.map((s, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF5FB]'}>
                    <td className="py-2 px-3 font-semibold text-[#1E293B]">
                      {s.exam}
                      <span className="block text-[10px] text-[#64748B] font-normal">{s.description}</span>
                    </td>
                    <td className="py-2 px-3 text-center text-[#1E293B] font-medium">{s.tri1}</td>
                    <td className="py-2 px-3 text-center text-[#1E293B] font-medium">{s.tri2}</td>
                    <td className="py-2 px-3 text-center text-[#852A91] font-semibold">{s.tri3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO DE CONSULTA PRÉ-NATAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E9D5FF] max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E9D5FF] pb-3">
              <h4 className="font-bold text-[#6F217B] text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#852A91]" />
                Registrar Consulta de Pré-Natal
              </h4>
              <button
                type="button"
                className="text-[#64748B] hover:text-[#1E293B] font-bold p-1 rounded"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Data da Consulta *</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Pressão Arterial (PA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 120/80"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
              </div>

              {/* Idade Gestacional */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prenatal-weeks" className="block font-semibold text-[#1E293B] mb-1">IG Semanas *</label>
                  <input
                    id="prenatal-weeks"
                    type="number"
                    min="4"
                    max="44"
                    required
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
                <div>
                  <label htmlFor="prenatal-days" className="block font-semibold text-[#1E293B] mb-1">IG Dias</label>
                  <input
                    id="prenatal-days"
                    type="number"
                    min="0"
                    max="6"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
              </div>

              {/* Biometria e IMC Dinâmico */}
              <div className="bg-[#FAF5FB] p-3 rounded-xl border border-[#E9D5FF] space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1E293B] mb-1">Peso Atual (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="300"
                      required
                      placeholder="65.0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full border rounded-lg p-2 border-[#CBD5E1] bg-white outline-none focus:border-[#852A91]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1E293B] mb-1">Estatura Materna (cm)</label>
                    <input
                      type="number"
                      step="1"
                      min="100"
                      max="220"
                      value={maternalHeightInput}
                      onChange={(e) => setMaternalHeightInput(e.target.value)}
                      className="w-full border rounded-lg p-2 border-[#CBD5E1] bg-white outline-none focus:border-[#852A91]"
                    />
                  </div>
                </div>

                {calculatedBmi && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-[#6F217B]">
                      IMC Calculado: {calculatedBmi.toFixed(1)} kg/m²
                    </span>
                    {bmiClassification && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ color: bmiClassification.color, backgroundColor: bmiClassification.bg }}
                      >
                        {bmiClassification.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Parâmetros Fetais */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">AU (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="24"
                    value={uterineHeight}
                    onChange={(e) => setUterineHeight(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">BCF (bpm)</label>
                  <input
                    type="number"
                    placeholder="145"
                    value={fhr}
                    onChange={(e) => setFhr(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Edema</label>
                  <select
                    value={edema}
                    onChange={(e) => setEdema(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  >
                    <option value="Ausente">Ausente</option>
                    <option value="+/4+">+/4+</option>
                    <option value="++/4+">++/4+</option>
                    <option value="+++/4+">+++/4+</option>
                    <option value="++++/4+">++++/4+</option>
                  </select>
                </div>
              </div>

              {/* Movimentação Fetal e Apresentação Fetal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Movimento Fetal</label>
                  <select
                    value={movement === null ? 'null' : String(movement)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMovement(val === 'null' ? null : val === 'true');
                    }}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  >
                    <option value="true">Presente / Ativo</option>
                    <option value="false">Ausente / Reduzido</option>
                    <option value="null">Não aplicável (&lt; 18s)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Apresentação Fetal</label>
                  <select
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91]"
                  >
                    <option value="Cefálica">Cefálica</option>
                    <option value="Pélvica">Pélvica</option>
                    <option value="Córmica / Transversa">Córmica / Transversa</option>
                    <option value="Indiferente">Indiferente</option>
                  </select>
                </div>
              </div>

              {/* Conduta e Observações Clínicas */}
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Conduta e Observações Clínicas</label>
                <textarea
                  rows={3}
                  placeholder="Conduta, exames solicitados e queixas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg p-2 border-[#CBD5E1] outline-none focus:border-[#852A91] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E9D5FF]">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] text-[#64748B] font-semibold hover:bg-neutral-50 transition"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-[#852A91] text-white font-bold hover:bg-[#6F217B] transition shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Gravando...' : 'Salvar Consulta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
