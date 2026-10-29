import React, { useState } from 'react';
import { patientApi } from '../patientApi';
import '../patient-serene.css';

export interface PrenatalVisit {
  week: number;
  date: string;
  title: string;
  bloodPressure: string;
  fetalHeartRateBpm?: number;
  uterineHeightCm?: number;
  weightKg?: number;
  notes?: string;
  isUltrasound?: boolean;
}

export interface AttachedDocument {
  id: string;
  title: string;
  date: string;
  size: string;
  doctorOrLab: string;
  pdfUrl?: string;
}

export interface DigitalPrenatalCardPageProps {
  patientName?: string;
  recordNumber?: string;
  bloodType?: string;
  isRhNegative?: boolean;
  gestationalAgeText?: string;
  currentWeeks?: number;
  totalWeeks?: number;
  lastMenstrualPeriod?: string;
  estimatedDueDate?: string;
  daysRemaining?: number;
  responsibleDoctor?: string;
  doctorCrm?: string;
  nextAppointmentDate?: string;
  visits?: PrenatalVisit[];
  documents?: AttachedDocument[];
  sessionToken?: string;
  onBack?: () => void;
  onDownloadPdf?: () => Promise<void> | void;
  onNavigateTab?: (tab: string) => void;
}

const defaultVisits: PrenatalVisit[] = [
  {
    week: 24,
    date: '14/10/2024',
    title: 'Consulta de rotina e aferição clínica',
    bloodPressure: '110 x 70 mmHg',
    fetalHeartRateBpm: 144,
    uterineHeightCm: 23,
    weightKg: 64.8,
    notes:
      'Desenvolvimento fetal compatível com a idade gestacional. Movimentação fetal ativa.',
  },
  {
    week: 20,
    date: '16/09/2024',
    title: 'Ultrassonografia Morfológica de 2º trimestre',
    bloodPressure: '115 x 75 mmHg',
    fetalHeartRateBpm: 148,
    uterineHeightCm: 19,
    weightKg: 62.5,
    notes: 'Parâmetros biométricos dentro da normalidade para a IG.',
    isUltrasound: true,
  },
  {
    week: 12,
    date: '22/07/2024',
    title: 'Ultrassom de Translucência Nucal',
    bloodPressure: '110 x 70 mmHg',
    fetalHeartRateBpm: 156,
    notes:
      'Exames laboratoriais de sangue e sorologias do 1º trimestre concluídos com sucesso.',
    isUltrasound: true,
  },
];

const defaultDocuments: AttachedDocument[] = [
  {
    id: '1',
    title: 'Morfologia Fetal 2T.pdf',
    date: '16 Set 2024',
    size: '2.4 MB',
    doctorOrLab: 'Dr. Arthur Albuquerque',
  },
  {
    id: '2',
    title: 'Hemograma Completo.pdf',
    date: '14 Out 2024',
    size: '640 KB',
    doctorOrLab: 'Lab Cana Med',
  },
];

