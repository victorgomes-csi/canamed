import React, { useState } from 'react';
import '../patient-serene.css';
import { formatCpf, formatPhone, isValidCpf } from '../../../utils/masks';
import { BookGuestResponse, patientApi } from '../patientApi';

export interface GuestBookingFormPageProps {
  clinicId?: string;
  professionalId?: string;
  doctorName?: string;
  doctorCrm?: string;
  price?: string;
  estimatedWait?: string;
  selectedStartsAt?: string;
  initialSymptoms?: string;
  onBack?: () => void;
  onSuccess?: (response: BookGuestResponse) => void;
}

export const GuestBookingFormPage: React.FC<GuestBookingFormPageProps> = ({
  clinicId = '00000000-0000-0000-0000-000000000001',
  professionalId = '00000000-0000-0000-0000-000000000002',
  doctorName = 'Dra. Beatriz Faria',
  doctorCrm = 'CRM-SP 184.220 • Ginecologista',
  price = 'R$ 290,00',
  estimatedWait = 'Em ~20 minutos',
  selectedStartsAt,
  initialSymptoms = '',
  onBack,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [allergy, setAllergy] = useState<'Nenhuma' | 'Dipirona' | 'AINEs'>('Nenhuma');
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [wantsInvoice, setWantsInvoice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    if (formatted.length === 14) {
      setCpfError(isValidCpf(formatted) ? null : 'CPF inválido. Verifique os dígitos digitados.');
    } else {
      setCpfError(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      setGeneralError('Informe o nome completo da paciente.');
      return;
    }

    if (!cpf || !isValidCpf(cpf)) {
      setCpfError('CPF inválido. Verifique o número informado.');
      return;
    }

    if (!birthDate) {
      setGeneralError('Informe a data de nascimento para prescrição CFM.');
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setGeneralError('Informe um WhatsApp válido com DDD.');
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const startsAt = selectedStartsAt || new Date(Date.now() + 20 * 60 * 1000).toISOString();
      const response = await patientApi.bookGuestAppointment({
        clinicId,
        professionalId,
        startsAt,
        patientName: fullName.trim(),
        cpf: cpf.trim(),
        phone: phone.trim(),
        birthDate,
        symptoms: symptoms.trim() || undefined,
        allergies: allergy === 'Nenhuma' ? undefined : allergy,
        isPregnant,
        wantsInvoice,
      });

      onSuccess?.(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao concluir agendamento avulso.';
      setGeneralError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="serene-page relative min-h-screen flex flex-col justify-between selection:bg-[var(--color-serene-surface-low)] selection:text-[var(--color-serene-primary-text)]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-serene-surface)]/95 backdrop-blur-md px-4 py-3 border-b border-[var(--color-serene-outline-variant)] flex items-center justify-between max-w-md mx-auto w-full shadow-sm">
        <div className="flex items-center gap-2">
          <button
            aria-label="Voltar"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-serene-secondary)] hover:bg-[var(--color-serene-surface-low)] transition-colors"
            type="button"
            onClick={onBack}
          >
            <span className="material-symbols-outlined text-[22px]" data-icon="arrow_back">
              arrow_back
            </span>
          </button>
          <div>
            <h1 className="text-base font-bold text-[var(--color-serene-text-main)] tracking-tight">
              Cadastro Rápido
            </h1>
            <p className="text-xs text-[var(--color-serene-text-muted)]">Plantão Imediato Ginecologia</p>
          </div>
        </div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-serene-surface-low)] border border-[var(--color-serene-outline-variant)] text-[var(--color-serene-secondary)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-serene-primary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-serene-primary)]" />
          </span>
          <span className="text-[11px] font-bold tracking-wide">Plantão Ativo</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-3 pb-32 space-y-4">
        {/* Welcoming Informative Banner */}
        <div className="rounded-2xl bg-[var(--color-serene-surface-low)] border border-[var(--color-serene-outline-variant)] p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-serene-primary)]/10 flex items-center justify-center text-[var(--color-serene-primary-text)] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-lg" data-icon="verified_user">
              verified_user
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-serene-text-main)]">Dados clínicos essenciais</p>
            <p className="text-xs text-[var(--color-serene-text-muted)] mt-0.5 leading-relaxed">
              Necessários pelo CFM para emissão da sua receita com QR Code, atestado e entrada no plantão em menos de 2 minutos.
            </p>
          </div>
        </div>

        {/* 1. Resumo do Plantão Selecionado */}
        <section className="serene-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-serene-outline-variant)]/40 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)] font-bold text-base border border-[var(--color-serene-outline-variant)]">
                {doctorName.replace('Dra. ', '').charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[var(--color-serene-text-main)]">{doctorName}</span>
                  <span className="material-symbols-outlined text-[var(--color-serene-primary-text)] text-sm" data-icon="check_circle">
                    check_circle
                  </span>
                </div>
                <p className="text-xs text-[var(--color-serene-text-muted)]">{doctorCrm}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-serene-surface-low)] text-[var(--color-serene-secondary)]">
                Online agora
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-serene-surface-low)]">
              <span className="material-symbols-outlined text-[var(--color-serene-primary)] text-lg" data-icon="schedule">
                schedule
              </span>
              <div>
                <p className="text-[10px] text-[var(--color-serene-text-muted)] leading-none">Previsão</p>
                <p className="text-xs text-[var(--color-serene-text-main)] mt-0.5 font-bold">{estimatedWait}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-serene-surface-low)]">
              <span className="material-symbols-outlined text-[var(--color-serene-secondary)] text-lg" data-icon="receipt_long">
                receipt_long
              </span>
              <div>
                <p className="text-[10px] text-[var(--color-serene-text-muted)] leading-none">Valor Total</p>
                <p className="text-xs text-[var(--color-serene-primary-text)] mt-0.5 font-bold">
                  {price} <span className="text-[10px] font-normal text-[var(--color-serene-text-muted)]">(c/ NF)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Formulário Interativo */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados Obrigatórios para Prescrição (CFM) */}
          <section className="serene-card p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined text-[16px]" data-icon="badge">
                  badge
                </span>
              </div>
              <h2 className="text-sm font-bold text-[var(--color-serene-text-main)]">
                Dados da Paciente para Prontuário
              </h2>
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1" htmlFor="guest-full-name">
                Nome Completo da Paciente <span className="text-[var(--color-serene-primary-text)]">*</span>
              </label>
              <input
                id="guest-full-name"
                type="text"
                required
                className="serene-input text-xs"
                placeholder="Ex: Mariana Silveira Rocha"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* CPF */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1" htmlFor="guest-cpf">
                  CPF (Obrigatório CFM) <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="guest-cpf"
                  type="text"
                  required
                  className={`serene-input text-xs ${cpfError ? 'border-red-500 focus:border-red-600' : ''}`}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                />
                {cpfError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{cpfError}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1" htmlFor="guest-birthdate">
                  Data de Nascimento <span className="text-[var(--color-serene-primary-text)]">*</span>
                </label>
                <input
                  id="guest-birthdate"
                  type="date"
                  required
                  className="serene-input text-xs"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1" htmlFor="guest-phone">
                WhatsApp para Receitas & Acesso <span className="text-[var(--color-serene-primary-text)]">*</span>
              </label>
              <input
                id="guest-phone"
                type="tel"
                required
                className="serene-input text-xs"
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={handlePhoneChange}
              />
              <span className="text-[11px] text-[var(--color-serene-text-muted)] mt-1 block">
                O link da videochamada chegará instantaneamente por SMS e WhatsApp.
              </span>
            </div>
          </section>

          {/* 3. Triagem Rápida de Segurança */}
          <section className="serene-card p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[var(--color-serene-surface-low)] flex items-center justify-center text-[var(--color-serene-primary-text)]">
                <span className="material-symbols-outlined text-[16px]" data-icon="medical_services">
                  medical_services
                </span>
              </div>
              <h2 className="text-sm font-bold text-[var(--color-serene-text-main)]">
                Triagem Rápida de Segurança
              </h2>
            </div>

            {/* Alergias */}
            <div>
              <span className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5">
                Possui alergia medicamentosa comum?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Nenhuma', 'Dipirona', 'AINEs'] as const).map((opt) => (
                  <label key={opt} className="cursor-pointer">
                    <input
                      type="radio"
                      name="allergy"
                      value={opt}
                      checked={allergy === opt}
                      onChange={() => setAllergy(opt)}
                      className="sr-only peer"
                      aria-label={`Alergia ${opt}`}
                    />
                    <div className="px-2 py-2 text-center rounded-xl border border-[var(--color-serene-outline-variant)] peer-checked:border-[var(--color-serene-primary)] peer-checked:bg-[var(--color-serene-surface-low)] peer-checked:text-[var(--color-serene-primary-text)] text-xs font-semibold text-[var(--color-serene-text-muted)] transition-all">
                      {opt}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Gestante? */}
            <div>
              <span className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1.5">
                Você está gestante no momento?
              </span>
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="pregnant"
                    checked={!isPregnant}
                    onChange={() => setIsPregnant(false)}
                    className="sr-only peer"
                    aria-label="Não gestante"
                  />
                  <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[var(--color-serene-outline-variant)] peer-checked:border-[var(--color-serene-primary)] peer-checked:bg-[var(--color-serene-surface-low)] peer-checked:text-[var(--color-serene-primary-text)] text-xs font-semibold text-[var(--color-serene-text-muted)] transition-all">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Não</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="pregnant"
                    checked={isPregnant}
                    onChange={() => setIsPregnant(true)}
                    className="sr-only peer"
                    aria-label="Sim, gestante"
                  />
                  <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[var(--color-serene-outline-variant)] peer-checked:border-[var(--color-serene-primary)] peer-checked:bg-[var(--color-serene-surface-low)] peer-checked:text-[var(--color-serene-primary-text)] text-xs font-semibold text-[var(--color-serene-text-muted)] transition-all">
                    <span className="material-symbols-outlined text-[16px]">pregnant_woman</span>
                    <span>Sim</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Sintoma Curto */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-serene-text-main)] mb-1" htmlFor="guest-symptoms">
                O que você está sentindo agora? <span className="text-[var(--color-serene-text-muted)] font-normal">(breve)</span>
              </label>
              <textarea
                id="guest-symptoms"
                rows={2}
                className="serene-input text-xs resize-none"
                placeholder="Ex: Dor pélvica súbita, cólica intensa, sangramento incomum..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </section>

          {/* 4. Dados para Nota Fiscal / Reembolso */}
          <section className="serene-card p-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wantsInvoice}
                onChange={(e) => setWantsInvoice(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[var(--color-serene-outline-variant)] text-[var(--color-serene-primary)] focus:ring-[var(--color-serene-primary)]/20"
                aria-label="Emitir Nota Fiscal para o mesmo CPF da paciente"
              />
              <div>
                <p className="text-xs font-bold text-[var(--color-serene-text-main)]">
                  Emitir Nota Fiscal para o mesmo CPF da paciente
                </p>
                <p className="text-[11px] text-[var(--color-serene-text-muted)] mt-0.5">
                  Ideal para solicitar reembolso integral ou parcial no seu plano de saúde (Bradesco, SulAmérica, Amil, etc.).
                </p>
              </div>
            </label>
          </section>

          {generalError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {generalError}
            </div>
          )}
        </form>
      </main>

      {/* 5. Fixed Base Action Section (Desempilhamento: sem Bottom Navigation duplicada) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--color-serene-outline-variant)] px-4 py-3 max-w-md mx-auto shadow-lg">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="serene-btn-primary w-full text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-2 font-bold active:scale-[0.98] disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Confirmando...' : 'Confirmar e Entrar na Sala Virtual'}</span>
          <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">
            arrow_forward
          </span>
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-[var(--color-serene-text-muted)]">
          <span className="material-symbols-outlined text-[14px] text-[var(--color-serene-primary-text)]" data-icon="lock">
            lock
          </span>
          <span className="text-[11px] tracking-tight">Ambiente médico criptografado • Resolução CFM & LGPD</span>
        </div>
      </div>
    </div>
  );
};
