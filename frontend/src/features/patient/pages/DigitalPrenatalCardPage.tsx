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
}

const defaultVisits: PrenatalVisit[] = [
  {
    week: 24,
    date: '14/10/2024',
    title: 'Consulta de Rotina do 2º Trimestre',
    bloodPressure: '110 x 70 mmHg',
    fetalHeartRateBpm: 144,
    uterineHeightCm: 23,
    weightKg: 64.8,
    notes:
      'Desenvolvimento fetal compatível com a idade gestacional. Movimentação fetal ativa e percebida pela gestante diariamente. Manutenção de suplementação de sulfato ferroso e metilfolato.',
  },
  {
    week: 20,
    date: '16/09/2024',
    title: 'Ultrassonografia Morfológica de 2º Trimestre',
    bloodPressure: '115 x 75 mmHg',
    fetalHeartRateBpm: 148,
    uterineHeightCm: 19,
    weightKg: 62.5,
    notes:
      'Estudo morfológico detalhado sem alterações detectáveis. Doppler de artérias uterinas com fluxo de baixa resistência normal para a idade gestacional.',
    isUltrasound: true,
  },
  {
    week: 12,
    date: '22/07/2024',
    title: 'US Translucência Nucal & Triagem',
    bloodPressure: '110 x 70 mmHg',
    fetalHeartRateBpm: 156,
    notes:
      'Translucência nucal (TN) medindo 1.4 mm. Osso nasal presente e ducto venoso normal. Triagem com baixo risco para aneuploidias.',
    isUltrasound: true,
  },
];

const defaultDocuments: AttachedDocument[] = [
  {
    id: '1',
    title: 'Morfologia Fetal 2T.pdf',
    date: '16/09/2024',
    size: '3.4 MB',
    doctorOrLab: 'Dr. Arthur Albuquerque',
  },
  {
    id: '2',
    title: 'Hemograma Completo.pdf',
    date: '14/10/2024',
    size: '1.1 MB',
    doctorOrLab: 'Lab Cana Med',
  },
  {
    id: '3',
    title: 'Ecocardiograma Fetal.pdf',
    date: '18/09/2024',
    size: '4.2 MB',
    doctorOrLab: 'Dra. Camila Vasconcelos',
  },
];

