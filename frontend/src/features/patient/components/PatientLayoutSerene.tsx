import React from 'react';
import '../patient-serene.css';

export type SereneNavTab =
  | 'inicio'
  | 'agendar'
  | 'consultas'
  | 'cartao-gestante'
  | 'plantao'
  | 'perfil';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PatientLayoutSereneProps {
  children: React.ReactNode;
  activeTab?: SereneNavTab;
  hideBottomNav?: boolean;
  hideTopBar?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  patientName?: string;
  gestationalWeekText?: string;
  onTabChange?: (tab: SereneNavTab) => void;
  onLogout?: () => void;
  clinicSlug?: string;
  emergencyPhone?: string;
}

export const PatientLayoutSerene: React.FC<PatientLayoutSereneProps> = ({
  children,
  activeTab = 'inicio',
  hideBottomNav = false,
  hideTopBar = false,
  breadcrumbs,
  patientName = 'Juliana Rocha Mendes',
  gestationalWeekText = '26ª Semana',
  onTabChange,
  onLogout,
  emergencyPhone = 'tel:08007702262',
}) => {
  const handleNavClick = (tab: SereneNavTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const desktopNavItems: Array<{
    id: SereneNavTab;
    label: string;
    icon: string;
    badge?: string;
    hasIndicator?: boolean;
  }> = [
    { id: 'inicio', label: 'Início', icon: 'home' },
    { id: 'agendar', label: 'Agendar consulta', icon: 'calendar_month' },
    { id: 'consultas', label: 'Minhas consultas', icon: 'event_available', badge: '1' },
    {
      id: 'cartao-gestante',
      label: 'Cartão da Gestante',
      icon: 'pregnant_woman',
      hasIndicator: true,
    },
    { id: 'plantao', label: 'Consulta Avulsa / Plantão', icon: 'medical_services' },
    { id: 'perfil', label: 'Meu perfil', icon: 'account_circle' },
  ];

  const mobileNavItems: Array<{
    id: SereneNavTab;
    label: string;
    icon: string;
  }> = [
    { id: 'inicio', label: 'Início', icon: 'home' },
    { id: 'agendar', label: 'Agendar', icon: 'calendar_add_on' },
    { id: 'consultas', label: 'Consultas', icon: 'calendar_month' },
    { id: 'cartao-gestante', label: 'Pré-natal', icon: 'pregnant_woman' },
    { id: 'perfil', label: 'Perfil', icon: 'person' },
  ];

  return (
    <div className="serene-page min-h-screen text-[var(--color-serene-on-surface)]">
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (w-72 / 288px)                            */}
      {/* ======================================================== */}
      <aside
        aria-label="Menu Lateral Desktop"
        className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col justify-between p-6 z-40 bg-[var(--color-serene-surface-card)] border-r border-[var(--color-serene-outline-variant)]/30 shadow-sm"
      >
        <div className="flex flex-col gap-6">
          {/* Logo Brand / Identity */}
          <div className="flex flex-col gap-1 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-serene-primary-container)] to-[var(--color-serene-primary)] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                CM
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--color-serene-primary-text)]">
                Cana Med Mulher
              </span>
            </div>
            <span className="text-xs text-[var(--color-serene-on-surface-variant)] font-medium tracking-wide mt-1 pl-0.5">
              Portal da Paciente
            </span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Navegação Principal Desktop" className="flex flex-col space-y-1">
            {desktopNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-[var(--color-serene-secondary-container)]/40 text-[var(--color-serene-primary-text)] shadow-xs'
                      : 'text-[var(--color-serene-on-surface-variant)] hover:bg-[var(--color-serene-surface-container-low)] hover:text-[var(--color-serene-primary-text)]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? 'text-[var(--color-serene-primary-text)]' : 'text-[var(--color-serene-secondary)]'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-serene-primary-fixed)] text-[var(--color-serene-primary-text)]">
                      {item.badge}
                    </span>
                  )}
                  {item.hasIndicator && (
                    <span
                      className="w-2 h-2 rounded-full bg-[var(--color-serene-primary)] animate-pulse"
                      title="Gestação ativa"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Footer: Patient Snapshot & Logout */}
        <div className="flex flex-col gap-3 border-t border-[var(--color-serene-outline-variant)]/30 pt-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[var(--color-serene-surface-container-low)]/80">
            <div className="w-10 h-10 rounded-full bg-[var(--color-serene-surface-container)] flex items-center justify-center font-bold text-sm text-[var(--color-serene-primary-text)] border border-[var(--color-serene-outline-variant)]/50 shrink-0">
              {patientName.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[var(--color-serene-on-surface)] truncate leading-tight">
                {patientName}
              </span>
              <span className="text-[11px] text-[var(--color-serene-primary-text)] font-medium">
                {gestationalWeekText}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Sair da conta"
            onClick={onLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[var(--color-serene-on-surface-variant)] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* DESKTOP TOP BAR                                          */}
      {/* ======================================================== */}
      {!hideTopBar && (
        <header
          aria-label="Barra Superior Desktop"
          className="hidden lg:flex fixed top-0 right-0 left-72 h-18 z-30 items-center justify-between px-8 bg-[var(--color-serene-surface-card)]/90 backdrop-blur-md border-b border-[var(--color-serene-outline-variant)]/30 shadow-sm"
        >
          {/* Breadcrumbs or Page Title */}
          <div className="flex items-center gap-2">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-[var(--color-serene-outline-variant)]">/</span>}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-[var(--color-serene-on-surface-variant)] hover:text-[var(--color-serene-primary-text)] font-medium transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-[var(--color-serene-primary-text)] font-bold">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[var(--color-serene-on-surface)]">
                  Painel do Paciente
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Conectada
                </span>
              </div>
            )}
          </div>

          {/* Emergency Trailing Action */}
          <div className="flex items-center gap-3">
            <a
              href={emergencyPhone}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-serene-primary-text)] to-[var(--color-serene-primary)] text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
              <span>Plantão de Emergência</span>
            </a>
          </div>
        </header>
      )}

      {/* ======================================================== */}
      {/* MAIN VIEWPORT / OUTLET WRAPPER                           */}
      {/* ======================================================== */}
      <div className={`lg:ml-72 ${!hideTopBar ? 'lg:pt-18' : ''} ${hideBottomNav ? '' : 'pb-20 lg:pb-8'}`}>
        {children}
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION (RN-020 / [P0-2] De-stacking)   */}
      {/* ======================================================== */}
      {!hideBottomNav && (
        <nav
          aria-label="Navegação Principal Mobile"
          className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-1.5 h-16 bg-[var(--color-serene-surface)] border-t border-[var(--color-serene-outline-variant)]/30 shadow-[0_-4px_16px_rgba(75,30,90,0.06)]"
        >
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] p-1 gap-0.5 active:scale-90 transition-transform ${
                  isActive
                    ? 'text-[var(--color-serene-primary-text)] font-bold'
                    : 'text-[var(--color-serene-on-surface-variant)] font-medium hover:text-[var(--color-serene-primary-text)]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] leading-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
