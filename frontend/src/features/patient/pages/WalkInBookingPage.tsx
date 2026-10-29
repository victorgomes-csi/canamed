import React, { useState } from 'react';
import '../patient-serene.css';

export interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  price: string;
  nextSlot: string;
  modalityType: 'telemedicina' | 'presencial' | 'ambas';
  avatarUrl?: string;
  fastest?: boolean;
}

export interface WalkInBookingPageProps {
  onBack?: () => void;
  onContinue?: (data: {
    modality: 'telemedicina' | 'presencial';
    reason: string;
    doctorId: string;
    symptoms?: string;
  }) => void;
  onNavigateTab?: (tab: string) => void;
  emergencyPhone?: string;
  initialDoctors?: DoctorOption[];
}

const DEFAULT_DOCTORS: DoctorOption[] = [
  {
    id: 'doc-beatriz',
    name: 'Dra. Beatriz Faria',
    specialty: 'Ginecologia & Telemedicina',
    crm: 'CRM 162.408',
    price: 'R$ 290',
    nextSlot: 'Disponível em ~20 min',
    modalityType: 'telemedicina',
    fastest: true,
    avatarUrl: '/assets/brand/canamed_logo-removebg-preview.png',
  },
  {
    id: 'doc-mariana',
    name: 'Dra. Mariana Siqueira',
    specialty: 'Ginecologia Geral & Reprodutiva',
    crm: 'CRM 148.920',
    price: 'R$ 350',
    nextSlot: 'Hoje às 15:30 • Presencial - Jardins',
    modalityType: 'presencial',
    avatarUrl: '/assets/brand/canamed_logo-removebg-preview.png',
  },
];

const REASON_TAGS = [
  'Dúvida ou sintoma agudo',
  'Segunda opinião médica',
  'Renovação de receita / Pílula',
  'Avaliação de exame alterado',
  'Outro motivo',
];

const RED_FLAGS_KEYWORDS = [
  'sangramento',
  'dor aguda',
  'perda de líquido',
  'febre alta',
  'visão turva',
  'escotoma',
  'desmaio',
  'falta de ar',
];