export const DigitalPrenatalCardPage: React.FC<DigitalPrenatalCardPageProps> = ({
  patientName = 'Juliana Rocha Mendes',
  recordNumber = '2024-8842-OBST',
  bloodType = 'A+',
  isRhNegative = false,
  gestationalAgeText = '26 sem e 3 dias',
  currentWeeks = 26,
  totalWeeks = 40,
  lastMenstrualPeriod = '15/04/2024',
  estimatedDueDate = '20/01/2025',
  daysRemaining = 95,
  responsibleDoctor = 'Dr. Arthur Albuquerque',
  doctorCrm = 'CRM/SP 148.902',
  nextAppointmentDate = 'Seg, 04/Nov às 10:00',
  visits = defaultVisits,
  documents = defaultDocuments,
  sessionToken,
  onBack,
  onDownloadPdf,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const percentage = Math.min(100, Math.max(0, Math.round((currentWeeks / totalWeeks) * 100)));

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      if (onDownloadPdf) {
        await onDownloadPdf();
      } else if (sessionToken) {
        const blob = await patientApi.downloadPrenatalCardPdf(sessionToken);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cartao_Gestante_${patientName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } catch (err) {
      console.error(err);
      setDownloadError('Não foi possível gerar o PDF no momento. Tente novamente ou use a impressão.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="serene-page min-h-screen text-[var(--color-serene-on-surface)] pb-24">
      {/* Print Styles for clean A4 physical print */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, button, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .serene-card, section {
            box-shadow: none !important;
            border: 1px solid #d1d5db !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* TOP APP BAR (Sticky on mobile, static inside desktop layout) */}
      <header className="sticky top-0 left-0 w-full z-20 bg-[var(--color-serene-surface)]/90 backdrop-blur-md px-4 py-3 border-b border-[var(--color-serene-outline-variant)]/30 lg:border-b-0 lg:bg-transparent lg:shadow-none flex items-center justify-between shadow-sm no-print max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar para tela anterior"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-container)] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-base md:text-lg font-bold text-[var(--color-serene-primary-text)] tracking-tight">
              Cartão da Gestante
            </h1>
            <p className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
              Seu acompanhamento pré-natal em um só lugar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-serene-outline-variant)] bg-[var(--color-serene-surface-card)] text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-container-low)] text-xs font-semibold shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>{isDownloading ? 'Gerando...' : 'Baixar Cartão em PDF'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-4 md:pt-6 space-y-6">
        {/* STATUS CLÍNICO & ALERTA RH NEGATIVO [P1-02] */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-1.5 bg-[var(--color-serene-surface-container)] text-[var(--color-serene-secondary)] px-3 py-1 rounded-full text-xs font-semibold border border-[var(--color-serene-outline-variant)]/40">
            <span className="w-2 h-2 rounded-full bg-[var(--color-serene-primary)] animate-pulse" />
            <span>Gestação em Acompanhamento Ativo</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-serene-on-surface-variant)] font-semibold">
              Tipo Sanguíneo: {bloodType}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isRhNegative
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isRhNegative ? 'Rh Negativo' : 'Rh Positivo'}
            </span>
          </div>
        </div>

        {/* ALERTA CLÍNICO RH NEGATIVO (SE APLICÁVEL) */}
        {isRhNegative && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
            <span
              className="material-symbols-outlined text-[20px] text-rose-700 shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <div className="space-y-0.5">
              <span className="font-bold block">Alerta Rh Negativo</span>
              <p>
                Acompanhamento de Coombs Indireto e Profilaxia Anti-D recomendada na 28ª semana para prevenção de isoimunização materna.
              </p>
            </div>
          </div>
        )}

        {/* 1. CLINICAL IDENTIFICATION BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-serene-surface-card)] via-[var(--color-serene-surface-container-low)] to-[var(--color-serene-surface-container)]/50 border border-[var(--color-serene-outline-variant)]/40 p-5 md:p-6 serene-shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--color-serene-secondary-fixed)] flex items-center justify-center text-[var(--color-serene-secondary)] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pregnant_woman
                </span>
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-serene-primary-text)]">
                    Prontuário Pré-Natal Digital
                  </span>
                  <span className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
                    Nº {recordNumber}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-serene-on-surface)] truncate">
                  {patientName}
                </h2>
                <p className="text-xs text-[var(--color-serene-secondary)] font-medium">
                  Identificação: Gestação Única Tópica
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--color-serene-primary-text)] font-bold">
                <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                <span>Validação Médica Cana Med</span>
              </div>
              <p className="text-[var(--color-serene-on-surface-variant)]">
                Obstetra: <strong className="text-[var(--color-serene-on-surface)]">{responsibleDoctor}</strong> ({doctorCrm})
              </p>
            </div>
          </div>

          {/* 4 HORIZONTAL METRIC CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {/* 1. Idade Gestacional */}
            <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 space-y-1">
              <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] font-semibold block uppercase">
                Idade Gestacional Hoje
              </span>
              <p className="text-lg md:text-xl font-extrabold text-[var(--color-serene-primary-text)]">
                {gestationalAgeText}
              </p>
              <span className="text-[11px] text-[var(--color-serene-secondary)] font-medium block">
                2º Trimestre
              </span>
            </div>

            {/* 2. DUM */}
            <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 space-y-1">
              <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] font-semibold block uppercase">
                DUM (Última Menstruação)
              </span>
              <p className="text-lg md:text-xl font-bold text-[var(--color-serene-on-surface)]">
                {lastMenstrualPeriod}
              </p>
              <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] block">
                Confirmada por US
              </span>
            </div>

            {/* 3. DPP */}
            <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 space-y-1">
              <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] font-semibold block uppercase">
                DPP Estimada (Previsão)
              </span>
              <p className="text-lg md:text-xl font-extrabold text-[var(--color-serene-secondary)]">
                {estimatedDueDate}
              </p>
              <span className="text-[11px] text-[var(--color-serene-primary-text)] font-semibold block">
                Faltam ~{daysRemaining} dias
              </span>
            </div>

            {/* 4. Próxima Consulta */}
            <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 space-y-1">
              <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] font-semibold block uppercase">
                Próxima Consulta
              </span>
              <p className="text-sm md:text-base font-bold text-[var(--color-serene-on-surface)]">
                {nextAppointmentDate}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Confirmada com Obstetra
              </span>
            </div>
          </div>

          {/* Mini Weekly Progress Bar */}
          <div className="mt-4 p-3 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/20 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[var(--color-serene-on-surface-variant)]">
                Progresso da Gestação
              </span>
              <span className="font-bold text-[var(--color-serene-primary-text)]">
                {percentage}% concluído
              </span>
            </div>
            <div className="w-full bg-[var(--color-serene-surface-container)] h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[var(--color-serene-secondary)] to-[var(--color-serene-primary-container)] h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--color-serene-on-surface-variant)]">
              <span>Semana 1</span>
              <span className="font-bold text-[var(--color-serene-secondary)]">Semana {currentWeeks}</span>
              <span>Semana {totalWeeks}</span>
            </div>
          </div>
        </section>

        {/* 2-COLUMN BALANCED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: TIMELINE (7 COLS) */}
          <section className="lg:col-span-7 serene-card rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-serene-surface-container)] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[var(--color-serene-secondary-fixed)] text-[var(--color-serene-secondary)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    timeline
                  </span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-serene-on-surface)]">
                    Linha do Tempo Pré-Natal
                  </h3>
                  <p className="text-xs text-[var(--color-serene-on-surface-variant)]">
                    Consultas, sinais vitais e condutas clínicas
                  </p>
                </div>
              </div>

              <span className="text-xs text-[var(--color-serene-on-surface-variant)]">
                {visits.length} registros
              </span>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-serene-outline-variant)]/60">
              {visits.map((v, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point */}
                  <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[var(--color-serene-primary)] ring-4 ring-[var(--color-serene-surface-card)] shadow-xs" />

                  <div className="p-4 rounded-xl bg-[var(--color-serene-surface-container-low)]/70 border border-[var(--color-serene-outline-variant)]/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-serene-primary-text)] uppercase">
                        {v.week}ª SEMANA
                      </span>
                      <span className="text-xs text-[var(--color-serene-on-surface-variant)]">
                        {v.date}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)]">
                      {v.title}
                    </h4>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      {v.bloodPressure && (
                        <div className="p-2 rounded-lg bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/20">
                          <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] block">
                            PA
                          </span>
                          <span className="font-bold text-[var(--color-serene-on-surface)]">
                            {v.bloodPressure}
                          </span>
                        </div>
                      )}
                      {v.fetalHeartRateBpm !== undefined && (
                        <div className="p-2 rounded-lg bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/20">
                          <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] block">
                            BCF
                          </span>
                          <span className="font-bold text-[var(--color-serene-primary-text)]">
                            {v.fetalHeartRateBpm} bpm
                          </span>
                        </div>
                      )}
                      {v.uterineHeightCm !== undefined && (
                        <div className="p-2 rounded-lg bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/20">
                          <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] block">
                            Alt. Uterina
                          </span>
                          <span className="font-bold text-[var(--color-serene-on-surface)]">
                            {v.uterineHeightCm} cm
                          </span>
                        </div>
                      )}
                      {v.weightKg !== undefined && (
                        <div className="p-2 rounded-lg bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/20">
                          <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] block">
                            Peso
                          </span>
                          <span className="font-bold text-[var(--color-serene-secondary)]">
                            {v.weightKg} kg
                          </span>
                        </div>
                      )}
                    </div>

                    {v.notes && (
                      <p className="text-xs text-[var(--color-serene-on-surface-variant)] leading-relaxed pt-1 border-t border-[var(--color-serene-outline-variant)]/20">
                        {v.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: DOCUMENTOS E ORIENTAÇÕES (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. DOCUMENTOS E LAUDOS ANEXADOS */}
            <section className="serene-card rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-serene-surface-container)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[var(--color-serene-secondary-fixed)] text-[var(--color-serene-secondary)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">folder_open</span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-serene-on-surface)]">
                      Documentos e Laudos
                    </h3>
                    <p className="text-xs text-[var(--color-serene-on-surface-variant)]">
                      Exames e ultrassonografias oficiais
                    </p>
                  </div>
                </div>

                <span className="text-xs text-[var(--color-serene-primary-text)] font-bold">
                  {documents.length} arquivos
                </span>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-[var(--color-serene-surface-container-low)]/60 border border-[var(--color-serene-outline-variant)]/30 flex items-center justify-between hover:border-[var(--color-serene-primary)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-serene-surface-card)] flex items-center justify-center text-[var(--color-serene-primary-text)] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--color-serene-on-surface)] truncate">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
                          {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label={`Visualizar ${doc.title}`}
                        className="p-1.5 rounded-lg text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-card)] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {downloadError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {downloadError}
                </p>
              )}
            </section>

            {/* 2. SINAIS DE ALERTA */}
            <section className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-purple-50/50 border border-rose-200/80 serene-shadow-soft space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-rose-600 text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
                <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)]">
                  Orientações & Sinais de Alerta
                </h4>
              </div>

              <p className="text-xs text-[var(--color-serene-on-surface-variant)] leading-relaxed">
                Contate a equipe médica imediatamente caso identifique:
              </p>

              <ul className="space-y-1.5 text-xs text-[var(--color-serene-on-surface)]">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Sangramento vaginal</strong> de qualquer intensidade ou perda de líquido.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Dor de cabeça intensa</strong> com visão embaçada.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Redução marcante</strong> dos movimentos fetais (&gt;12h).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Febre acima de 37.8°C</strong> ou ardor miccional intenso.</span>
                </li>
              </ul>

              <div className="pt-2 no-print">
                <a
                  href="tel:08007702262"
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Ligar para Emergência 24h</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
