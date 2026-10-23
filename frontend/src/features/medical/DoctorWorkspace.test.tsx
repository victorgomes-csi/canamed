import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DoctorWorkspace } from './DoctorWorkspace';

const mocks = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  ApiError: class ApiError extends Error {
    public readonly status: number;
    public readonly detail: string | undefined;
    public readonly extensions: Record<string, unknown> = {};

    public constructor(status: number, title: string) {
      super(title);
      this.status = status;
      this.detail = title;
    }
  },
  apiGet: mocks.apiGet,
  apiPost: mocks.apiPost,
  apiPut: mocks.apiPut,
}));

describe('DoctorWorkspace Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe mensagem quando a fila esta vazia e nao ha atendimento ativo', async () => {
    mocks.apiGet.mockResolvedValueOnce({
      doctorId: 'doc-1',
      doctorName: 'Dr. Roberto Canamed',
      clinicId: 'clinic-1',
      activeConsultation: null,
      waitingQueue: [],
    });

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByText('Carregando consultório virtual…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Meu Consultório Virtual')).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Roberto Canamed/i)).toBeInTheDocument();
      expect(screen.getByText('Nenhum paciente aguardando no momento.')).toBeInTheDocument();
      expect(screen.getByText('Nenhum paciente em atendimento no momento')).toBeInTheDocument();
    });
  });

  it('renderiza atendimento ativo com dados do paciente, alerta de alergias e editor SOAP', async () => {
    mocks.apiGet.mockResolvedValueOnce({
      doctorId: 'doc-1',
      doctorName: 'Dr. Roberto Canamed',
      clinicId: 'clinic-1',
      activeConsultation: {
        queueEntryId: 'queue-10',
        patientId: 'patient-5',
        patientName: 'Maria Francisca da Silva',
        patientBirthDate: '1985-04-12',
        allergies: 'Dipirona e Anti-inflamatórios Não Esteroidais (AINEs)',
        chronicConditions: 'Hipertensão Arterial Sistêmica',
        healthPlanName: 'Bradesco Saúde',
        triage: {
          id: 'triage-1',
          clinicId: 'clinic-1',
          queueEntryId: 'queue-10',
          riskClassification: 'amarelo',
          bloodPressure: '140x90',
          heartRate: 88,
          temperature: 36.8,
          oxygenSaturation: 98,
          chiefComplaint: 'Cefaleia pulsátil há 2 dias',
          triageNotes: 'Paciente lúcida e orientada',
          evaluatedAt: '2026-10-02T10:00:00Z',
          evaluatedByUserId: 'user-triage',
          operatorName: 'Enf. Juliana',
        },
        medicalRecord: {
          id: 'rec-1',
          clinicId: 'clinic-1',
          patientId: 'patient-5',
          doctorId: 'doc-1',
          doctorName: 'Dr. Roberto Canamed',
          status: 'draft',
          subjective: 'Paciente relata cefaleia frontal.',
          objective: 'PA 140x90 mmHg, sem sinais focais.',
          assessment: 'Cefaleia tensional.',
          plan: 'Prescrito analgésico e repouso.',
          createdAt: '2026-10-02T10:05:00Z',
          finalizedAt: null,
          addenda: [],
        },
        startedAt: '2026-10-02T10:05:00Z',
      },
      waitingQueue: [
        {
          queueEntryId: 'queue-11',
          patientId: 'patient-6',
          patientName: 'José Carlos',
          priority: 'preferencial',
          status: 'aguardando',
          riskClassification: 'laranja',
          waitingTimeMinutes: 12,
          arrivedAt: '2026-10-02T10:15:00Z',
        },
      ],
    });

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Paciente na fila
      expect(screen.getByText('José Carlos')).toBeInTheDocument();
      expect(screen.getByText(/Preferencial/i)).toBeInTheDocument();

      // Atendimento ativo
      expect(screen.getByRole('heading', { level: 2, name: 'Maria Francisca da Silva' })).toBeInTheDocument();

      // Alerta de alergia em destaque
      expect(screen.getByText(/ALERTA DE ALERGIA DECLARADA/i)).toBeInTheDocument();

      // Sinais vitais da triagem
      expect(screen.getByText('140x90')).toBeInTheDocument();
      expect(screen.getByText('88 bpm')).toBeInTheDocument();

      // Seções do SOAP preenchidas
      const subjectiveTextarea = screen.getByPlaceholderText(/Relato dos sintomas pelo paciente/i);
      expect(subjectiveTextarea).toHaveValue('Paciente relata cefaleia frontal.');

      // Botões de ação clínica
      expect(screen.getByText(/Receita \/ Documento/i)).toBeInTheDocument();
      expect(screen.getByText(/Histórico do Paciente/i)).toBeInTheDocument();
      expect(screen.getByText('Salvar Rascunho')).toBeInTheDocument();
      expect(screen.getByText(/Finalizar Atendimento Clínico/i)).toBeInTheDocument();

      // Seções ginecológicas especializadas (SPEC-0027)
      expect(screen.getByText(/Anamnese & Ciclo/i)).toBeInTheDocument();
      expect(screen.getByText(/Anamnese Ginecológica Integrada/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Queixa Principal/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Exame Físico Ginecológico/i)).toBeInTheDocument();
      expect(screen.getByText(/Procedimentos \(DIU\/Biópsia\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Prescrições & Orientações/i)).toBeInTheDocument();
      expect(screen.getByText(/Exame das Mamas/i)).toBeInTheDocument();
      expect(screen.getByText(/Genitália Externa/i)).toBeInTheDocument();
      expect(screen.getByText(/Exame Especular/i)).toBeInTheDocument();
      expect(screen.getByText(/Toque Bimanual/i)).toBeInTheDocument();
    });
  });

  it('abre o modal de confirmação acessível e finaliza o atendimento clínico', async () => {
    mocks.apiGet.mockResolvedValue({
      doctorId: 'doc-1',
      doctorName: 'Dr. Roberto Canamed',
      clinicId: 'clinic-1',
      activeConsultation: {
        queueEntryId: '00000000-0000-0000-0000-000000000010',
        patientId: '00000000-0000-0000-0000-000000000005',
        patientName: 'Maria Francisca da Silva',
        medicalRecord: {
          id: '00000000-0000-0000-0000-000000000001',
          clinicId: 'clinic-1',
          patientId: '00000000-0000-0000-0000-000000000005',
          doctorId: 'doc-1',
          doctorName: 'Dr. Roberto Canamed',
          status: 'draft',
          subjective: 'Queixa de dor pélvica.',
          objective: 'Exame ginecológico normal.',
          assessment: 'Dismenorreia primária.',
          plan: 'Prescrição de AINE.',
          createdAt: '2026-10-02T10:05:00Z',
          finalizedAt: null,
          addenda: [],
        },
        startedAt: '2026-10-02T10:05:00Z',
      },
      waitingQueue: [],
    });
    mocks.apiPut.mockResolvedValue({});
    mocks.apiPost.mockResolvedValue({});

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    // Espera carregar os dados
    await waitFor(() => {
      expect(screen.getByText('✓ Finalizar Atendimento Clínico')).toBeInTheDocument();
    });

    // Clica no botão de finalizar
    const finishBtn = screen.getByText('✓ Finalizar Atendimento Clínico');
    fireEvent.click(finishBtn);

    // Modal acessível deve ser exibido com alerta do CFM e da Lei 13.787
    expect(screen.getByText(/Encerramento oficial da consulta e guarda legal do prontuário/i)).toBeInTheDocument();
    expect(screen.getByText('✓ Sim, Finalizar Prontuário')).toBeInTheDocument();

    // Clica para confirmar a finalização
    const confirmBtn = screen.getByText('✓ Sim, Finalizar Prontuário');
    fireEvent.click(confirmBtn);

    // Deve chamar a finalização
    await waitFor(() => {
      expect(mocks.apiPost).toHaveBeenCalledWith(
        '/doctor-workspace/finish-consultation',
        expect.objectContaining({
          medicalRecordId: '00000000-0000-0000-0000-000000000001',
        })
      );
    });
  });
});