export const WalkInBookingPage: React.FC<WalkInBookingPageProps> = ({
  onBack,
  onContinue,
  onNavigateTab,
  emergencyPhone = '0800-000-2424',
  initialDoctors = DEFAULT_DOCTORS,
}) => {
  const [modality, setModality] = useState<'telemedicina' | 'presencial'>('telemedicina');
  const [selectedReason, setSelectedReason] = useState<string>('Dúvida ou sintoma agudo');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctors[0]?.id || 'doc-beatriz');
  const [symptoms, setSymptoms] = useState<string>('');

  const hasRedFlag = RED_FLAGS_KEYWORDS.some((kw) =>
    symptoms.toLowerCase().includes(kw)
  );

  const handleContinue = () => {
    onContinue?.({
      modality,
      reason: selectedReason,
      doctorId: selectedDoctorId,
      symptoms: symptoms.trim() || undefined,
    });
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body-md min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-primary">
      {/* Mobile Container Shell */}
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col bg-background shadow-2xl">
        {/* TopAppBar */}
        <header className="sticky top-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-md px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              aria-label="Voltar"
              className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container active:scale-95 transition-all duration-150"
              type="button"
              onClick={onBack}
            >
              <span className="material-symbols-outlined" data-icon="arrow_back">
                arrow_back
              </span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                  Consulta Avulsa
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/10 text-primary-container">
                  Pontual
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-tertiary">
                Atendimento ginecológico ou obstétrico pontual
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <img
              alt="Cana Med Mulher"
              className="h-6 w-auto object-contain opacity-90 pl-1"
              src="/assets/brand/canamed_logo-removebg-preview.png"
            />
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 px-4 pt-4 pb-28 space-y-5 overflow-y-auto">
          {/* Badge & Hero Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-4 border border-outline-variant/30">
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined" data-icon="bolt">
                  bolt
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Atendimento Rápido &amp; Sem Vínculo Contínuo
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary mt-1">
                  Ideal para queixas imediatas, avaliação de sintomas recentes, segunda opinião médica ou renovação ágil de receitas.
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl pointer-events-none" />
          </section>

          {/* Selector: Modalidade de Atendimento */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]" data-icon="tune">
                  tune
                </span>
                Modalidade de Atendimento
              </h2>
              <span className="font-label-sm text-label-sm text-tertiary">Selecione 1 opção</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Telemedicina */}
              <label
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all ${
                  modality === 'telemedicina'
                    ? 'border-2 border-primary bg-surface-container-lowest shadow-sm'
                    : 'border border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="modalidade"
                  checked={modality === 'telemedicina'}
                  onChange={() => setModality('telemedicina')}
                  aria-label="Telemedicina Imediata (Plantão)"
                  className="mt-1 text-primary focus:ring-primary border-outline-variant"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-primary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary" data-icon="videocam">
                        videocam
                      </span>
                      Telemedicina Imediata (Plantão)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary">
                      Em até 30 min
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-tertiary mt-1">
                    Consulta por vídeo-chamada criptografada com emissão de receitas digitais e atestados válidos.
                  </p>
                </div>
              </label>

              {/* Option 2: Presencial */}
              <label
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all ${
                  modality === 'presencial'
                    ? 'border-2 border-primary bg-surface-container-lowest shadow-sm'
                    : 'border border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="modalidade"
                  checked={modality === 'presencial'}
                  onChange={() => setModality('presencial')}
                  aria-label="Presencial nas Clínicas"
                  className="mt-1 text-primary focus:ring-primary border-outline-variant"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary" data-icon="location_on">
                        location_on
                      </span>
                      Presencial nas Clínicas
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-high text-secondary">
                      Hoje ou Amanhã
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-tertiary mt-1">
                    Encaixe pontual nas unidades <strong>Paulista</strong> ou <strong>Jardins</strong> com acolhimento clínico completo.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Motivo da Consulta (Tags Interativas) */}
          <section className="space-y-2.5">
            <h2 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]" data-icon="bubble_chart">
                bubble_chart
              </span>
              Principal motivo da consulta
            </h2>
            <div className="flex flex-wrap gap-2">
              {REASON_TAGS.map((tag) => {
                const isSelected = selectedReason === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedReason(tag)}
                    className={`px-3.5 py-2 rounded-full text-label-md font-label-md transition-all active:scale-95 ${
                      isSelected
                        ? 'font-semibold bg-primary text-on-primary shadow-sm hover:brightness-105'
                        : 'font-medium bg-surface-container text-on-secondary-container hover:bg-surface-container-high'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Médicas Disponíveis (Cards Elegantes de Saúde) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]" data-icon="stethoscope">
                  stethoscope
                </span>
                Ginecologistas Disponíveis Agora
              </h2>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                {initialDoctors.length} opções
              </span>
            </div>

            <div className="space-y-3">
              {initialDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                const isFastest = doc.fastest;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3.5 rounded-2xl bg-surface-container-lowest transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-2 border-primary/70 shadow-md'
                        : 'border border-outline-variant/40 shadow-sm hover:border-primary/40'
                    }`}
                  >
                    {isFastest && (
                      <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Mais Rápido
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold overflow-hidden ring-2 ring-primary/20 shrink-0">
                        <span className="material-symbols-outlined text-2xl">person</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between pr-14">
                          <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                            {doc.name}
                          </h3>
                        </div>
                        <p className="font-body-sm text-body-sm text-tertiary">
                          {doc.specialty} • {doc.crm}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-container/15 text-primary">
                            <span className="material-symbols-outlined text-[13px]" data-icon="bolt">
                              bolt
                            </span>
                            {doc.nextSlot}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-container text-secondary">
                            <span className="material-symbols-outlined text-[13px]" data-icon="videocam">
                              videocam
                            </span>
                            Chamada Online Segura
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                      <span className="text-tertiary">
                        Consulta avulsa: <strong className="text-on-surface">{doc.price}</strong>
                      </span>
                      <button
                        type="button"
                        aria-label={`Escolher Plantão ${doc.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctorId(doc.id);
                        }}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                          isSelected
                            ? 'bg-primary text-on-primary hover:bg-primary-container'
                            : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : 'Escolher Plantão'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Campo de Observação Opcional */}
          <section className="space-y-1.5">
            <label
              className="block font-label-md text-label-md font-semibold text-on-surface-variant flex items-center justify-between"
              htmlFor="observacoes"
            >
              <span>O que você está sentindo?</span>
              <span className="font-normal text-tertiary text-xs">Opcional</span>
            </label>
            <div className="relative">
              <textarea
                id="observacoes"
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Ex: Cólica atípica desde ontem, dúvida sobre interação de medicamento..."
                className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-lowest text-on-surface p-3 font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-tertiary/60"
              />
              <span
                className="material-symbols-outlined absolute right-3 bottom-3 text-tertiary/40 text-[18px]"
                data-icon="edit_note"
              >
                edit_note
              </span>
            </div>
          </section>

          {/* Alerta Clínico de Triagem e Urgência */}
          <section
            className={`rounded-2xl p-3.5 border flex items-start gap-2.5 transition-all ${
              hasRedFlag
                ? 'bg-error-container/50 border-error ring-2 ring-error/50'
                : 'bg-error-container/30 border-error/20'
            }`}
          >
            <span className="material-symbols-outlined text-error shrink-0 mt-0.5" data-icon="emergency">
              emergency
            </span>
            <div className="text-xs text-on-surface leading-relaxed w-full">
              <strong className="text-error font-semibold block mb-0.5">
                Atenção: Sintomas de Emergência Obstétrica ou Ginecológica
              </strong>
              <p>
                Caso apresente febre alta (&gt;38,5°C), dor abdominal aguda súbita ou sangramento volumoso, <strong>dirija-se imediatamente a um pronto-socorro obstétrico ou ginecológico hospitalar</strong>.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:192"
                  className="inline-flex items-center gap-1 text-xs font-bold text-error hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>Ligar 192 SAMU</span>
                </a>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-error hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                  <span>Plantão 24h Clínica</span>
                </a>
              </div>
            </div>
          </section>

          {/* Call to Action Container */}
          <section className="pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Continuar para Confirmação</span>
              <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
            <p className="text-center font-label-sm text-label-sm text-tertiary mt-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-primary" data-icon="lock">
                lock
              </span>
              Ambiente seguro certificado pela Cana Med Mulher
            </p>
          </section>
        </main>

        {/* BottomNavBar */}
        <nav
          aria-label="Navegação Inferior"
          className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 h-16 bg-surface border-t border-outline-variant/30 shadow-[0_-4px_16px_rgba(75,30,90,0.06)]"
        >
          <button
            type="button"
            onClick={() => onNavigateTab?.('inicio')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors duration-150 active:scale-90"
          >
            <span className="material-symbols-outlined" data-icon="home">
              home
            </span>
            <span className="text-label-sm font-label-sm">Início</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center text-primary font-bold gap-1 active:scale-90 transition-transform duration-150"
          >
            <span
              className="material-symbols-outlined"
              data-icon="calendar_add_on"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_add_on
            </span>
            <span className="text-label-sm font-label-sm">Agendar</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('consultas')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors duration-150 active:scale-90"
          >
            <span className="material-symbols-outlined" data-icon="calendar_month">
              calendar_month
            </span>
            <span className="text-label-sm font-label-sm">Consultas</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('prenatal')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors duration-150 active:scale-90"
          >
            <span className="material-symbols-outlined" data-icon="pregnant_woman">
              pregnant_woman
            </span>
            <span className="text-label-sm font-label-sm">Pré-natal</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('perfil')}
            className="flex flex-col items-center justify-center text-tertiary font-medium gap-1 hover:text-primary transition-colors duration-150 active:scale-90"
          >
            <span className="material-symbols-outlined" data-icon="person">
              person
            </span>
            <span className="text-label-sm font-label-sm">Perfil</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
