import React from 'react';

export interface FetalComparison {
  emoji: string;
  name: string;
  sizeDescription: string;
}

export interface PrenatalWidgetProps {
  currentWeeks?: number;
  currentDays?: number;
  totalWeeks?: number;
  dueDate?: string;
  daysRemaining?: number;
  trimester?: number;
  fetalComparison?: FetalComparison;
  lastExam?: {
    title: string;
    date: string;
    status: string;
    pdfUrl?: string;
  };
  onAccessCard?: () => void;
  className?: string;
}

const getDefaultFetalComparison = (weeks: number): FetalComparison => {
  if (weeks <= 8) return { emoji: '🫐', name: 'mirtilo', sizeDescription: '~1.6 cm e 1g' };
  if (weeks <= 12) return { emoji: '🍋', name: 'limão', sizeDescription: '~5.4 cm e 14g' };
  if (weeks <= 16) return { emoji: '🥑', name: 'abacate', sizeDescription: '~11.6 cm e 100g' };
  if (weeks <= 20) return { emoji: '🍌', name: 'banana', sizeDescription: '~25.6 cm e 300g' };
  if (weeks <= 24) return { emoji: '🌽', name: 'espiga de milho', sizeDescription: '~30 cm e 600g' };
  if (weeks <= 28) return { emoji: '🍆', name: 'berinjela', sizeDescription: '~35 cm e 760g' };
  if (weeks <= 32) return { emoji: '🥥', name: 'coco', sizeDescription: '~42 cm e 1.7kg' };
  if (weeks <= 36) return { emoji: '🍈', name: 'melão', sizeDescription: '~47 cm e 2.6kg' };
  return { emoji: '🍉', name: 'melancia', sizeDescription: '~50 cm e 3.4kg' };
};

export const PrenatalWidget: React.FC<PrenatalWidgetProps> = ({
  currentWeeks = 26,
  currentDays,
  totalWeeks = 40,
  dueDate = '22/01/2025',
  daysRemaining,
  trimester,
  fetalComparison,
  lastExam = {
    title: 'Ultrassom Morfológico 2º Trimestre',
    date: '12 Out',
    status: 'Laudo aprovado e assinado',
    pdfUrl: '#laudo',
  },
  onAccessCard,
  className = '',
}) => {
  const calculatedTrimester = trimester || (currentWeeks <= 13 ? 1 : currentWeeks <= 27 ? 2 : 3);
  const percentage = Math.min(100, Math.max(0, Math.round((currentWeeks / totalWeeks) * 100)));
  const comparison = fetalComparison || getDefaultFetalComparison(currentWeeks);

  return (
    <div
      className={`bg-gradient-to-br from-[var(--color-serene-surface-card)] via-[var(--color-serene-surface-container-low)] to-[var(--color-serene-surface-container)]/60 rounded-2xl p-5 border border-[var(--color-serene-outline-variant)]/60 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-serene-secondary-container)]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header Metric Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-serene-primary-container)] text-white text-xs font-bold shadow-xs">
          <span className="material-symbols-outlined text-[16px]">child_care</span>
          <span>
            {currentWeeks}ª Semana Gestacional
            {currentDays !== undefined && currentDays > 0 ? ` e ${currentDays} dias` : ''}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[var(--color-serene-on-surface-variant)] block font-medium">
            DPP Estimada:
          </span>
          <span className="text-sm font-bold text-[var(--color-serene-on-surface)]">
            {dueDate}
          </span>
          {daysRemaining !== undefined && (
            <span className="text-[11px] text-[var(--color-serene-secondary)] font-medium block">
              {daysRemaining} dias restantes
            </span>
          )}
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="space-y-1.5 py-1">
        <div className="flex justify-between text-xs text-[var(--color-serene-on-surface-variant)]">
          <span>
            {calculatedTrimester}º Trimestre (Semana {currentWeeks} de {totalWeeks})
          </span>
          <span className="text-[var(--color-serene-primary-text)] font-bold">
            {percentage}% concluído
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={currentWeeks}
          aria-valuemin={1}
          aria-valuemax={totalWeeks}
          aria-valuetext={`Semana ${currentWeeks} de ${totalWeeks} - ${percentage}% concluído`}
          className="w-full h-3 bg-[var(--color-serene-surface-container-high)] rounded-full overflow-hidden p-0.5 border border-[var(--color-serene-outline-variant)]/40"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--color-serene-secondary)] to-[var(--color-serene-primary-container)] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-[var(--color-serene-on-surface-variant)] pt-0.5">
          <span>1ª Sem</span>
          <span>Trimestre 2</span>
          <span>{totalWeeks}ª Sem</span>
        </div>
      </div>

      {/* Fetal Size Comparison */}
      <div className="mt-3.5 p-3.5 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-serene-secondary-fixed)] flex items-center justify-center text-2xl shrink-0">
          {comparison.emoji}
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-serene-secondary)] block">
            Tamanho do Bebê
          </span>
          <p className="text-sm font-bold text-[var(--color-serene-on-surface)]">
            Como uma {comparison.name}
          </p>
          <p className="text-xs text-[var(--color-serene-on-surface-variant)]">
            {comparison.sizeDescription}.
          </p>
        </div>
      </div>

      {/* Last validated exam strip */}
      {lastExam && (
        <div className="mt-3 p-3 rounded-xl bg-[var(--color-serene-surface-card)] border border-[var(--color-serene-outline-variant)]/30 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-serene-on-surface)]">
            <div className="flex items-center gap-1 text-emerald-700">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>Último Exame Realizado</span>
            </div>
            <span className="text-[11px] text-[var(--color-serene-on-surface-variant)] font-normal">
              {lastExam.date}
            </span>
          </div>
          <p className="text-xs font-semibold text-[var(--color-serene-on-surface)] pl-4">
            {lastExam.title}
          </p>
          <div className="pl-4 flex items-center justify-between text-xs text-emerald-700">
            <span>{lastExam.status}</span>
            {lastExam.pdfUrl && (
              <a href={lastExam.pdfUrl} className="text-[var(--color-serene-primary-text)] font-semibold hover:underline">
                Ver laudo
              </a>
            )}
          </div>
        </div>
      )}

      {/* Direct CTA Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onAccessCard}
          className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-serene-secondary)] text-white hover:bg-[var(--color-serene-secondary)]/90 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            badge
          </span>
          <span>Acessar Cartão da Gestante</span>
        </button>
      </div>
    </div>
  );
};
