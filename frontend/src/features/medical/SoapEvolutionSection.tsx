export interface SoapEvolutionSectionProps {
  subjective: string;
  onSubjectiveChange: (val: string) => void;
  objective: string;
  onObjectiveChange: (val: string) => void;
  assessment: string;
  onAssessmentChange: (val: string) => void;
  plan: string;
  onPlanChange: (val: string) => void;
  disabled?: boolean;
}

export const COMMON_DIAGNOSTIC_HYPOTHESES = [
  { id: 'z014', code: 'Z01.4', label: 'Rotina Ginecológica Anual', text: 'Z01.4 - Exame ginecológico geral de rotina (preventivo e rastreamento)' },
  { id: 'n946', code: 'N94.6', label: 'Dismenorreia / Dor Pélvica', text: 'N94.6 - Dismenorreia primária / dor pélvica crônica' },
  { id: 'n760', code: 'N76.0', label: 'Vaginite / Candidíase', text: 'N76.0 - Vaginite aguda / suspeita de vulvovaginite fúngica ou bacteriana' },
  { id: 'n920', code: 'N92.0', label: 'Sangramento Anormal (SUA)', text: 'N92.0 - Menorragia com ciclo regular / Sangramento Uterino Anormal (SUA)' },
  { id: 'e282', code: 'E28.2', label: 'Ovários Policísticos (SOP)', text: 'E28.2 - Síndrome dos ovários policísticos (SOP)' },
  { id: 'n951', code: 'N95.1', label: 'Climatério / Fogachos', text: 'N95.1 - Estados menopáusicos e climatéricos femininos' },
  { id: 'd25', code: 'D25', label: 'Miomatose Uterina', text: 'D25 - Leiomioma do útero / Miomatose uterina assintomática/sintomática' },
  { id: 'z340', code: 'Z34.0', label: 'Pré-natal Habitual', text: 'Z34.0 - Supervisão de primeira gravidez normal / Pré-natal habitual' },
  { id: 'z300', code: 'Z30.0', label: 'Aconselhamento Contraceptivo', text: 'Z30.0 - Aconselhamento geral e prescrição de anticoncepcional / DIU' },
];

export const COMMON_OBJECTIVE_SNIPPETS = [
  { id: 'beg', label: '+ BEG e Sinais Normais', text: 'Bom estado geral (BEG), lúcida e orientada, corada, hidratada, acianótica, anictérica. Sinais vitais normotensa e afebril.' },
  { id: 'abdome_ok', label: '+ Abdome Inalterado', text: 'Abdome plano, flácido, ruídos hidroaéreos presentes, indolor à palpação superficial e profunda, sem visceromegalias ou massas palpáveis.' },
  { id: 'mamas_ok', label: '+ Mamas Simétricas', text: 'Mamas simétricas, pele íntegra, sem retrações ou abaulamentos. Ausência de nódulos palpáveis ou descargas papilares anômalas.' },
];

export const COMMON_PLAN_SNIPPETS = [
  { id: 'prev', label: '+ Colhido Preventivo', text: 'Coletado citopatológico oncótico em base líquida/lâmina; aguardar laudo anatomopatológico.' },
  { id: 'usg_tv', label: '+ Solicitado USG-TV', text: 'Solicitada Ultrassonografia Transvaginal para avaliação morfológica do útero e anexos.' },
  { id: 'mamo', label: '+ Solicitada Mamografia', text: 'Solicitada Mamografia Digital Bilateral para rastreamento preventivo anual.' },
  { id: 'rotina_lab', label: '+ Exames Laboratoriais', text: 'Solicitados exames laboratoriais complementares (Hemograma, Glicemia, Lipidograma, Sorologias).' },
  { id: 'retorno_30d', label: '+ Retorno em 30d', text: 'Programado retorno em 30 a 45 dias com os resultados dos exames solicitados.' },
];

