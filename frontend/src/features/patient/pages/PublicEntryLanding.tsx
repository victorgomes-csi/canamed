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
}) => {
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá! Gostaria de tirar dúvidas sobre o agendamento no Cana Med Mulher.'
  )}`;

  return (
    <div className="serene-page relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Background Ambient Glows (Serene Bloom Luminescence) */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="serene-glow-bg top-0 left-1/2 -translate-x-1/2 w-96 h-96" />
        <div className="serene-glow-bg top-1/3 -right-24 w-80 h-80 opacity-20" />
        <div className="serene-glow-bg -bottom-20 -left-20 w-80 h-80 opacity-30" />
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
                // Fallback graceful se a imagem não for encontrada
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Trust & Clinic Context Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[var(--color-serene-outline-variant)] text-[var(--color-serene-secondary)] shadow-sm mb-5">
            <span className="material-symbols-outlined text-[var(--color-serene-primary)] text-base" data-icon="verified_user">
              verified_user
            </span>
            <span className="text-xs font-semibold tracking-wide">
              Agendamento Oficial • {clinicName}
            </span>
          </div>

          {/* Welcome Hero Messaging */}
          <div className="space-y-2 px-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-serene-text-main)]">
              Vamos cuidar de você?
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-serene-text-muted)] max-w-sm mx-auto leading-relaxed">
              Escolha como deseja agendar sua consulta. Você pode continuar sem criar uma conta ou criar seu acesso para acompanhar seus atendimentos.
            </p>
          </div>

          {/* LGPD & Encrypted Status */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[var(--color-serene-text-muted)]">
            <span className="material-symbols-outlined text-sm text-[var(--color-serene-primary-text)]" data-icon="lock">
              lock
            </span>
            <span className="uppercase tracking-wider font-semibold text-[11px]">
              Ambiente Seguro Criptografado • Conformidade LGPD
            </span>
          </div>
        </header>

        {/* Choice Options: Bento-Style Dual Modality Cards */}
        <section aria-label="Modalidades de agendamento" className="my-6 space-y-4">
          {/* CARD 1: Consulta Avulsa (Primary Streamlined Entry) */}
          <article className="serene-card p-5 border-[var(--color-serene-outline-variant)] hover:border-[var(--color-serene-primary)] transition-all">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-serene-surface-low)] text-[var(--color-serene-primary-text)] text-xs font-bold border border-[var(--color-serene-outline-variant)]">
                <span className="material-symbols-outlined text-sm" data-icon="bolt">
                  bolt
                </span>
                Mais Rápido • Menos de 1 min
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined text-lg" data-icon="edit_calendar">
                  edit_calendar
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <h2 className="text-lg font-bold text-[var(--color-serene-text-main)]">
                Agendar sem criar conta
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-serene-text-muted)]">
                Quer marcar sua consulta rapidamente? Informe seus dados básicos e continue sem precisar criar senha.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-2 mb-5 text-xs sm:text-sm text-[var(--color-serene-text-muted)]">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Sem necessidade de login ou senha</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Preenchimento ágil apenas com dados essenciais</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
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
              className="serene-btn-primary w-full flex items-center justify-center gap-2 py-3 px-6 text-sm active:scale-[0.99]"
            >
              <span>Continuar sem conta</span>
              <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </article>

          {/* CARD 2: Criar Minha Conta (Full Patient Portal Access) */}
          <article className="serene-card p-5 border-[var(--color-serene-outline-variant)] hover:border-[var(--color-serene-secondary)] transition-all">
            {/* Top Pill Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-serene-surface-low)] text-[var(--color-serene-secondary)] text-xs font-semibold border border-[var(--color-serene-outline-variant)]">
                <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">
                  auto_awesome
                </span>
                Experiência Completa
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-secondary)]">
                <span className="material-symbols-outlined text-lg" data-icon="shield_person">
                  shield_person
                </span>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <h2 className="text-lg font-bold text-[var(--color-serene-text-main)]">
                Quero criar minha conta
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-serene-text-muted)]">
                Tenha acesso à sua área do paciente para acompanhar suas consultas e acessar os recursos disponibilizados pela clínica.
              </p>
            </div>

            {/* Benefits List */}
            <ul className="space-y-2 mb-5 text-xs sm:text-sm text-[var(--color-serene-text-muted)]">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-secondary)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Acompanhe o histórico de consultas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-secondary)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
                    check
                  </span>
                </span>
                <span>Cartão da Gestante e pré-natal digital (quando aplicável)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-secondary)] flex-shrink-0">
                  <span className="material-symbols-outlined text-xs font-bold" data-icon="check">
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
              className="serene-btn-secondary w-full flex items-center justify-center gap-2 py-3 px-6 text-sm active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-lg" data-icon="person_add">
                person_add
              </span>
              <span>Criar minha conta</span>
            </button>
          </article>
        </section>

        {/* Support / Help Block (Humanized WhatsApp Contact) */}
        <div className="bg-white/80 rounded-2xl p-3.5 mb-6 border border-[var(--color-serene-outline-variant)] shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-secondary)] shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-xl" data-icon="support_agent">
                support_agent
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-serene-text-main)]">
                Dúvidas com o agendamento?
              </p>
              <p className="text-xs text-[var(--color-serene-text-muted)]">
                Fale com a recepção pelo WhatsApp
              </p>
            </div>
          </div>
          <a
            aria-label="Iniciar conversa com a recepção no WhatsApp"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-serene-primary)] text-white hover:bg-[var(--color-serene-primary-hover)] transition-colors flex-shrink-0 shadow-sm"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-xl" data-icon="chat">
              chat
            </span>
          </a>
        </div>

        {/* Security & Institutional Footer */}
        <footer className="text-center pt-2 space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-serene-text-muted)]">
            <a className="hover:text-[var(--color-serene-primary-text)] transition-colors hover:underline" href="#privacidade">
              Política de Privacidade
            </a>
            <span className="text-[var(--color-serene-outline-variant)]">•</span>
            <a className="hover:text-[var(--color-serene-primary-text)] transition-colors hover:underline" href="#termos">
              Termos de Uso
            </a>
          </div>
          <p className="text-[11px] text-[var(--color-serene-text-muted)] leading-relaxed max-w-xs mx-auto">
            Ambiente seguro e certificado Cana Med Mulher • Resoluções CFM & LGPD.
          </p>
        </footer>
      </main>
    </div>
  );
};
