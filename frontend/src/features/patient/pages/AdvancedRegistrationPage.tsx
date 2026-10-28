import React, { useState } from 'react';
import '../patient-serene.css';

export interface AdvancedRegistrationFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  bloodType: string;
  allergies: string[];
  gestations: number;
  births: number;
  abortions: number;
  continuousMeds: string;
  insuranceName: string;
  insuranceCardNumber: string;
  insurancePlanTier: string;
  consentLgpd: boolean;
}

export interface AdvancedRegistrationPageProps {
  initialData?: Partial<AdvancedRegistrationFormData>;
  onBack?: () => void;
  onSaveDraft?: (data: AdvancedRegistrationFormData) => void;
  onSubmit?: (data: AdvancedRegistrationFormData) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ALLERGY_OPTIONS = [
  'Dipirona',
  'Penicilina',
  'Anti-inflamatórios (AINEs)',
  'Iodo / Contraste',
  'Nenhuma conhecida',
];
const INSURANCE_OPTIONS = [
  { id: 'bradesco', label: 'Bradesco Saúde' },
  { id: 'sulamerica', label: 'SulAmérica' },
  { id: 'amil', label: 'Amil One' },
  { id: 'particular', label: 'Particular / Reemb.' },
];

export const AdvancedRegistrationPage: React.FC<AdvancedRegistrationPageProps> = ({
  initialData,
  onBack,
  onSaveDraft,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName ?? 'Mariana Clara Silveira');
  const [cpf, setCpf] = useState(initialData?.cpf ?? '382.491.028-55');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate ?? '1994-08-14');
  const [phone, setPhone] = useState(initialData?.phone ?? '(11) 98452-3301');
  const [email, setEmail] = useState(initialData?.email ?? 'mariana.clara@email.com');
  const [emergencyContactName, setEmergencyContactName] = useState(
    initialData?.emergencyContactName ?? 'Lucas Silveira'
  );
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(
    initialData?.emergencyContactRelation ?? 'Cônjuge'
  );
  const [bloodType, setBloodType] = useState(initialData?.bloodType ?? 'A+');
  const [allergies, setAllergies] = useState<string[]>(
    initialData?.allergies ?? ['Dipirona']
  );
  const [gestations, setGestations] = useState(initialData?.gestations ?? 1);
  const [births, setBirths] = useState(initialData?.births ?? 0);
  const [abortions, setAbortions] = useState(initialData?.abortions ?? 0);
  const [continuousMeds, setContinuousMeds] = useState(
    initialData?.continuousMeds ?? 'Ácido Fólico 5mg, Ômega 3 DHA Materno'
  );
  const [insuranceName, setInsuranceName] = useState(
    initialData?.insuranceName ?? 'Bradesco Saúde'
  );
  const [insuranceCardNumber, setInsuranceCardNumber] = useState(
    initialData?.insuranceCardNumber ?? '7048 2901 4489 001'
  );
  const [insurancePlanTier, setInsurancePlanTier] = useState(
    initialData?.insurancePlanTier ?? 'Top Nacional Plus - Obstetrícia'
  );
  const [consentLgpd, setConsentLgpd] = useState(initialData?.consentLgpd ?? true);

  const [isDirty, setIsDirty] = useState(false);

  const getFormData = (): AdvancedRegistrationFormData => ({
    fullName,
    cpf,
    birthDate,
    phone,
    email,
    emergencyContactName,
    emergencyContactRelation,
    bloodType,
    allergies,
    gestations,
    births,
    abortions,
    continuousMeds,
    insuranceName,
    insuranceCardNumber,
    insurancePlanTier,
    consentLgpd,
  });

