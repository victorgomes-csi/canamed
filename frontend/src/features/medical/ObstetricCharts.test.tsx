import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AtalahWeightGainChart } from './AtalahWeightGainChart';
import { UterineHeightChart } from './UterineHeightChart';
import type { PrenatalVisitDto } from './medicalRecordsApi';

describe('ObstetricCharts Components (Atalah & Altura Uterina)', () => {
  const mockVisits: PrenatalVisitDto[] = [
    {
      id: 'v1',
      clinicId: 'c1',
      patientId: 'p1',
      medicalRecordId: 'm1',
      visitDate: '2026-01-10',
      gestationalAgeWeeks: 12,
      gestationalAgeDays: 0,
      weightKg: 60.5,
      bmi: 22.8,
      bloodPressure: '110/70',
      uterineHeightCm: 12,
      fetalHeartRateBpm: 155,
      fetalMovementPresent: true,
      fetalPresentation: 'cefalico',
      clinicalNotes: 'Rotina de 1º trimestre',
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'v2',
      clinicId: 'c1',
      patientId: 'p1',
      medicalRecordId: 'm2',
      visitDate: '2026-03-10',
      gestationalAgeWeeks: 20,
      gestationalAgeDays: 0,
      weightKg: 64.0,
      bmi: 24.1,
      bloodPressure: '115/75',
      uterineHeightCm: 20,
      fetalHeartRateBpm: 148,
      fetalMovementPresent: true,
      fetalPresentation: 'cefalico',
      clinicalNotes: 'USG morfológico normal',
      createdAt: '2026-03-10T10:00:00Z',
    },
  ];

  it('renderiza o gráfico da Curva de Atalah com as faixas de normalidade de IMC gestacional', () => {
    render(<AtalahWeightGainChart visits={mockVisits} />);

    expect(screen.getByText(/Curva de Ganho de Peso Gestacional/i)).toBeInTheDocument();
    expect(screen.getByText(/Baixo Peso/i)).toBeInTheDocument();
    expect(screen.getByText(/Adequado/i)).toBeInTheDocument();
    expect(screen.getByText(/Sobrepeso/i)).toBeInTheDocument();
    expect(screen.getByText(/Obesidade/i)).toBeInTheDocument();
  });

  it('renderiza o gráfico da Curva de Altura Uterina com percentis P10 e P90', () => {
    render(<UterineHeightChart visits={mockVisits} />);

    expect(screen.getByText(/Curva de Altura Uterina \(P10 a P90 - FEBRASGO\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Percentil 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Percentil 90/i)).toBeInTheDocument();
  });
});