export function SoapEvolutionSection({
  subjective,
  onSubjectiveChange,
  objective,
  onObjectiveChange,
  assessment,
  onAssessmentChange,
  plan,
  onPlanChange,
  disabled = false,
}: SoapEvolutionSectionProps) {
  const appendText = (current: string, updater: (val: string) => void, snippet: string) => {
    if (disabled) return;
    const prefix = current && !current.endsWith('\n') && !current.endsWith(' ') ? '\n' : '';
    updater(`${current}${prefix}${snippet}`);
  };

  return (
    <div
      id="sec-soap"
      className="card soap-evolution-card"
      style={{
        border: '1px solid var(--color-neutral-border, #CBD5E1)',
        borderRadius: 'var(--radius-lg, 12px)',
        background: '#ffffff',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.3rem' }}>📝</span>
        <div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark, #005F6A)', margin: 0, fontWeight: 700 }}>
            Evolução Clínica Estruturada (SOAP) & Diagnósticos
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-neutral-muted, #64748B)' }}>
            Registro formal do atendimento conforme o padrão SOAP (CFM / S-RES) com atalhos de diagnóstico
          </span>
        </div>
      </div>

      {/* [S] Subjetivo */}
      <div className="form__group" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label htmlFor="soap-s" className="form__label" style={{ fontWeight: 700, color: 'var(--color-primary-dark, #005F6A)', margin: 0 }}>
            [S] Subjetivo — Síntese da Queixa & Relato da Paciente
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-primary, #008080)', fontWeight: 600 }}>
            Sincronizado automaticamente com a Queixa Principal e HMA
          </span>
        </div>
        <textarea
          id="soap-s"
          className="form__textarea"
          rows={3}
          placeholder="Relato dos sintomas pelo paciente, queixa principal, cronologia e impacto..."
          value={subjective}
          disabled={disabled}
          onChange={(e) => onSubjectiveChange(e.target.value)}
          style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
        />
      </div>

      {/* [O] Objetivo */}
      <div className="form__group" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label htmlFor="soap-o" className="form__label" style={{ fontWeight: 700, color: 'var(--color-primary-dark, #005F6A)', margin: 0 }}>
            [O] Objetivo — Exame Físico Geral & Sistêmico
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {COMMON_OBJECTIVE_SNIPPETS.map((snip) => (
              <button
                key={snip.id}
                type="button"
                disabled={disabled}
                onClick={() => appendText(objective, onObjectiveChange, snip.text)}
                className="hma-snippet-btn"
                style={{ fontSize: '0.73rem', padding: '0.2rem 0.45rem', borderRadius: '4px', background: '#F1F5F9', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                title={`Inserir: "${snip.text}"`}
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          id="soap-o"
          className="form__textarea"
          rows={3}
          placeholder="Achados gerais (ectoscopia, aparelhos cardiovascular e respiratório, dados vitais complementares)..."
          value={objective}
          disabled={disabled}
          onChange={(e) => onObjectiveChange(e.target.value)}
          style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
        />
      </div>

      {/* [A] Avaliação — Hipóteses Diagnósticas & CID-10 */}
      <div className="form__group" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label htmlFor="soap-a" className="form__label" style={{ fontWeight: 700, color: 'var(--color-primary-dark, #005F6A)', margin: 0 }}>
            [A] Avaliação — Hipóteses Diagnósticas & CID-10
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-muted, #64748B)' }}>
            Clique para inserir hipótese diagnóstica estruturada:
          </span>
        </div>

        {/* Chips de CIDs e Hipóteses Clínicas Frequentes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
          {COMMON_DIAGNOSTIC_HYPOTHESES.map((diag) => (
            <button
              key={diag.id}
              type="button"
              disabled={disabled}
              onClick={() => appendText(assessment, onAssessmentChange, diag.text)}
              className="complaint-chip"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: 'var(--color-primary-dark, #005F6A)',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              title={diag.text}
            >
              <strong style={{ color: 'var(--color-brand-primary, #008080)', marginRight: '0.25rem' }}>{diag.code}</strong>
              <span>{diag.label}</span>
            </button>
          ))}
        </div>

        <textarea
          id="soap-a"
          className="form__textarea"
          rows={3}
          placeholder="Hipóteses diagnósticas principais, diferenciais e CID-10 quando aplicável..."
          value={assessment}
          disabled={disabled}
          onChange={(e) => onAssessmentChange(e.target.value)}
          style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
        />
      </div>

      {/* [P] Plano — Conduta Clínica & Encaminhamentos */}
      <div className="form__group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label htmlFor="soap-p" className="form__label" style={{ fontWeight: 700, color: 'var(--color-primary-dark, #005F6A)', margin: 0 }}>
            [P] Plano — Conduta Clínica, Exames & Encaminhamentos
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {COMMON_PLAN_SNIPPETS.map((snip) => (
              <button
                key={snip.id}
                type="button"
                disabled={disabled}
                onClick={() => appendText(plan, onPlanChange, snip.text)}
                className="hma-snippet-btn"
                style={{ fontSize: '0.73rem', padding: '0.2rem 0.45rem', borderRadius: '4px', background: '#F1F5F9', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                title={`Inserir: "${snip.text}"`}
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          id="soap-p"
          className="form__textarea"
          rows={3}
          placeholder="Conduta clínica, solicitação de exames complementares, retornos programados e orientações..."
          value={plan}
          disabled={disabled}
          onChange={(e) => onPlanChange(e.target.value)}
          style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
        />
      </div>
    </div>
  );
}
