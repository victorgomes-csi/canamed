import React, { useState } from 'react';
import { PrenatalWidget } from '../components/PrenatalWidget';
import '../patient-serene.css';

export interface PatientDashboardPageProps {
  patientName?: string;
  hasActivePregnancy?: boolean;
  appointmentDateTime?: string; // ISO string
  onBookAppointment?: () => void;
  onReschedule?: () => void;
  onViewAppointmentDetails?: () => void;
  onNavigateSection?: (section: string) => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  patientName = 'Juliana',
  hasActivePregnancy = true,
  appointmentDateTime,
  onBookAppointment,
  onReschedule,
  onViewAppointmentDetails,
  onNavigateSection,
}) => {
  const [rescheduleNotice, setRescheduleNotice] = useState<string | null>(null);

  const handleRescheduleClick = () => {
    if (appointmentDateTime) {
      const apptTime = new Date(appointmentDateTime).getTime();
      const now = Date.now();
      const diffHours = (apptTime - now) / (1000 * 60 * 60);

      // RN-013: Validação de 2 horas de antecedência
      if (diffHours < 2) {
        setRescheduleNotice(
          'Para remarcações com menos de 2 horas de antecedência, entre em contato com a recepção pelo telefone ou WhatsApp.'
        );
        return;
      }
    }

    setRescheduleNotice(null);
    if (onReschedule) {
      onReschedule();
    }
  };

  return (
    <div className="serene-page text-[var(--color-serene-on-surface)] pb-24">
      {/* Mobile Top Header (Shared Anchor - Hidden on Desktop since PatientLayoutSerene provides Desktop TopBar) */}
      <header className="lg:hidden sticky top-0 left-0 w-full z-40 bg-[var(--color-serene-surface)]/90 backdrop-blur-md px-4 py-3 border-b border-[var(--color-serene-outline-variant)]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-serene-primary-container)]/15 flex items-center justify-center text-[var(--color-serene-primary-text)] font-bold text-sm">
            CM
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--color-serene-primary-text)] leading-tight">
              Cana Med Mulher
            </h1>
            <span className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
              Portal da Paciente
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:08007702262"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-serene-primary-fixed)] text-[var(--color-serene-primary-text)] text-xs font-semibold"
            aria-label="Plantão Obstétrico 24h"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>24h</span>
          </a>
          <div className="w-8 h-8 rounded-full bg-[var(--color-serene-surface-container)] flex items-center justify-center text-[var(--color-serene-primary-text)] font-semibold text-xs border border-[var(--color-serene-outline-variant)]">
            {patientName.charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* HERO / WELCOME GREETING */}
        <section className="bg-gradient-to-br from-[var(--color-serene-surface-card)] via-[var(--color-serene-surface-container-low)] to-[var(--color-serene-surface-container)]/40 p-6 md:p-8 rounded-3xl border border-[var(--color-serene-outline-variant)]/40 serene-shadow-soft relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--color-serene-primary-container)]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-serene-secondary-fixed)] text-[var(--color-serene-secondary)] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span>Espaço Saúde da Mulher</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-serene-on-surface)] tracking-tight">
                Olá, <span className="text-[var(--color-serene-primary-text)]">{patientName}</span>
              </h1>
              <p className="text-sm md:text-base text-[var(--color-serene-on-surface-variant)] max-w-xl">
                Veja seus próximos compromissos e acompanhe seu cuidado com serenidade.{' '}
                {hasActivePregnancy ? 'Você e sua bebê estão em boas mãos.' : 'Sua saúde preventiva está em primeiro lugar.'}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={onBookAppointment}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--color-serene-primary-text)] to-[var(--color-serene-primary)] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-[rgba(216,37,124,0.25)] hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                <span>Agendar consulta</span>
              </button>
            </div>
          </div>
        </section>

        {/* 12-COLUMN DESKTOP / SINGLE COLUMN MOBILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAIN COLUMN (8 COLS ON DESKTOP) */}
          <div className="lg:col-span-8 space-y-6">
            {/* PRÓXIMA CONSULTA */}
            <section className="serene-card rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-serene-surface-container)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[var(--color-serene-primary-fixed)] text-[var(--color-serene-primary-text)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">event_available</span>
                  </span>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-serene-primary-text)]">
                      Próxima Consulta
                    </h2>
                    <h3 className="text-lg font-bold text-[var(--color-serene-on-surface)]">
                      Consulta Pré-Natal de Rotina
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  Confirmada
                </span>
              </div>

              {/* Doctor and Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-container-low)]/80 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/40 flex items-center justify-center text-[var(--color-serene-primary-text)] font-bold text-lg shrink-0">
                    CV
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[var(--color-serene-on-surface)] truncate">
                      Dra. Camila Vasconcelos
                    </h3>
                    <p className="text-xs text-[var(--color-serene-primary-text)] font-semibold">
                      Ginecologia e Obstetrícia
                    </p>
                    <p className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
                      CRM 148.920 • RQE 42.110
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-container-low)]/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-serene-primary-text)]">
                      calendar_today
                    </span>
                    <div>
                      <span className="font-bold text-[var(--color-serene-on-surface)] block">
                        Terça, 24 Out • 14:30h (Presencial)
                      </span>
                      <span className="text-[var(--color-serene-on-surface-variant)] text-[11px]">
                        Chegar com 15 min de antecedência
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-serene-secondary)]">
                      location_on
                    </span>
                    <div>
                      <span className="font-bold text-[var(--color-serene-on-surface)] block">
                        Unidade Jardins
                      </span>
                      <span className="text-[var(--color-serene-on-surface-variant)] text-[11px]">
                        Sala 304 • 3º Andar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Banner for Reschedule RN-013 */}
              {rescheduleNotice && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">
                    warning
                  </span>
                  <span>{rescheduleNotice}</span>
                </div>
              )}

              {/* Consultation Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-serene-surface-container)]">
                <button
                  type="button"
                  onClick={handleRescheduleClick}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--color-serene-outline-variant)] text-[var(--color-serene-on-surface)] hover:bg-[var(--color-serene-surface-container-low)] text-xs font-semibold transition-colors"
                >
                  Remarcar consulta
                </button>

                <button
                  type="button"
                  onClick={onViewAppointmentDetails}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--color-serene-surface-container)] hover:bg-[var(--color-serene-surface-container-high)] text-[var(--color-serene-primary-text)] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver detalhes do agendamento</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </section>

            {/* BENTO GRID: ACESSO RÁPIDO */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--color-serene-on-surface-variant)]">
                  Acesso Rápido
                </h3>
                <span className="text-xs text-[var(--color-serene-on-surface-variant)]">
                  Serviços e Prontuário
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Minhas Consultas */}
                <button
                  type="button"
                  onClick={() => onNavigateSection?.('consultas')}
                  className="p-4 rounded-2xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/40 hover:border-[var(--color-serene-primary)]/50 text-left transition-all duration-150 group serene-shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-serene-surface-container-low)] text-[var(--color-serene-primary-text)] flex items-center justify-center mb-2.5 group-hover:bg-[var(--color-serene-primary-text)] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">calendar_month</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)] group-hover:text-[var(--color-serene-primary-text)] transition-colors">
                    Minhas Consultas
                  </h4>
                  <p className="text-xs text-[var(--color-serene-on-surface-variant)] mt-0.5">
                    1 agendada • Ver histórico
                  </p>
                </button>

                {/* 2. Exames Anexados */}
                <button
                  type="button"
                  onClick={() => onNavigateSection?.('exames')}
                  className="p-4 rounded-2xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/40 hover:border-[var(--color-serene-secondary)]/50 text-left transition-all duration-150 group serene-shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-serene-surface-container-low)] text-[var(--color-serene-secondary)] flex items-center justify-center mb-2.5 group-hover:bg-[var(--color-serene-secondary)] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">description</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)] group-hover:text-[var(--color-serene-secondary)] transition-colors">
                    Exames Anexados
                  </h4>
                  <p className="text-xs text-[var(--color-serene-on-surface-variant)] mt-0.5">
                    Laudos e imagens (8)
                  </p>
                </button>

                {/* 3. Cartão da Gestante / Prontuário */}
                <button
                  type="button"
                  onClick={() => onNavigateSection?.('cartao-gestante')}
                  className="p-4 rounded-2xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/40 hover:border-[var(--color-serene-primary-container)]/50 text-left transition-all duration-150 group serene-shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-serene-primary-fixed)] text-[var(--color-serene-primary-text)] flex items-center justify-center mb-2.5 group-hover:bg-[var(--color-serene-primary-text)] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)] group-hover:text-[var(--color-serene-primary-text)] transition-colors">
                    Cartão da Gestante
                  </h4>
                  <p className="text-xs text-[var(--color-serene-on-surface-variant)] mt-0.5">
                    Histórico obstétrico digital
                  </p>
                </button>

                {/* 4. Falar com a Clínica */}
                <button
                  type="button"
                  onClick={() => onNavigateSection?.('contato')}
                  className="p-4 rounded-2xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/40 hover:border-[var(--color-serene-secondary)]/50 text-left transition-all duration-150 group serene-shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-serene-secondary-fixed)] text-[var(--color-serene-secondary)] flex items-center justify-center mb-2.5 group-hover:bg-[var(--color-serene-secondary)] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">chat</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)] group-hover:text-[var(--color-serene-secondary)] transition-colors">
                    Falar com a Clínica
                  </h4>
                  <p className="text-xs text-[var(--color-serene-on-surface-variant)] mt-0.5">
                    Recepção e enfermagem
                  </p>
                </button>
              </div>
            </section>

            {/* DICA DA SEMANA */}
            <section className="p-5 rounded-2xl bg-[var(--color-serene-surface-container-low)] border border-[var(--color-serene-outline-variant)]/30 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-serene-secondary-fixed)] flex items-center justify-center text-[var(--color-serene-secondary)] shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spa
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)]">
                  Dica da Semana: Hidratação e Descanso
                </h4>
                <p className="text-xs text-[var(--color-serene-on-surface-variant)] leading-relaxed">
                  Nesta fase, priorize pequenas caminhadas, pausas para repouso com pernas elevadas e ingestão regular de líquidos. Qualquer sintoma atípico, nossa equipe de suporte está a um toque de distância.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:08007702262"
                    className="text-xs font-bold text-[var(--color-serene-primary-text)] hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Plantão Obstétrico 24h</span>
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* LATERAL COLUMN (4 COLS ON DESKTOP) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CONTEXTUAL AREA: GESTANTE vs NÃO-GESTANTE (RN-012) */}
            {hasActivePregnancy ? (
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[20px] text-[var(--color-serene-primary-text)]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      pregnant_woman
                    </span>
                    <h2 className="text-sm font-bold text-[var(--color-serene-on-surface)]">
                      Seu Acompanhamento Pré-Natal
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-serene-primary-fixed)] text-[var(--color-serene-primary-text)] text-xs font-bold">
                    Gestação Ativa
                  </span>
                </div>

                <PrenatalWidget
                  currentWeeks={26}
                  currentDays={3}
                  dueDate="22/01/2025"
                  daysRemaining={98}
                  onAccessCard={() => onNavigateSection?.('cartao-gestante')}
                />
              </section>
            ) : (
              <section className="serene-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--color-serene-surface-container)] pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[20px] text-[var(--color-serene-secondary)]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      health_and_safety
                    </span>
                    <h2 className="text-sm font-bold text-[var(--color-serene-on-surface)]">
                      Prevenção & Saúde da Mulher
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    Rotina em Dia
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-bold text-[var(--color-serene-on-surface)]">
                    Papanicolau & Check-up Preventivo
                  </p>
                  <p className="text-[var(--color-serene-on-surface-variant)] leading-relaxed">
                    Último exame citopatológico realizado há 8 meses com laudo normal. Recomendado agendamento da próxima rotina preventiva em 4 meses.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onBookAppointment}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--color-serene-surface-container)] hover:bg-[var(--color-serene-surface-container-high)] text-[var(--color-serene-primary-text)] text-xs font-bold transition-colors"
                  >
                    Agendar Check-up Preventivo
                  </button>
                </div>
              </section>
            )}

            {/* CARD PLANTÃO OBSTÉTRICO 24H */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-50/70 to-purple-50/60 border border-rose-200/80 serene-shadow-soft space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emergency
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--color-serene-on-surface)]">
                    Plantão Obstétrico 24h
                  </h4>
                  <p className="text-[11px] text-[var(--color-serene-on-surface-variant)]">
                    Atendimento imediato de sobreaviso
                  </p>
                </div>
              </div>

              <p className="text-xs text-[var(--color-serene-on-surface-variant)] leading-relaxed">
                Em caso de sangramento, perda de líquido, contrações rítmicas ou febre, contate a equipe médica imediatamente.
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="tel:08007702262"
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Ligar para Emergência 24h</span>
                </a>

                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">chat</span>
                  <span>WhatsApp Enfermagem Obstétrica</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
