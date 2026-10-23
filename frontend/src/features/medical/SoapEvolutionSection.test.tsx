import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SoapEvolutionSection } from './SoapEvolutionSection';

describe('SoapEvolutionSection', () => {
  it('renderiza os 4 campos do SOAP e os chips de hipóteses diagnósticas', () => {
    render(
      <SoapEvolutionSection
        subjective=""
        onSubjectiveChange={vi.fn()}
        objective=""
        onObjectiveChange={vi.fn()}
        assessment=""
        onAssessmentChange={vi.fn()}
        plan=""
        onPlanChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Evolução Clínica Estruturada \(SOAP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\[S\] Subjetivo/i)).toBeInTheDocument();
    expect(screen.getByText(/\[O\] Objetivo/i)).toBeInTheDocument();
    expect(screen.getByText(/\[A\] Avaliação/i)).toBeInTheDocument();
    expect(screen.getByText(/\[P\] Plano/i)).toBeInTheDocument();
    expect(screen.getByText('Rotina Ginecológica Anual')).toBeInTheDocument();
  });

  it('insere a hipótese diagnóstica com CID-10 no campo de Avaliação ao clicar no chip', () => {
    const handleAssessmentChange = vi.fn();
    render(
      <SoapEvolutionSection
        subjective=""
        onSubjectiveChange={vi.fn()}
        objective=""
        onObjectiveChange={vi.fn()}
        assessment=""
        onAssessmentChange={handleAssessmentChange}
        plan=""
        onPlanChange={vi.fn()}
      />
    );

    const chipRotina = screen.getByText('Rotina Ginecológica Anual');
    fireEvent.click(chipRotina);

    expect(handleAssessmentChange).toHaveBeenCalledWith(
      expect.stringContaining('Z01.4 - Exame ginecológico geral de rotina')
    );
  });
});
