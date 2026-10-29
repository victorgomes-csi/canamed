import React, { useState } from 'react';
import '../patient-serene.css';

export interface PatientDashboardPageProps {
  patientName?: string;
  hasActivePregnancy?: boolean;
  appointmentDateTime?: string; // ISO string
  onBookAppointment?: () => void;
  onReschedule?: () => void;
  onViewAppointmentDetails?: () => void;
  onNavigateSection?: (section: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  patientName = 'Juliana',
  hasActivePregnancy = true,
  appointmentDateTime,
  onBookAppointment,
  onReschedule,
  onViewAppointmentDetails,
  onNavigateSection,
  onNavigateTab,
}) => {
  const [rescheduleNotice, setRescheduleNotice] = useState<string | null>(null);

  const handleRescheduleClick = () => {
    if (appointmentDateTime) {
      const apptTime = new Date(appointmentDateTime).getTime();
      const now = Date.now();
      const diffHours = (apptTime - now) / (1000 * 60 * 60);

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
    <div className="bg-background text-on-surface antialiased min-h-screen pb-24 selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top App Bar Header (Hidden on Desktop when inside PatientLayoutSerene) */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 max-w-screen-md mx-auto bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <img
            alt="Cana Med Mulher"
            className="h-9 w-auto object-contain cursor-pointer transition-transform active:scale-95 duration-150"
            src="/assets/brand/canamed_logo-removebg-preview.png"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            aria-label="Notificações"
            className="relative p-2 rounded-full hover:bg-surface-container text-tertiary transition-colors duration-150 active:scale-95 flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-container rounded-full ring-2 ring-surface" />
          </button>
          <div className="relative w-9 h-9 rounded-full ring-2 ring-primary/20 overflow-hidden bg-surface-container-high flex items-center justify-center text-primary font-bold">
            <span className="material-symbols-outlined text-lg">person</span>
          </div>
        </div>
      </header>

      {/* Main Mobile Content Container */}
      <main className="pt-20 px-4 max-w-screen-md mx-auto space-y-6">
        {/* Hero / Welcome Greeting */}
        <section className="mt-2 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary border border-secondary/10 text-label-sm font-label-sm">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span>Espaço Saúde da Mulher</span>
          </div>
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface tracking-tight">
            Olá, <span className="text-primary font-bold">{patientName}</span>
          </h1>
          <p className="text-body-sm font-body-sm text-tertiary leading-relaxed">
            Veja seus próximos compromissos e acompanhe seu cuidado com serenidade.
          </p>
        </section>

        {/* Quick Call to Action: Agendar Consulta */}
        <section>
          <button
            type="button"
            onClick={onBookAppointment}
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_8px_20px_-4px_rgba(216,37,124,0.35)] hover:shadow-lg active:scale-[0.98] transition-all duration-150 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
              </div>
              <div className="text-left">
                <div className="text-label-lg font-label-lg font-bold tracking-wide">
                  Agendar consulta
                </div>
                <div className="text-label-sm font-label-sm text-white/80">
                  Especialistas disponíveis nesta semana
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>
          </button>
        </section>

        {/* Card de Destaque: Próxima Consulta */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-label-lg font-label-lg text-tertiary uppercase tracking-wider font-bold">
              Próxima Consulta
            </h2>
            <button
              type="button"
              onClick={() => onNavigateSection?.('consultas')}
              className="text-label-md font-label-md text-primary hover:underline cursor-pointer font-bold"
            >
              Ver histórico
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/40 shadow-[0_2px_12px_-2px_rgba(75,30,90,0.06)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none" />

            {/* Doctor Info + Status Badge */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div>
                  <h3 className="text-body-md font-headline-sm font-bold text-on-surface">
                    Dra. Camila Vasconcelos
                  </h3>
                  <p className="text-label-md font-label-md text-secondary font-medium">
                    Ginecologia e Obstetrícia
                  </p>
                  <p className="text-label-sm font-label-sm text-tertiary">
                    CRM 148.920 • RQE 42.110
                  </p>
                </div>
              </div>

              {/* Badge Confirmada */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-label-sm font-label-sm font-semibold whitespace-nowrap">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Confirmada
              </span>
            </div>

            {/* Date & Location Specs */}
            <div className="py-4 grid grid-cols-2 gap-3 text-body-sm font-body-sm">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low/70">
                <div className="p-1.5 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
                <div>
                  <div className="text-label-sm font-label-sm text-tertiary font-semibold">
                    Data e Horário
                  </div>
                  <div className="text-label-md font-label-md text-on-surface font-bold">
                    Terça, 24 Out
                  </div>
                  <div className="text-label-sm font-label-sm text-secondary">
                    14:30h (Presencial)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low/70">
                <div className="p-1.5 rounded-lg bg-surface-container text-secondary">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div>
                  <div className="text-label-sm font-label-sm text-tertiary font-semibold">
                    Local de Atendimento
                  </div>
                  <div className="text-label-md font-label-md text-on-surface font-bold">
                    Unidade Jardins
                  </div>
                  <div className="text-label-sm font-label-sm text-tertiary">
                    Sala 304 • 3º Andar
                  </div>
                </div>
              </div>
            </div>

            {/* Reschedule alert */}
            {rescheduleNotice && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                {rescheduleNotice}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onViewAppointmentDetails}
                className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-lg font-label-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.99]"
              >
                <span>Ver detalhes do agendamento</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
              <button
                type="button"
                aria-label="Remarcar consulta"
                onClick={handleRescheduleClick}
                className="py-2.5 px-3 rounded-xl border border-outline-variant/60 text-secondary hover:bg-surface-container font-label-md font-semibold text-xs active:scale-[0.99]"
              >
                Remarcar consulta
              </button>
            </div>
          </div>
        </section>

        {/* Card Contextual: Seu Acompanhamento Pré-Natal ou Prevenção */}
        {hasActivePregnancy ? (
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  pregnant_woman
                </span>
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                  Seu Acompanhamento Pré-Natal
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm font-bold">
                Gestação Ativa
              </span>
            </div>

            <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high/60 rounded-2xl p-5 border border-outline-variant/50 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-md font-label-md font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">child_care</span>
                  <span>26ª Semana Gestacional</span>
                </div>
                <div className="text-right">
                  <span className="text-label-sm font-label-sm text-tertiary block">
                    DPP Estimada:
                  </span>
                  <span className="text-label-md font-label-md font-bold text-on-surface">
                    22/01/2025
                  </span>
                </div>
              </div>

              {/* Weekly Progress Bar */}
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between text-label-sm font-label-sm text-tertiary">
                  <span>2º Trimestre (Semana 26 de 40)</span>
                  <span className="text-primary font-bold">65% concluído</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={65}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso da gestação"
                  className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5"
                >
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-primary-container rounded-full transition-all duration-500"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-label-sm font-label-sm text-secondary font-medium pt-1">
                  ✨ Seu bebê tem o tamanho aproximado de uma <strong className="text-on-surface">berinjela</strong> (~35 cm e 760g).
                </p>
              </div>

              {/* Alerts / Upcoming Milestones */}
              <div className="mt-4 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">radiology</span>
                  </div>
                  <div>
                    <h4 className="text-label-md font-label-md font-bold text-on-surface">
                      Ultrassom Morfológico Realizado
                    </h4>
                    <p className="text-label-sm font-label-sm text-tertiary">
                      Laudo anexado e aprovado com parâmetros normais de desenvolvimento.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-surface-container">
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed/60 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">event_repeat</span>
                  </div>
                  <div>
                    <h4 className="text-label-md font-label-md font-bold text-on-surface">
                      Retorno de Avaliação Pré-Natal
                    </h4>
                    <p className="text-label-sm font-label-sm text-tertiary">
                      Agendada para 24/10 às 14:30 com avaliação da curva pressórica.
                    </p>
                  </div>
                </div>
              </div>

              {/* Button: Acessar Cartão da Gestante */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onNavigateSection?.('cartao-gestante')}
                  className="w-full py-3 px-4 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/95 font-label-lg font-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    badge
                  </span>
                  <span>Acessar Cartão da Gestante</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  health_and_safety
                </span>
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">
                  Prevenção &amp; Saúde da Mulher
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm font-bold">
                Check-up em dia
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/40 shadow-sm space-y-3">
              <h3 className="text-label-lg font-bold text-on-surface">Papanicolau &amp; Check-up Preventivo</h3>
              <p className="text-body-sm text-tertiary">
                Mantenha seus exames preventivos atualizados. Seu último rastreamento preventivo ginecológico está em dia.
              </p>
              <button
                type="button"
                onClick={() => onNavigateSection?.('consultas')}
                className="py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-sm inline-flex items-center gap-2"
              >
                <span>Agendar Preventivo de Rotina</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* Acesso Rápido (Bento Grid) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-label-lg font-label-lg text-tertiary uppercase tracking-wider font-bold">
              Acesso Rápido
            </h2>
            <span className="text-label-sm font-label-sm text-tertiary">Serviços da paciente</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Item 1: Minhas Consultas */}
            <button
              type="button"
              onClick={() => onNavigateSection?.('consultas')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 shadow-sm transition-all duration-150 hover:-translate-y-0.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
              </div>
              <h3 className="text-label-lg font-label-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                Minhas Consultas
              </h3>
              <p className="text-label-sm font-label-sm text-tertiary mt-0.5">
                1 agendada • Ver histórico
              </p>
            </button>

            {/* Item 2: Exames Anexados */}
            <button
              type="button"
              onClick={() => onNavigateSection?.('exames')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 shadow-sm transition-all duration-150 hover:-translate-y-0.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
              <h3 className="text-label-lg font-label-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                Exames Anexados
              </h3>
              <p className="text-label-sm font-label-sm text-tertiary mt-0.5">
                Laudos e imagens (8)
              </p>
            </button>

            {/* Item 3: Cartão da Gestante */}
            <button
              type="button"
              onClick={() => onNavigateSection?.('cartao-gestante')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary-container/40 shadow-sm transition-all duration-150 hover:-translate-y-0.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary-container flex items-center justify-center mb-3 group-hover:bg-primary-container group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
              </div>
              <h3 className="text-label-lg font-label-lg font-bold text-on-surface group-hover:text-primary-container transition-colors">
                Cartão da Gestante
              </h3>
              <p className="text-label-sm font-label-sm text-tertiary mt-0.5">
                Histórico obstétrico digital
              </p>
            </button>

            {/* Item 4: Falar com a Clínica */}
            <button
              type="button"
              onClick={() => onNavigateSection?.('contato')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 shadow-sm transition-all duration-150 hover:-translate-y-0.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-on-secondary-fixed-variant flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">chat</span>
              </div>
              <h3 className="text-label-lg font-label-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                Falar com a Clínica
              </h3>
              <p className="text-label-sm font-label-sm text-tertiary mt-0.5">
                Recepção e enfermagem
              </p>
            </button>
          </div>
        </section>

        {/* Lembrete & Plantão Obstétrico 24h */}
        <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-label-lg font-label-lg font-bold text-on-surface">
              Plantão Obstétrico 24h
            </h4>
            <p className="text-body-sm font-body-sm text-tertiary leading-relaxed">
              Nossa equipe médica obstétrica e ginecológica está de prontidão contínua para suporte imediato a qualquer sintoma atípico.
            </p>
            <div className="pt-1.5 flex items-center gap-3">
              <a
                className="text-label-md font-label-md text-primary font-bold hover:underline inline-flex items-center gap-1"
                aria-label="Ligar para Emergência 24h - Plantão Obstétrico 24h"
                href="tel:08007702262"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Ligar para Emergência 24h (Plantão Obstétrico 24h)
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 h-16 bg-surface border-t border-outline-variant/30 shadow-[0_-4px_16px_rgba(75,30,90,0.06)]"
      >
        <button
          type="button"
          className="flex flex-col items-center justify-center text-primary font-bold gap-1 active:scale-90 transition-transform duration-150"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            home
          </span>
          <span className="text-label-sm font-label-sm">Início</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab?.('agendar')}
          className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
          <span className="text-label-sm font-label-sm">Agendar</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab?.('consultas')}
          className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined text-[24px]">calendar_month</span>
          <span className="text-label-sm font-label-sm">Consultas</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab?.('prenatal')}
          className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined text-[24px]">pregnant_woman</span>
          <span className="text-label-sm font-label-sm">Pré-natal</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab?.('perfil')}
          className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-label-sm font-label-sm">Perfil</span>
        </button>
      </nav>
    </div>
  );
};
