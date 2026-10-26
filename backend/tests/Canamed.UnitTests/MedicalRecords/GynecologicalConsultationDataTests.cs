using Canamed.Domain.MedicalRecords;
using Xunit;

namespace Canamed.UnitTests.MedicalRecords;

public sealed class GynecologicalConsultationDataTests
{
    private readonly DateTimeOffset _now = DateTimeOffset.UtcNow;
    private readonly Guid _recordId = Guid.NewGuid();

    [Fact]
    public void Create_InitializesSegmentsAsNotEvaluated_WithoutSilentlyDefaultingToNormal()
    {
        var data = GynecologicalConsultationData.Create(_recordId, _now);

        Assert.Null(data.BreastsStatus);
        Assert.Null(data.AbdomenStatus);
        Assert.Null(data.ExternalGenitaliaStatus);
        Assert.Null(data.SpeculumExamStatus);
        Assert.Null(data.BimanualPalpationStatus);

        Assert.False(data.BreastsIsNormal);
        Assert.False(data.AbdomenIsNormal);
        Assert.False(data.ExternalGenitaliaIsNormal);
        Assert.False(data.SpeculumExamIsNormal);
        Assert.False(data.BimanualPalpationIsNormal);
    }

    [Fact]
    public void Update_WithAbnormalSegmentAndEmptyFindings_ThrowsArgumentException()
    {
        var data = GynecologicalConsultationData.Create(_recordId, _now);

        var ex = Assert.Throws<ArgumentException>(() =>
            data.UpdateTriState(
                dum: null,
                isDumUncertain: false,
                isMenopausal: false,
                chiefComplaint: "Dor pélvica",
                hma: "Dor há 2 semanas",
                isSexuallyActive: true,
                dyspareunia: "ausente",
                breastsStatus: "Abnormal",
                breastsFindings: null,
                abdomenStatus: "Normal",
                abdomenFindings: null,
                externalGenitaliaStatus: "Normal",
                externalGenitaliaFindings: null,
                speculumExamStatus: "Normal",
                speculumExamFindings: null,
                bimanualPalpationStatus: "Normal",
                bimanualPalpationFindings: null,
                procedurePerformed: null,
                procedureBatch: null,
                procedureNotes: null,
                diagnosesJson: null,
                prescriptionNotes: null,
                generalOrientationNotes: null,
                _now));

        Assert.Contains("Por favor, detalhe as alterações encontradas no segmento marcado como alterado.", ex.Message);
    }

    [Fact]
    public void Update_WithAbnormalSegmentAndValidFindings_PersistsFindingsCorrectly()
    {
        var data = GynecologicalConsultationData.Create(_recordId, _now);

        data.UpdateTriState(
            dum: null,
            isDumUncertain: false,
            isMenopausal: false,
            chiefComplaint: "Rotina",
            hma: "Assintomática",
            isSexuallyActive: true,
            dyspareunia: "ausente",
            breastsStatus: "Abnormal",
            breastsFindings: "Nódulo palpável em QSE de mama direita",
            abdomenStatus: "Normal",
            abdomenFindings: null,
            externalGenitaliaStatus: "Normal",
            externalGenitaliaFindings: null,
            speculumExamStatus: "Normal",
            speculumExamFindings: null,
            bimanualPalpationStatus: "Normal",
            bimanualPalpationFindings: null,
            procedurePerformed: null,
            procedureBatch: null,
            procedureNotes: null,
            diagnosesJson: null,
            prescriptionNotes: null,
            generalOrientationNotes: null,
            _now);

        Assert.Equal("Abnormal", data.BreastsStatus);
        Assert.Equal("Nódulo palpável em QSE de mama direita", data.BreastsFindings);
        Assert.Equal("Normal", data.AbdomenStatus);
        Assert.Null(data.AbdomenFindings);
    }
}