  const handleBack = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'Você possui alterações não salvas no cadastro. Deseja realmente sair e descartar as alterações?'
      );
      if (!confirmLeave) return;
    }
    onBack?.();
  };

  const handleToggleAllergy = (item: string) => {
    setIsDirty(true);
    if (item === 'Nenhuma conhecida') {
      setAllergies(['Nenhuma conhecida']);
      return;
    }

    const filtered = allergies.filter((a) => a !== 'Nenhuma conhecida');
    if (filtered.includes(item)) {
      setAllergies(filtered.filter((a) => a !== item));
    } else {
      setAllergies([...filtered, item]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit?.(getFormData());
  };

  return (
    <div className="serene-page relative min-h-screen flex flex-col justify-between selection:bg-[var(--color-serene-surface-low)] selection:text-[var(--color-serene-primary-text)]">
      {/* Header Mobile Compacto */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 max-w-screen-md mx-auto bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--color-serene-outline-variant)]">
        <div className="flex items-center gap-2">
          <button
            aria-label="Voltar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-low)] active:scale-95 transition-all"
            type="button"
            onClick={handleBack}
          >
            <span className="material-symbols-outlined" data-icon="arrow_back">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[var(--color-serene-primary-text)] tracking-tight">
              Cadastro Avançado
            </span>
            <span className="text-xs text-[var(--color-serene-text-muted)]">Área da Paciente</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-screen-md mx-auto pt-20 pb-32 px-4 space-y-6">
        {/* Barra de Progresso Clínico */}
        <section className="serene-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-serene-primary)] animate-pulse" />
              <span className="text-xs font-bold text-[var(--color-serene-primary-text)]">
                Passo 1 de 3
              </span>
            </div>
            <span className="text-xs font-bold text-[var(--color-serene-secondary)] bg-[var(--color-serene-surface-low)] px-2.5 py-0.5 rounded-full border border-[var(--color-serene-outline-variant)]">
              75% Concluído
            </span>
          </div>
          <p className="text-xs text-[var(--color-serene-text-muted)] mb-3">
            Perfil Clínico Completo e Histórico Pré-Natal
          </p>
          <div className="w-full bg-[var(--color-serene-surface-low)] rounded-full h-2 overflow-hidden border border-[var(--color-serene-outline-variant)]/40">
            <div
              className="bg-gradient-to-r from-[var(--color-serene-primary)] to-[var(--color-serene-secondary)] h-full rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            />
          </div>
        </section>

        {/* Formulário Multi-Seção */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. IDENTIFICAÇÃO E CONTATO */}
          <div className="serene-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined" data-icon="person_outline">
                  person_outline
                </span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-serene-text-main)]">
                  Identificação e Contato
                </h2>
                <p className="text-xs text-[var(--color-serene-text-muted)]">
                  Dados para prontuário seguro e notificações
                </p>
              </div>
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-name">
                Nome Completo da Paciente <span className="text-[var(--color-serene-primary-text)]">*</span>
              </label>
              <input
                id="adv-name"
                type="text"
                required
                className="serene-input text-xs"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setIsDirty(true);
                }}
              />
            </div>

            {/* CPF & Nascimento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-cpf">
                  CPF <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="adv-cpf"
                  type="text"
                  required
                  className="serene-input text-xs"
                  value={cpf}
                  onChange={(e) => {
                    setCpf(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-birth">
                  Nascimento <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="adv-birth"
                  type="date"
                  required
                  className="serene-input text-xs"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>

            {/* Telefone & E-mail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-phone">
                  Celular / WhatsApp <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="adv-phone"
                  type="tel"
                  required
                  className="serene-input text-xs"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-email">
                  E-mail para Laudos <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="adv-email"
                  type="email"
                  required
                  className="serene-input text-xs"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>

            {/* Contato de Emergência */}
            <div className="pt-2 border-t border-[var(--color-serene-outline-variant)]/40">
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5">
                Contato de Emergência & Parentesco
              </label>
              <div className="grid grid-cols-5 gap-2">
                <input
                  className="col-span-3 serene-input text-xs"
                  placeholder="Nome do contato (Ex: Lucas Silveira)"
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => {
                    setEmergencyContactName(e.target.value);
                    setIsDirty(true);
                  }}
                />
                <select
                  className="col-span-2 serene-input text-xs"
                  value={emergencyContactRelation}
                  onChange={(e) => {
                    setEmergencyContactRelation(e.target.value);
                    setIsDirty(true);
                  }}
                >
                  <option value="Cônjuge">Cônjuge</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Pai">Pai</option>
                  <option value="Irmã(o)">Irmã(o)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. HISTÓRICO GINECOLÓGICO E OBSTÉTRICO */}
          <div className="serene-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined" data-icon="pregnant_woman">
                  pregnant_woman
                </span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-serene-text-main)]">
                  Histórico Ginecológico & Clínico
                </h2>
                <p className="text-xs text-[var(--color-serene-text-muted)]">
                  Informações fundamentais para o acompanhamento
                </p>
              </div>
            </div>

            {/* Tipo Sanguíneo em Badges Selecionáveis */}
            <div>
              <span className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-2">
                Tipo Sanguíneo e Fator Rh
              </span>
              <div className="grid grid-cols-4 gap-2" id="blood-group-selector">
                {BLOOD_TYPES.map((bt) => {
                  const isSelected = bloodType === bt;
                  return (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => {
                        setBloodType(bt);
                        setIsDirty(true);
                      }}
                      className={`serene-chip text-center font-bold text-xs h-10 flex items-center justify-center ${
                        isSelected ? 'active' : ''
                      }`}
                    >
                      {bt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alergias Medicamentosas */}
            <div>
              <span className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-2">
                Alergias Medicamentosas (Toque para selecionar)
              </span>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((item) => {
                  const isSelected = allergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleAllergy(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'border-[var(--color-serene-primary)] text-[var(--color-serene-primary-text)] bg-[var(--color-serene-surface-low)] font-bold'
                          : 'border-[var(--color-serene-outline-variant)] text-[var(--color-serene-text-muted)] bg-white hover:bg-[var(--color-serene-surface-low)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSelected ? 'check' : 'add'}
                      </span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Histórico Obstétrico GPA */}
            <div className="p-3.5 rounded-xl bg-[var(--color-serene-surface-low)] border border-[var(--color-serene-outline-variant)]">
              <span className="block text-xs font-bold text-[var(--color-serene-secondary)] mb-2">
                Histórico Obstétrico (GPA)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* Gestações */}
                <div className="bg-white p-2.5 rounded-lg text-center border border-[var(--color-serene-outline-variant)]">
                  <span className="block text-[11px] text-[var(--color-serene-text-muted)]">Gestações</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      aria-label="Diminuir gestações"
                      onClick={() => {
                        setGestations((g) => Math.max(0, g - 1));
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span data-testid="gpa-gestations" className="text-base font-bold text-[var(--color-serene-primary-text)]">
                      {gestations}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar gestações"
                      onClick={() => {
                        setGestations((g) => g + 1);
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Partos */}
                <div className="bg-white p-2.5 rounded-lg text-center border border-[var(--color-serene-outline-variant)]">
                  <span className="block text-[11px] text-[var(--color-serene-text-muted)]">Partos</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      aria-label="Diminuir partos"
                      onClick={() => {
                        setBirths((b) => Math.max(0, b - 1));
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span data-testid="gpa-births" className="text-base font-bold text-[var(--color-serene-secondary)]">
                      {births}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar partos"
                      onClick={() => {
                        setBirths((b) => b + 1);
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Abortos */}
                <div className="bg-white p-2.5 rounded-lg text-center border border-[var(--color-serene-outline-variant)]">
                  <span className="block text-[11px] text-[var(--color-serene-text-muted)]">Abortos</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      type="button"
                      aria-label="Diminuir abortos"
                      onClick={() => {
                        setAbortions((a) => Math.max(0, a - 1));
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span data-testid="gpa-abortions" className="text-base font-bold text-[var(--color-serene-secondary)]">
                      {abortions}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar abortos"
                      onClick={() => {
                        setAbortions((a) => a + 1);
                        setIsDirty(true);
                      }}
                      className="w-5 h-5 rounded-full bg-[var(--color-serene-surface-low)] text-xs font-bold text-[var(--color-serene-secondary)] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicamentos de Uso Contínuo */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-meds">
                Medicamentos em Uso Contínuo ou Polivitamínicos
              </label>
              <input
                id="adv-meds"
                type="text"
                className="serene-input text-xs"
                value={continuousMeds}
                onChange={(e) => {
                  setContinuousMeds(e.target.value);
                  setIsDirty(true);
                }}
              />
            </div>
          </div>

          {/* 3. DADOS DO CONVÊNIO OU REEMBOLSO */}
          <div className="serene-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined" data-icon="health_and_safety">
                  health_and_safety
                </span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-serene-text-main)]">
                  Convênio ou Reembolso
                </h2>
                <p className="text-xs text-[var(--color-serene-text-muted)]">
                  Cobertura para consultas obstétricas e partos
                </p>
              </div>
            </div>

            {/* Operadora de Saúde */}
            <div>
              <span className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-2">
                Operadora de Saúde
              </span>
              <div className="grid grid-cols-2 gap-2">
                {INSURANCE_OPTIONS.map((ins) => {
                  const isChecked = insuranceName === ins.label;
                  return (
                    <label
                      key={ins.id}
                      className={`cursor-pointer rounded-xl p-3 flex items-center gap-2.5 border transition-all ${
                        isChecked
                          ? 'border-2 border-[var(--color-serene-primary)] bg-[var(--color-serene-surface-low)]'
                          : 'border-[var(--color-serene-outline-variant)] bg-white hover:bg-[var(--color-serene-surface-low)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="insurance"
                        value={ins.label}
                        checked={isChecked}
                        onChange={() => {
                          setInsuranceName(ins.label);
                          setIsDirty(true);
                        }}
                        className="text-[var(--color-serene-primary)] focus:ring-[var(--color-serene-primary)]"
                      />
                      <span className="text-xs font-semibold text-[var(--color-serene-text-main)]">
                        {ins.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Carteirinha & Plano */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-card">
                  Número da Carteirinha
                </label>
                <input
                  id="adv-card"
                  type="text"
                  className="serene-input text-xs"
                  value={insuranceCardNumber}
                  onChange={(e) => {
                    setInsuranceCardNumber(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5" htmlFor="adv-tier">
                  Plano / Categoria
                </label>
                <input
                  id="adv-tier"
                  type="text"
                  className="serene-input text-xs"
                  value={insurancePlanTier}
                  onChange={(e) => {
                    setInsurancePlanTier(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 4. CONSENTIMENTO MÉDICO CFM & LGPD */}
          <div className="rounded-2xl p-4 bg-[var(--color-serene-surface-low)] border border-[var(--color-serene-outline-variant)] flex items-start gap-3">
            <input
              id="adv-consent"
              type="checkbox"
              checked={consentLgpd}
              onChange={(e) => {
                setConsentLgpd(e.target.checked);
                setIsDirty(true);
              }}
              className="mt-1 h-5 w-5 rounded text-[var(--color-serene-primary)] focus:ring-[var(--color-serene-primary)] border-[var(--color-serene-outline-variant)]"
            />
            <label htmlFor="adv-consent" className="text-xs text-[var(--color-serene-text-main)] leading-relaxed cursor-pointer select-none">
              Declaro a veracidade dos dados clínicos fornecidos e autorizo a <strong>Cana Med Mulher</strong> a armazenar e processar meu prontuário ginecológico e obstétrico em conformidade com as resoluções do CFM e a LGPD (Lei 13.709/18).
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="serene-btn-primary w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Concluir Cadastro</span>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </button>
            <button
              type="button"
              onClick={() => onSaveDraft?.(getFormData())}
              className="serene-btn-secondary w-full py-3 px-6 text-xs flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Salvar rascunho</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
