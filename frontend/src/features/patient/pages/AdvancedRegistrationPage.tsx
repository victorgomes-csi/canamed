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
  onNavigateTab?: (tab: string) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(getFormData());
  };

  const handleDraft = () => {
    onSaveDraft?.(getFormData());
    setIsDirty(false);
  };

  return (
    <div className="bg-background text-on-surface antialiased min-h-full flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top App Bar Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 max-w-screen-md mx-auto bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button
            aria-label="Voltar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container active:scale-95 transition-all duration-150"
            type="button"
            onClick={handleBack}
          >
            <span className="material-symbols-outlined" data-icon="arrow_back">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
              Cadastro Avançado
            </span>
            <span className="font-label-sm text-label-sm text-tertiary">
              Área da Paciente
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 px-2 py-1 rounded-xl bg-surface-container-low flex items-center justify-center shadow-sm border border-outline-variant/30">
            <img
              alt="Logo Cana Med Mulher"
              className="h-6 w-auto object-contain"
              src="/assets/brand/canamed_logo-removebg-preview.png"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-screen-md mx-auto pt-20 pb-36 px-4 space-y-6">
        {/* Barra de Progresso Clínico */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(75,30,90,0.04)] border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-lg text-label-lg text-primary font-bold">
                Passo 1 de 3
              </span>
            </div>
            <span className="font-label-md text-label-md text-secondary font-bold bg-surface-container px-2.5 py-0.5 rounded-full">
              75% Concluído
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-tertiary mb-3">
            Perfil Clínico Completo e Histórico Pré-Natal
          </p>
          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            />
          </div>
        </section>

        {/* Formulário Multi-Seção */}
        <form className="space-y-5" id="clinical-record-form" onSubmit={handleSubmit}>
          {/* 1. Identificação e Contato */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(75,30,90,0.04)] border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" data-icon="person_outline">
                  person_outline
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Identificação e Contato
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Dados para prontuário seguro e notificações
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                  htmlFor="full-name"
                >
                  Nome Completo da Paciente <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    id="full-name"
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setIsDirty(true);
                      setFullName(e.target.value);
                    }}
                    className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                  <span className="absolute right-3.5 top-3 text-secondary/60">
                    <span className="material-symbols-outlined" data-icon="badge">
                      badge
                    </span>
                  </span>
                </div>
              </div>

              {/* CPF & Nascimento */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="cpf"
                  >
                    CPF <span className="text-primary">*</span>
                  </label>
                  <input
                    id="cpf"
                    required
                    type="text"
                    value={cpf}
                    onChange={(e) => {
                      setIsDirty(true);
                      setCpf(e.target.value);
                    }}
                    className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                </div>
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="birthdate"
                  >
                    Nascimento <span className="text-primary">*</span>
                  </label>
                  <input
                    id="birthdate"
                    required
                    type="date"
                    value={birthDate}
                    onChange={(e) => {
                      setIsDirty(true);
                      setBirthDate(e.target.value);
                    }}
                    className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                </div>
              </div>

              {/* Celular / WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="phone"
                  >
                    Celular / WhatsApp <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setIsDirty(true);
                        setPhone(e.target.value);
                      }}
                      className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                    />
                    <span className="absolute right-3.5 top-3 text-secondary/60">
                      <span className="material-symbols-outlined" data-icon="phone_iphone">
                        phone_iphone
                      </span>
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="email"
                  >
                    E-mail para Laudos <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setIsDirty(true);
                        setEmail(e.target.value);
                      }}
                      className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                    />
                    <span className="absolute right-3.5 top-3 text-secondary/60">
                      <span className="material-symbols-outlined" data-icon="mail">
                        mail
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contato de Emergência */}
              <div className="pt-2 border-t border-surface-container">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
                  Contato de Emergência &amp; Parentesco
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEmergencyContactName(e.target.value);
                    }}
                    placeholder="Nome do contato (Ex: Lucas Silveira)"
                    className="col-span-3 h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                  <select
                    value={emergencyContactRelation}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEmergencyContactRelation(e.target.value);
                    }}
                    className="col-span-2 h-12 px-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-label-lg text-label-lg focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
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
          </div>

          {/* 2. Histórico Ginecológico e Obstétrico */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(75,30,90,0.04)] border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" data-icon="pregnant_woman">
                  pregnant_woman
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Histórico Ginecológico &amp; Clínico
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Informações fundamentais para o acompanhamento
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Tipo Sanguíneo */}
              <div>
                <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
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
                          setIsDirty(true);
                          setBloodType(bt);
                        }}
                        className={`blood-chip h-10 rounded-xl font-label-md text-label-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'active border border-primary-container bg-primary-container text-on-primary-container shadow-sm font-bold'
                            : 'border border-outline-variant/40 bg-surface text-tertiary hover:bg-surface-container'
                        }`}
                      >
                        {bt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alergias */}
              <div>
                <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
                  Alergias Medicamentosas (Toque para selecionar)
                </span>
                <div className="flex flex-wrap gap-2" id="allergies-container">
                  {ALLERGY_OPTIONS.map((alg) => {
                    const isSelected = allergies.includes(alg);
                    return (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => handleToggleAllergy(alg)}
                        className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'border border-primary text-primary bg-primary-fixed font-semibold'
                            : 'border border-outline-variant/40 text-tertiary bg-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm" data-icon={isSelected ? 'check' : 'add'}>
                          {isSelected ? 'check' : 'add'}
                        </span>
                        {alg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GPA */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="block font-label-lg text-label-lg text-secondary font-bold mb-2">
                  Histórico Obstétrico (GPA)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center border border-outline-variant/30">
                    <span className="block font-label-sm text-label-sm text-tertiary">Gestações</span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <button
                        type="button"
                        aria-label="Diminuir gestações"
                        onClick={() => {
                          setIsDirty(true);
                          setGestations(Math.max(0, gestations - 1));
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary text-xs"
                      >
                        -
                      </button>
                      <span data-testid="gpa-gestations" className="font-headline-sm text-headline-sm font-bold text-primary">
                        {gestations}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar gestações"
                        onClick={() => {
                          setIsDirty(true);
                          setGestations(gestations + 1);
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center border border-outline-variant/30">
                    <span className="block font-label-sm text-label-sm text-tertiary">Partos</span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <button
                        type="button"
                        aria-label="Diminuir partos"
                        onClick={() => {
                          setIsDirty(true);
                          setBirths(Math.max(0, births - 1));
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-secondary text-xs"
                      >
                        -
                      </button>
                      <span data-testid="gpa-births" className="font-headline-sm text-headline-sm font-bold text-secondary">
                        {births}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar partos"
                        onClick={() => {
                          setIsDirty(true);
                          setBirths(births + 1);
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-secondary text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center border border-outline-variant/30">
                    <span className="block font-label-sm text-label-sm text-tertiary">Abortos</span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <button
                        type="button"
                        aria-label="Diminuir abortos"
                        onClick={() => {
                          setIsDirty(true);
                          setAbortions(Math.max(0, abortions - 1));
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-secondary text-xs"
                      >
                        -
                      </button>
                      <span data-testid="gpa-abortions" className="font-headline-sm text-headline-sm font-bold text-secondary">
                        {abortions}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar abortos"
                        onClick={() => {
                          setIsDirty(true);
                          setAbortions(abortions + 1);
                        }}
                        className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-secondary text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicamentos */}
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                  htmlFor="supplements"
                >
                  Medicamentos em Uso Contínuo ou Polivitamínicos
                </label>
                <input
                  id="supplements"
                  type="text"
                  value={continuousMeds}
                  onChange={(e) => {
                    setIsDirty(true);
                    setContinuousMeds(e.target.value);
                  }}
                  className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 3. Convênio ou Reembolso */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(75,30,90,0.04)] border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" data-icon="health_and_safety">
                  health_and_safety
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Convênio ou Reembolso
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Cobertura para consultas obstétricas e partos
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block font-label-md text-label-md text-on-surface-variant mb-2">
                  Operadora de Saúde
                </span>
                <div className="grid grid-cols-2 gap-2" id="insurance-picker">
                  {INSURANCE_OPTIONS.map((opt) => {
                    const isSelected = insuranceName === opt.label;
                    return (
                      <label
                        key={opt.id}
                        className={`cursor-pointer rounded-xl p-3 flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'border-2 border-primary-container bg-surface-container/50'
                            : 'border border-outline-variant/40 hover:bg-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="insurance"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => {
                            setIsDirty(true);
                            setInsuranceName(opt.label);
                          }}
                          className="text-primary focus:ring-primary-container"
                        />
                        <span
                          className={`font-label-lg text-label-lg text-on-surface ${
                            isSelected ? 'font-bold' : 'font-semibold'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Carteirinha e Plano */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="card-number"
                  >
                    Número da Carteirinha
                  </label>
                  <input
                    id="card-number"
                    type="text"
                    value={insuranceCardNumber}
                    onChange={(e) => {
                      setIsDirty(true);
                      setInsuranceCardNumber(e.target.value);
                    }}
                    className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                </div>
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-surface-variant mb-1.5"
                    htmlFor="plan-tier"
                  >
                    Plano / Categoria
                  </label>
                  <input
                    id="plan-tier"
                    type="text"
                    value={insurancePlanTier}
                    onChange={(e) => {
                      setIsDirty(true);
                      setInsurancePlanTier(e.target.value);
                    }}
                    className="w-full h-12 px-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Consentimento Médico CFM & LGPD */}
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex items-start gap-3">
            <div className="pt-0.5">
              <input
                id="consent-lgpd"
                type="checkbox"
                checked={consentLgpd}
                onChange={(e) => {
                  setIsDirty(true);
                  setConsentLgpd(e.target.checked);
                }}
                className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-outline-variant"
              />
            </div>
            <label
              className="cursor-pointer font-body-sm text-body-sm text-on-surface leading-snug"
              htmlFor="consent-lgpd"
            >
              Declaro a veracidade dos dados clínicos fornecidos e autorizo a <strong>Cana Med Mulher</strong> a armazenar e processar meu prontuário ginecológico e obstétrico em conformidade com as resoluções do CFM e a LGPD (Lei 13.709/18).
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full h-13 py-3.5 px-6 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-[0_4px_16px_rgba(216,37,124,0.25)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
            >
              <span>Concluir Cadastro</span>
              <span className="material-symbols-outlined" data-icon="check_circle">
                check_circle
              </span>
            </button>
            <button
              type="button"
              onClick={handleDraft}
              className="w-full h-12 py-3 px-6 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary font-label-lg text-label-lg font-semibold active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base" data-icon="save">
                save
              </span>
              <span>Salvar rascunho</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
