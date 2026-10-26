using Canamed.Application.MedicalRecords.Services;
using Canamed.Domain.Agenda;
using Canamed.Domain.MedicalRecords;
using System.Text;
using Xunit;

namespace Canamed.UnitTests.MedicalRecords;

public sealed class PrenatalCardPdfGeneratorTests
{
    [Fact]
    public void Generate_DeveRetornarBytesValidosDePdfComCabecalhoEPaciente()
    {
        var clinicId = Guid.NewGuid();
        var patient = Patient.Create(
            clinicId,
            "Maria Eduarda Souza",
            "81999998888",
            DateTimeOffset.UtcNow,
            birthDate: new DateOnly(1996, 4, 15),
            bloodType: "O",
            rhFactor: "Negativo");

        var visits = new List<PrenatalVisitRecord>
        {
            PrenatalVisitRecord.Create(
                clinicId,
                patient.Id,
                Guid.NewGuid(),
                new DateOnly(2026, 8, 10),
                12,
                3,
                62.5,
                "110/70",
                12.0,
                150,
                true,
                "Ausente",
                "Cefalica",
                "Paciente assintomatica",
                DateTimeOffset.UtcNow)
        };

        var pdfBytes = PrenatalCardPdfGenerator.Generate(patient, null, visits);

        Assert.NotNull(pdfBytes);
        Assert.NotEmpty(pdfBytes);

        var pdfString = Encoding.Latin1.GetString(pdfBytes);
        Assert.StartsWith("%PDF-1.4", pdfString);
        Assert.Contains("CARTAO DA GESTANTE", pdfString);
        Assert.Contains("Maria Eduarda Souza", pdfString);
        Assert.Contains("12s 3d", pdfString);
        Assert.Contains("110/70", pdfString);
        Assert.Contains("FEBRASGO", pdfString);
    }
    [Fact]
    public void Generate_ComMaisDe10Consultas_GeraColunaApresentacaoFetalEPaginacao()
    {
        var clinicId = Guid.NewGuid();
        var patient = Patient.Create(
            clinicId,
            "Juliana Paes Gestante",
            "81999997777",
            DateTimeOffset.UtcNow,
            birthDate: new DateOnly(1994, 2, 20),
            bloodType: "A",
            rhFactor: "Positivo");

        var visits = new List<PrenatalVisitRecord>();
        for (int i = 1; i <= 15; i++)
        {
            visits.Add(PrenatalVisitRecord.Create(
                clinicId,
                patient.Id,
                Guid.NewGuid(),
                new DateOnly(2026, 1, 1).AddDays(i * 14),
                10 + (i * 2),
                0,
                60.0 + i,
                "120/80",
                10.0 + i,
                140 + (i % 10),
                true,
                "Ausente",
                i >= 12 ? "Cefalica" : "Pelvica",
                $"Consulta {i} de rotina",
                DateTimeOffset.UtcNow));
        }

        var pdfBytes = PrenatalCardPdfGenerator.Generate(patient, null, visits);
        var pdfString = Encoding.Latin1.GetString(pdfBytes);

        // Deve conter cabeçalho da coluna de Apresentação Fetal
        Assert.Contains("Apres. Fetal", pdfString);
        Assert.Contains("Cefalica", pdfString);
        Assert.Contains("Pelvica", pdfString);

        // Com 15 consultas, deve gerar paginação multifolha (/Count 2)
        Assert.Contains("/Count 2", pdfString);
    }
}
