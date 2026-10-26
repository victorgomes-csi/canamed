import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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
  it('preserva os dados digitados no formulário durante os ciclos de polling da fila', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
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
          subjective: 'Relato inicial',
          objective: '',
          assessment: '',
          plan: '',
          createdAt: '2026-10-02T10:05:00Z',
          finalizedAt: null,
          addenda: [],
        },
        startedAt: '2026-10-02T10:05:00Z',
      },
      waitingQueue: [],
    });

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    const subjectiveInput = screen.getByPlaceholderText(/Relato dos sintomas pelo paciente/i);
    expect(subjectiveInput).toHaveValue('Relato inicial');

    // Usuário digita novas observações clínicas
    act(() => {
      fireEvent.change(subjectiveInput, {
        target: { value: 'Texto recém-digitado pela médica que não pode ser apagado!' },
      });
    });
    expect(subjectiveInput).toHaveValue('Texto recém-digitado pela médica que não pode ser apagado!');

    // Simula 10 segundos decorridos (momento em que o polling dispara em background)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(11000);
    });

    // O texto digitado DEVE permanecer íntegro e NÃO voltar para o estado inicial
    expect(subjectiveInput).toHaveValue('Texto recém-digitado pela médica que não pode ser apagado!');

    // Simula mais 20 segundos decorridos (múltiplos ciclos de polling)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20000);
    });
    expect(subjectiveInput).toHaveValue('Texto recém-digitado pela médica que não pode ser apagado!');

    vi.useRealTimers();
  });
  it('renderiza alerta de gestante Rh negativo quando a consulta ativa contiver patientRhFactor Negativo', async () => {
    mocks.apiGet.mockResolvedValueOnce({
      doctorId: 'doc-1',
      doctorName: 'Dr. Roberto Canamed',
      clinicId: 'clinic-1',
      activeConsultation: {
        queueEntryId: 'queue-99',
        patientId: 'patient-99',
        patientName: 'Juliana Rh Negativo',
        patientBirthDate: '1992-08-20',
        patientBloodType: 'O',
        patientRhFactor: 'Negativo',
        allergies: null,
        chronicConditions: null,
        healthPlanName: 'Particular',
        triage: null,
        medicalRecord: null,
        startedAt: new Date().toISOString(),
      },
      waitingQueue: [],
    });

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Juliana Rh Negativo/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Gestante Rh Negativo/i)).toBeInTheDocument();
    expect(screen.getByText(/Checar Coombs Indireto \/ Profilaxia Anti-D/i)).toBeInTheDocument();
  });

  it('abre DocumentModal com medicamentos preenchidos a partir de prescricoes anotadas no consultorio', async () => {
    mocks.apiGet.mockResolvedValue({
      doctorId: 'doc-1',
      doctorName: 'Dr. Roberto Canamed',
      clinicId: 'clinic-1',
      activeConsultation: {
        queueEntryId: 'queue-101',
        patientId: 'patient-101',
        patientName: 'Camila Prescricao Teste',
        patientBirthDate: '1995-05-15',
        patientBloodType: 'A',
        patientRhFactor: 'Positivo',
        allergies: null,
        chronicConditions: null,
        healthPlanName: 'Unimed',
        triage: null,
        medicalRecord: {
          id: 'record-101',
          clinicId: 'clinic-1',
          patientId: 'patient-101',
          doctorId: 'doc-1',
          doctorName: 'Dr. Roberto Canamed',
          status: 'draft',
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
          createdAt: '2026-10-26T10:00:00Z',
          finalizedAt: null,
          addenda: [],
        },
        startedAt: new Date().toISOString(),
      },
      waitingQueue: [],
    });

    render(
      <MemoryRouter>
        <DoctorWorkspace />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Camila Prescricao Teste/i)).toBeInTheDocument();
    });

    // Digita uma prescrição no editor
    const prescTextarea = screen.getByLabelText(/Prescrição Medicamentosa/i);
    fireEvent.change(prescTextarea, {
      target: { value: '1. Desogestrel 75mcg — Tomar 1 comprimido ao dia' },
    });

    // Clica no botão de emitir receita médica
    const emitBtn = screen.getByRole('button', { name: /Emitir Receita Médica/i });
    fireEvent.click(emitBtn);

    // O DocumentModal deve abrir com o medicamento pré-carregado
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Desogestrel 75mcg')).toBeInTheDocument();
  });
});
