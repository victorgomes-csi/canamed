import React from 'react';
import '../patient-serene.css';

export interface PublicEntryLandingProps {
  clinicName?: string;
  whatsappPhone?: string;
  onSelectGuestBooking?: () => void;
  onSelectCreateAccount?: () => void;
  onSelectLogin?: () => void;
}

export const PublicEntryLanding: React.FC<PublicEntryLandingProps> = ({
  clinicName = 'Clínica Serena Saúde da Mulher',
  whatsappPhone = '5511999998888',
  onSelectGuestBooking,
  onSelectCreateAccount,
  onSelectLogin,
}) => {
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá! Gostaria de tirar dúvidas sobre o agendamento no Cana Med Mulher.'
  )}`;

  return (
    <div className="relative min-h-screen bg-background text-on-surface font-body-md antialiased flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
      {/* Background Ambient Glows (Serene Bloom Luminescence) */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-fixed opacity-30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-80 h-80 bg-secondary-fixed opacity-25 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-surface-container opacity-60 rounded-full blur-3xl" />
      </div>

      {/* Main Container Mobile First */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex-1 flex flex-col justify-between">
        {/* Header & Identity Section */}
        <header className="flex flex-col items-center text-center">
          {/* Brand Logo Container */}
          <div className="mb-4 transition-transform duration-200 hover:scale-[1.02]">
            <img
              alt="Cana Med Mulher - Eficiência para quem mais precisa"
              className="h-16 w-auto object-contain mx-auto drop-shadow-sm"
              src="/assets/brand/canamed_logo-removebg-preview.png"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Trust & Clinic Context Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-secondary shadow-[0_2px_8px_-2px_rgba(75,30,90,0.04)] mb-6">
            <span className="material-symbols-outlined text-primary text-base" data-icon="verified_user">
              verified_user
            </span>
            <span className="font-label-md text-label-md tracking-wide">
              Agendamento Oficial • {clinicName}
            </span>
          </div>

          {/* Welcome Hero Messaging */}
          <div className="space-y-2.5 px-2">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold tracking-tight">
              Vamos cuidar de você?
            </h1>
            <p className="font-body-md text-body-md text-tertiary max-w-sm mx-auto">
              Escolha como deseja agendar sua consulta. Você pode continuar sem criar uma conta ou criar seu acesso para acompanhar seus atendimentos.
            </p>
          </div>

          {/* LGPD & Encrypted Status */}
          <div className="mt-4 flex items-center justify-center gap-2 text-tertiary">
            <span className="material-symbols-outlined text-sm text-primary" data-icon="lock">
              lock
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Ambiente Seguro Criptografado • Conformidade LGPD
            </span>
          </div>
        </header>

        {/* Choice Options: Bento-Style Dual Modality Cards */}
        <section aria-label="Modalidades de agendamento" className="my-6 space-y-4">
          {/* CARD 1: Consulta Avulsa (Primary Streamlined Entry) */}
          <article className="group relative bg-surface-container-lowest rounded-2xl p-5 border border-primary/20 shadow-[0_4px_18px_-4px_rgba(216,37,124,0.10)] transition-all duration-200 hover:border-primary/50 hover:shadow-[0_8px_26px_-6px_rgba(216,37,124,0.16)]">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-sm" data-icon="bolt">
                  bolt
                </span>
                Mais Rápido • Menos de 1 min
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-lg" data-icon="edit_calendar">
                  edit_calendar
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Agendar sem criar conta
              </h2>
              <p className="font-body-sm text-body-sm text-tertiary">
                Quer marcar sua consulta rapidamente? Informe seus dados básicos e continue sem precisar criar senha.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-2 mb-5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Sem necessidade de login ou senha</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Preenchimento ágil apenas com dados essenciais</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Acompanhamento e confirmação enviados pelo WhatsApp</span>
              </li>
            </ul>

            {/* Action Button Primário */}
            <button
              type="button"
              aria-label="Agendar Agora - Continuar sem conta"
              onClick={onSelectGuestBooking}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all duration-150"
            >
              <span>Continuar sem conta</span>
              <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </article>

          {/* CARD 2: Criar Minha Conta (Full Patient Portal Access) */}
          <article className="group relative bg-surface-container-lowest/80 backdrop-blur-sm rounded-2xl p-5 border border-outline-variant/30 shadow-[0_2px_12px_-2px_rgba(75,30,90,0.04)] transition-all duration-200 hover:border-secondary hover:shadow-[0_6px_20px_-4px_rgba(75,30,90,0.08)]">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">
                  auto_awesome
                </span>
                Experiência Completa
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
                <span className="material-symbols-outlined text-lg" data-icon="shield_person">
                  shield_person
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Quero criar minha conta
              </h2>
              <p className="font-body-sm text-body-sm text-tertiary">
                Tenha acesso à sua área do paciente para acompanhar suas consultas e acessar os recursos disponibilizados pela clínica.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-2 mb-5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Acompanhe o histórico de consultas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Cartão da Gestante e pré-natal digital (quando aplicável)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Notificações e lembretes automáticos</span>
              </li>
            </ul>

            {/* Action Button Secundário */}
            <button
              type="button"
              onClick={onSelectCreateAccount}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-surface-container-low text-secondary border border-outline-variant/50 hover:bg-surface-container font-label-lg text-label-lg font-bold active:scale-[0.98] transition-all duration-150"
            >
              <span className="material-symbols-outlined text-lg text-primary" data-icon="person_add">
                person_add
              </span>
              <span>Criar minha conta</span>
            </button>
          </article>
        </section>

        {/* Support / Help Block (Humanized WhatsApp Contact) */}
        <div className="bg-surface-container/60 rounded-xl p-3.5 mb-6 border border-outline-variant/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-xl" data-icon="support_agent">
                support_agent
              </span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                Dúvidas com o agendamento?
              </p>
              <p className="font-body-sm text-body-sm text-tertiary">
                Fale com a recepção pelo WhatsApp
              </p>
            </div>
          </div>
          <a
            aria-label="Iniciar conversa com a recepção no WhatsApp"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-colors flex-shrink-0 shadow-sm"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-xl" data-icon="chat">
              chat
            </span>
          </a>
        </div>

        {/* Já tem conta? Acessar */}
        {onSelectLogin && (
          <div className="text-center pb-4">
            <button
              type="button"
              onClick={onSelectLogin}
              className="text-label-md font-label-md text-primary font-bold hover:underline inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" data-icon="login">
                login
              </span>
              <span>Já possui cadastro? Acessar área da paciente</span>
            </button>
          </div>
        )}

        {/* Security & Institutional Footer */}
        <footer className="text-center pt-2 space-y-3">
          <div className="flex items-center justify-center gap-4 font-label-md text-label-md text-tertiary">
            <a className="hover:text-primary transition-colors hover:underline" href="#privacidade">
              Política de Privacidade
            </a>
            <span className="text-outline-variant">•</span>
            <a className="hover:text-primary transition-colors hover:underline" href="#termos">
              Termos de Uso
            </a>
          </div>
          <p className="font-label-sm text-label-sm text-tertiary/80 leading-relaxed max-w-xs mx-auto">
            Ambiente seguro e certificado Cana Med Mulher • Resoluções CFM &amp; LGPD.
          </p>
        </footer>
      </main>
    </div>
  );
};
