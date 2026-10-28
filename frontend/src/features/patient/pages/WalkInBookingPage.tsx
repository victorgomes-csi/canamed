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
  },
  {
    id: 'doc-mariana',
    name: 'Dra. Mariana Siqueira',
    specialty: 'Ginecologia Geral & Reprodutiva',
    crm: 'CRM 148.920',
    price: 'R$ 350',
    nextSlot: 'Hoje às 15:30 (Presencial - Jardins)',
    modalityType: 'presencial',
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
  emergencyPhone = '5511999990000',
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
    <div className="serene-page relative min-h-screen flex flex-col justify-between selection:bg-[var(--color-serene-surface-low)] selection:text-[var(--color-serene-primary-text)]">
      {/* Mobile Container Shell */}
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col bg-[var(--color-serene-surface)] shadow-2xl">
        {/* TopAppBar */}
        <header className="sticky top-0 left-0 w-full z-40 bg-[var(--color-serene-surface)]/90 backdrop-blur-md px-4 py-3 border-b border-[var(--color-serene-outline-variant)] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              aria-label="Voltar"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-low)] active:scale-95 transition-all"
              type="button"
              onClick={onBack}
            >
              <span className="material-symbols-outlined" data-icon="arrow_back">
                arrow_back
              </span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--color-serene-primary-text)] tracking-tight">
                  Consulta Avulsa
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-serene-surface-low)] text-[var(--color-serene-primary-text)] border border-[var(--color-serene-outline-variant)]">
                  Pontual
                </span>
              </div>
              <p className="text-xs text-[var(--color-serene-text-muted)]">
                Atendimento ginecológico ou obstétrico pontual
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 px-4 pt-4 pb-28 space-y-5 overflow-y-auto">
          {/* Badge & Hero Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-serene-surface-low)] via-white to-[var(--color-serene-surface)] p-4 border border-[var(--color-serene-outline-variant)] shadow-sm">
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-serene-primary)] text-white flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined" data-icon="bolt">
                  bolt
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-[var(--color-serene-primary-text)]">
                  Atendimento Rápido & Sem Vínculo Contínuo
                </span>
                <p className="text-xs text-[var(--color-serene-text-muted)] mt-1 leading-relaxed">
                  Ideal para queixas imediatas, avaliação de sintomas recentes, segunda opinião médica ou renovação ágil de receitas.
                </p>
              </div>
            </div>
          </section>

          {/* Selector: Modalidade de Atendimento */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-serene-text-main)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--color-serene-primary)] text-[18px]" data-icon="tune">
                  tune
                </span>
                Modalidade de Atendimento
              </h2>
              <span className="text-xs text-[var(--color-serene-text-muted)]">Selecione 1 opção</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Telemedicina */}
              <label
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  modality === 'telemedicina'
                    ? 'border-[var(--color-serene-primary)] bg-white shadow-sm'
                    : 'border-[var(--color-serene-outline-variant)] bg-white/70 hover:border-[var(--color-serene-primary)]/50'
                }`}
              >
                <input
                  type="radio"
                  name="modalidade"
                  checked={modality === 'telemedicina'}
                  onChange={() => setModality('telemedicina')}
                  aria-label="Telemedicina Imediata (Plantão)"
                  className="mt-1 text-[var(--color-serene-primary)] focus:ring-[var(--color-serene-primary)] border-gray-300"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--color-serene-primary-text)] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[var(--color-serene-primary)]" data-icon="videocam">
                        videocam
                      </span>
                      Telemedicina Imediata (Plantão)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-serene-primary)] text-white">
                      Em até 30 min
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-serene-text-muted)] mt-1">
                    Consulta por vídeo-chamada criptografada com emissão de receitas digitais e atestados válidos.
                  </p>
                </div>
              </label>

              {/* Option 2: Presencial */}
              <label
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  modality === 'presencial'
                    ? 'border-2 border-[var(--color-serene-primary)] bg-white shadow-sm'
                    : 'border-[var(--color-serene-outline-variant)] bg-white/70 hover:border-[var(--color-serene-primary)]/50'
                }`}
              >
                <input
                  type="radio"
                  name="modalidade"
                  checked={modality === 'presencial'}
                  onChange={() => setModality('presencial')}
                  aria-label="Presencial nas Clínicas"
                  className="mt-1 text-[var(--color-serene-primary)] focus:ring-[var(--color-serene-primary)] border-gray-300"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--color-serene-text-main)] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[var(--color-serene-secondary)]" data-icon="location_on">
                        location_on
                      </span>
                      Presencial nas Clínicas
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-serene-surface-low)] text-[var(--color-serene-secondary)]">
                      Hoje ou Amanhã
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-serene-text-muted)] mt-1">
                    Encaixe pontual nas unidades <strong>Paulista</strong> ou <strong>Jardins</strong> com acolhimento clínico completo.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* Motivo da Consulta (Tags Interativas) */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold text-[var(--color-serene-text-main)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[var(--color-serene-primary)] text-[18px]" data-icon="bubble_chart">
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[var(--color-serene-primary)] text-white shadow-sm'
                        : 'bg-white text-[var(--color-serene-text-muted)] border border-[var(--color-serene-outline-variant)] hover:bg-[var(--color-serene-surface-low)]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Médicas Disponíveis */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-serene-text-main)] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[var(--color-serene-primary)] text-[18px]" data-icon="stethoscope">
                  stethoscope
                </span>
                Ginecologistas Disponíveis Agora
              </h2>
              <span className="text-xs font-semibold text-[var(--color-serene-primary-text)]">
                {initialDoctors.length} opções
              </span>
            </div>

            <div className="space-y-3">
              {initialDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-2xl bg-white border transition-all ${
                      isSelected
                        ? 'border-2 border-[var(--color-serene-primary)] shadow-md relative overflow-hidden'
                        : 'border-[var(--color-serene-outline-variant)] shadow-sm hover:border-[var(--color-serene-primary)]/40'
                    }`}
                  >
                    {doc.fastest && (
                      <div className="absolute top-0 right-0 bg-[var(--color-serene-primary)] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Mais Rápido
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)] font-bold text-base shrink-0 border border-[var(--color-serene-outline-variant)]">
                        {doc.name.replace('Dra. ', '').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between pr-10">
                          <h3 className="text-sm font-bold text-[var(--color-serene-text-main)]">{doc.name}</h3>
                          <span className="text-xs font-bold text-[var(--color-serene-primary-text)]">{doc.price}</span>
                        </div>
                        <p className="text-xs text-[var(--color-serene-text-muted)] mt-0.5">
                          {doc.specialty} • {doc.crm}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--color-serene-surface-low)] text-[var(--color-serene-secondary)]">
                            <span className="material-symbols-outlined text-[13px]" data-icon="schedule">
                              schedule
                            </span>
                            {doc.nextSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[var(--color-serene-outline-variant)]/40 flex items-center justify-between text-xs">
                      <span className="text-[var(--color-serene-text-muted)]">Reembolso facilitado para convênios</span>
                      <button
                        type="button"
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-[var(--color-serene-primary)] text-white'
                            : 'bg-[var(--color-serene-surface-low)] text-[var(--color-serene-primary-text)] hover:bg-[var(--color-serene-outline-variant)]'
                        }`}
                        aria-label={`Escolher Plantão ${doc.name}`}
                      >
                        {isSelected ? 'Selecionada' : 'Selecionar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Campo de Observação Opcional */}
          <section className="space-y-1.5">
            <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] flex items-center justify-between" htmlFor="symptoms-obs">
              <span>O que você está sentindo?</span>
              <span className="font-normal text-[var(--color-serene-text-muted)]">Opcional</span>
            </label>
            <div className="relative">
              <textarea
                id="symptoms-obs"
                className="w-full rounded-xl border border-[var(--color-serene-outline-variant)] bg-white text-[var(--color-serene-text-main)] p-3 text-xs focus:border-[var(--color-serene-primary)] focus:ring-2 focus:ring-[var(--color-serene-primary)]/20 transition-all resize-none placeholder:text-[var(--color-serene-text-muted)]/60"
                placeholder="Ex: Cólica atípica desde ontem, dúvida sobre interação de medicamento..."
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </section>

          {/* Alerta de Red Flags / Emergência Obstétrica */}
          {hasRedFlag ? (
            <div className="rounded-2xl p-4 bg-red-50 border-2 border-red-500 text-red-900 shadow-md space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-red-600 text-2xl shrink-0 mt-0.5" data-icon="emergency">
                  emergency
                </span>
                <div>
                  <strong className="text-red-700 font-bold block text-sm">
                    Atenção: Sintomas de Emergência Obstétrica
                  </strong>
                  <p className="text-xs leading-relaxed text-red-800 mt-1">
                    Dirija-se imediatamente a um pronto-socorro obstétrico ou ginecológico hospitalar. Intercorrências agudas exigem avaliação física presencial urgente.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:192"
                  className="py-2.5 px-3 rounded-xl bg-red-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm hover:bg-red-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  Ligar 192 SAMU
                </a>
                <a
                  href={`tel:${emergencyPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-white border border-red-300 text-red-700 font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">local_hospital</span>
                  Plantão 24h Clínica
                </a>
              </div>
            </div>
          ) : (
            <section className="rounded-2xl p-3.5 bg-red-50/60 border border-red-200/60 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-red-600 shrink-0 mt-0.5 text-lg" data-icon="emergency">
                emergency
              </span>
              <div className="text-xs text-[var(--color-serene-text-main)] leading-relaxed">
                <strong className="text-red-700 font-semibold block mb-0.5">Aviso importante de segurança</strong>
                Caso apresente febre alta (&gt;38,5°C), dor abdominal aguda súbita ou sangramento volumoso, dirija-se imediatamente a um <strong>pronto-socorro obstétrico hospitalar</strong>.
              </div>
            </section>
          )}

          {/* Call to Action Container */}
          <section className="pt-2">
            <button
              type="button"
              onClick={handleContinue}
              className="serene-btn-primary w-full py-3.5 px-4 text-sm flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Continuar para Confirmação</span>
              <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
            <p className="text-center text-[11px] text-[var(--color-serene-text-muted)] mt-2 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[var(--color-serene-primary-text)]" data-icon="lock">
                lock
              </span>
              Ambiente seguro certificado pela Cana Med Mulher
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};