export const DigitalPrenatalCardPage: React.FC<DigitalPrenatalCardPageProps> = ({
  patientName = 'Juliana Rocha Mendes',
  bloodType = 'A+',
  isRhNegative = false,
  gestationalAgeText = '26 sem e 3 dias',
  currentWeeks = 26,
  totalWeeks = 40,
  lastMenstrualPeriod = '15/04/2024',
  estimatedDueDate = '20/01/2025',
  responsibleDoctor = 'Dr. Arthur Albuquerque',
  doctorCrm = 'Médico Obstetra & Fisiologia Fetal',
  nextAppointmentDate = 'Seg, 04/Nov • 10:00',
  visits = defaultVisits,
  documents = defaultDocuments,
  sessionToken,
  onBack,
  onDownloadPdf,
  onNavigateTab,
}) => {
  const [downloading, setDownloading] = useState(false);

  const progressPercent = Math.min(100, Math.round((currentWeeks / totalWeeks) * 100));

  const handleDownload = async () => {
    if (onDownloadPdf) {
      await onDownloadPdf();
      return;
    }

    if (sessionToken) {
      setDownloading(true);
      try {
        const blob = await patientApi.downloadPrenatalCardPdf(sessionToken);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cartao-gestante-${patientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Falha ao baixar PDF:', err);
      } finally {
        setDownloading(false);
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body-md min-h-screen flex justify-center selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Mobile Container Wrapper */}
      <div className="w-full max-w-md bg-surface min-h-screen relative flex flex-col pb-24 shadow-2xl">
        {/* Top App Bar */}
        <header className="sticky top-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-md px-4 pt-3 pb-3 border-b border-outline-variant/30 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              aria-label="Voltar para tela anterior"
              className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container active:scale-95 transition-all"
              type="button"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-headline-sm font-headline-sm text-primary tracking-tight font-bold">
                Cartão da Gestante
              </h1>
              <p className="text-label-sm font-label-sm text-tertiary">
                Seu acompanhamento pré-natal em um só lugar
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 pl-1">
            <img
              alt="Logo Cana Med Mulher"
              className="h-8 w-auto object-contain"
              src="/assets/brand/canamed_logo-removebg-preview.png"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pt-4 space-y-6">
          {/* Badge de Status Clínico */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="inline-flex items-center gap-1.5 bg-surface-container text-secondary px-3 py-1 rounded-full text-label-md font-label-md border border-outline-variant/30 font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Gestação em Acompanhamento Ativo
              </div>
              <span className="text-label-md font-label-md text-tertiary font-bold">
                {bloodType} | {isRhNegative ? 'Rh Negativo' : 'Rh Positivo'}
              </span>
            </div>
            {isRhNegative && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between">
                <span className="font-bold">Alerta Rh Negativo</span>
                <span>Acompanhamento de Coombs Indireto e Profilaxia Anti-D</span>
              </div>
            )}
          </div>

          {/* Card Principal: Resumo da Gestação */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container p-5 border border-outline-variant/40 custom-luminescence">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3 mb-4">
              <div>
                <span className="text-label-sm font-label-sm uppercase tracking-wider text-primary font-bold">
                  Prontuário Pré-Natal Digital
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface font-bold mt-0.5">
                  {patientName}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-tertiary text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  <span>Identificação: Gestação Única Tópica</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0 shadow-sm">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  pregnant_woman
                </span>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Idade Gestacional */}
              <div className="col-span-2 bg-surface-container-lowest/90 backdrop-blur p-3.5 rounded-xl border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-label-sm font-label-sm text-tertiary font-semibold block">
                    IDADE GESTACIONAL HOJE
                  </span>
                  <span className="text-headline-md font-headline-md text-primary font-bold">
                    {gestationalAgeText}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-label-md font-label-md text-secondary font-bold bg-surface-container px-2.5 py-1 rounded-full">
                    2º Trimestre
                  </span>
                </div>
              </div>

              {/* DUM */}
              <div className="bg-surface-container-lowest/80 p-3 rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-tertiary text-label-sm font-label-sm mb-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    calendar_today
                  </span>
                  <span>DUM</span>
                </div>
                <span className="text-body-md font-body-md font-bold text-on-surface">
                  {lastMenstrualPeriod}
                </span>
                <span className="text-label-sm font-label-sm text-tertiary block mt-0.5">
                  Última Menstruação
                </span>
              </div>

              {/* DPP */}
              <div className="bg-surface-container-lowest/80 p-3 rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-tertiary text-label-sm font-label-sm mb-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    event_available
                  </span>
                  <span>DPP Estimada</span>
                </div>
                <span className="text-body-md font-body-md font-bold text-primary">
                  {estimatedDueDate}
                </span>
                <span className="text-label-sm font-label-sm text-tertiary block mt-0.5">
                  Previsão do Parto
                </span>
              </div>
            </div>

            {/* Mini Progress Bar de Gestação */}
            <div className="bg-surface-container-lowest/90 p-3 rounded-xl border border-outline-variant/20">
              <div className="flex justify-between items-center text-label-sm font-label-sm mb-1.5">
                <span className="text-tertiary font-semibold">Progresso da Gestação</span>
                <span className="text-primary font-bold">{progressPercent}% concluído</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-primary-container h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-tertiary mt-1.5">
                <span>Semana 1</span>
                <span className="font-bold text-secondary">Semana {currentWeeks}</span>
                <span>Semana {totalWeeks}</span>
              </div>
            </div>
          </section>

          {/* Card: Próxima Consulta de Pré-Natal */}
          <section className="rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30 card-shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                </span>
                <h3 className="text-label-lg font-label-lg font-bold text-on-surface">
                  Próxima Consulta de Pré-Natal
                </h3>
              </div>
              <span className="bg-primary/10 text-primary font-bold text-label-sm font-label-sm px-2.5 py-0.5 rounded-full">
                Confirmada
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-body-md font-body-md font-bold text-on-surface">
                    {responsibleDoctor}
                  </p>
                  <p className="text-label-md font-label-md text-tertiary">
                    {doctorCrm}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 grid grid-cols-2 gap-2 text-label-md font-label-md">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    schedule
                  </span>
                  <span>{nextAppointmentDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    location_on
                  </span>
                  <span>Unidade Paulista</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Baixar Cartão em PDF"
              onClick={handleDownload}
              disabled={downloading}
              className="mt-3 w-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-lg py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-sm font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">
                {downloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{downloading ? 'Gerando Cartão...' : 'Baixar Cartão em PDF'}</span>
            </button>
          </section>

          {/* Seção: Linha do Tempo Pré-Natal */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">timeline</span>
                </span>
                <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                  Linha do Tempo Pré-Natal
                </h3>
              </div>
              <span className="text-label-sm font-label-sm text-tertiary">
                {visits.length} registros
              </span>
            </div>

            {/* Vertical Timeline Items */}
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/50">
              {visits.map((v, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-4 border-surface flex items-center justify-center shadow-sm ${
                      idx === 0
                        ? 'bg-primary-container'
                        : idx === 1
                        ? 'bg-secondary'
                        : 'bg-outline'
                    }`}
                  />
                  <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20 card-shadow-soft">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-label-md font-label-md font-bold text-primary">
                        {v.week}ª SEMANA
                      </span>
                      <span className="text-label-sm font-label-sm text-tertiary">{v.date}</span>
                    </div>
                    <p className="text-body-sm font-body-sm font-semibold text-on-surface">
                      {v.title}
                    </p>
                    {v.notes && (
                      <p className="text-label-md font-label-md text-tertiary mt-0.5">
                        {v.notes}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                      <div className="bg-surface-container px-2.5 py-1 rounded-lg text-label-md font-label-md text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">
                          monitor_heart
                        </span>
                        <span>
                          PA: <strong>{v.bloodPressure}</strong>
                        </span>
                      </div>
                      {v.fetalHeartRateBpm && (
                        <div className="bg-surface-container px-2.5 py-1 rounded-lg text-label-md font-label-md text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            favorite
                          </span>
                          <span>
                            BCF: <strong>{v.fetalHeartRateBpm} bpm</strong>
                          </span>
                        </div>
                      )}
                      {v.uterineHeightCm && (
                        <div className="bg-surface-container px-2.5 py-1 rounded-lg text-label-md font-label-md text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-primary">
                            straighten
                          </span>
                          <span>
                            AU: <strong>{v.uterineHeightCm} cm</strong>
                          </span>
                        </div>
                      )}
                      {v.weightKg && (
                        <div className="bg-surface-container px-2.5 py-1 rounded-lg text-label-md font-label-md text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            scale
                          </span>
                          <span>
                            Peso: <strong>{v.weightKg} kg</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Documentos e Laudos Anexados */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">folder_open</span>
                </span>
                <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                  Documentos e Laudos Anexados
                </h3>
              </div>
              <span className="text-label-sm font-label-sm text-primary font-bold">
                {documents.length} arquivos
              </span>
            </div>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between hover:border-primary-container/40 transition-colors card-shadow-soft"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">
                        picture_as_pdf
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm font-body-sm font-bold text-on-surface truncate">
                        {doc.title}
                      </p>
                      <p className="text-label-sm font-label-sm text-tertiary">
                        {doc.date} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (doc.pdfUrl) {
                        window.open(doc.pdfUrl, '_blank');
                      } else {
                        handleDownload();
                      }
                    }}
                    className="ml-2 px-3 py-1.5 rounded-lg bg-surface-container text-secondary text-label-md font-label-md font-bold hover:bg-secondary hover:text-on-secondary active:scale-95 transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Visualizar</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Aviso Institucional */}
          <section className="rounded-xl bg-surface-container-high/60 border border-outline-variant/40 p-3.5 flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0 mt-0.5">
              verified_user
            </span>
            <div className="text-label-md font-label-md text-tertiary">
              <span className="font-bold text-on-surface block mb-0.5">
                Validação Médica Cana Med
              </span>
              Informações preenchidas e validadas pela equipe obstétrica da Cana Med Mulher.
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav
          aria-label="Navegação Principal"
          className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 h-16 bg-surface border-t border-outline-variant/30 max-w-md mx-auto shadow-[0_-4px_16px_rgba(75,30,90,0.06)]"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <button
            type="button"
            onClick={() => onNavigateTab?.('inicio')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="text-label-sm font-label-sm">Início</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('agendar')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
            <span className="text-label-sm font-label-sm">Agendar</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('consultas')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            <span className="text-label-sm font-label-sm">Consultas</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center text-primary font-bold gap-1 active:scale-90 relative"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pregnant_woman
            </span>
            <span className="text-label-sm font-label-sm">Pré-natal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary absolute -bottom-1" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('perfil')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
            <span className="text-label-sm font-label-sm">Perfil</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
