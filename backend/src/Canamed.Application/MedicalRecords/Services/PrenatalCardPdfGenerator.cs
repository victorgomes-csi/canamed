using Canamed.Domain.Agenda;
using Canamed.Domain.MedicalRecords;
using System.Globalization;
using System.Text;

namespace Canamed.Application.MedicalRecords.Services;

/// <summary>
/// Gerador de Cartão da Gestante em formato PDF segundo as diretrizes da FEBRASGO / Ministério da Saúde (RN-007).
/// Suporta paginação multifolha para históricos longos e coluna de Apresentação Fetal.
/// </summary>
public static class PrenatalCardPdfGenerator
{
    private const int VisitsPerPage = 10;

    public static byte[] Generate(
        Patient patient,
        GynecologicalProfile? gynProfile,
        IReadOnlyList<PrenatalVisitRecord> visits,
        string clinicName = "CANA MED MULHER")
    {
        ArgumentNullException.ThrowIfNull(patient);
        visits ??= [];

        int pageCount = visits.Count == 0 ? 1 : (int)Math.Ceiling(visits.Count / (double)VisitsPerPage);
        var pageStreams = new List<byte[]>();

        for (int pageIndex = 0; pageIndex < pageCount; pageIndex++)
        {
            var pageVisits = visits.Skip(pageIndex * VisitsPerPage).Take(VisitsPerPage).ToList();
            var sb = new StringBuilder();
            sb.Append("BT\n");
            sb.Append("50 800 Td\n");

            if (pageIndex == 0)
            {
                // Cabeçalho Principal (Página 1)
                sb.Append("/F2 16 Tf\n");
                sb.Append("0.000 0.373 0.416 rg\n"); // #005F6A (petróleo Cana Med)
                sb.Append("(").Append(EscapePdf(SanitizeText(clinicName))).Append(") Tj\n");

                sb.Append("0 -18 Td\n");
                sb.Append("/F2 12 Tf\n");
                sb.Append("0.000 0.502 0.502 rg\n"); // #008080 (teal Cana Med)
                sb.Append("(CARTAO DA GESTANTE - ACOMPANHAMENTO PRE-NATAL) Tj\n");

                // Linha divisória
                sb.Append("0 -12 Td\n");
                sb.Append("/F1 8 Tf\n");
                sb.Append("0.7 0.7 0.7 rg\n");
                sb.Append("_________________________________________________________________________________ Tj\n");

                // Dados da Paciente e Identificação Obstétrica
                sb.Append("0 -20 Td\n");
                sb.Append("/F2 10 Tf\n");
                sb.Append("0.125 0.149 0.192 rg\n"); // #202631 (texto escuro)
                sb.Append("(DADOS DA GESTANTE) Tj\n");

                sb.Append("0 -14 Td\n");
                sb.Append("/F1 9 Tf\n");
                sb.Append("0.2 0.2 0.2 rg\n");
                sb.Append("(Nome: ").Append(EscapePdf(SanitizeText(patient.Name))).Append(") Tj\n");

                var birthStr = patient.BirthDate?.ToString("dd/MM/yyyy") ?? "Nao informada";
                var bloodStr = $"{patient.BloodType ?? "Nao inf."} Rh {patient.RhFactor ?? "Nao inf."}";
                sb.Append("0 -13 Td\n");
                sb.Append("(Data de Nasc.: ").Append(EscapePdf(birthStr))
                  .Append("   |   Tipagem Sanguinea: ").Append(EscapePdf(bloodStr)).Append(") Tj\n");

                var gpa = gynProfile is not null
                    ? $"G{gynProfile.Gravida} P{gynProfile.Para} C{gynProfile.Cesareans} A{gynProfile.Abortions} (Filhos vivos: {gynProfile.LivingChildren})"
                    : "Nao informado";
                sb.Append("0 -13 Td\n");
                sb.Append("(Historico Obstetrico: ").Append(EscapePdf(gpa)).Append(") Tj\n");

                // Linha divisória da Tabela
                sb.Append("0 -14 Td\n");
                sb.Append("/F1 8 Tf\n");
                sb.Append("0.7 0.7 0.7 rg\n");
                sb.Append("_________________________________________________________________________________ Tj\n");

                // Cabeçalho da Tabela
                sb.Append("0 -20 Td\n");
                sb.Append("/F2 10 Tf\n");
                sb.Append("0.125 0.149 0.192 rg\n");
                sb.Append("(REGISTRO CRONOLOGICO DE CONSULTAS DE PRE-NATAL) Tj\n");
            }
            else
            {
                // Cabeçalho Compacto (Páginas Subsequentes)
                sb.Append("/F2 14 Tf\n");
                sb.Append("0.000 0.373 0.416 rg\n"); // #005F6A
                sb.Append("(").Append(EscapePdf(SanitizeText(clinicName))).Append(") Tj\n");

                sb.Append("0 -16 Td\n");
                sb.Append("/F2 11 Tf\n");
                sb.Append("0.000 0.502 0.502 rg\n"); // #008080
                sb.Append("(CARTAO DA GESTANTE - ACOMPANHAMENTO PRE-NATAL (CONTINUACAO)) Tj\n");

                sb.Append("0 -12 Td\n");
                sb.Append("/F1 8 Tf\n");
                sb.Append("0.7 0.7 0.7 rg\n");
                sb.Append("_________________________________________________________________________________ Tj\n");

                sb.Append("0 -16 Td\n");
                sb.Append("/F2 9 Tf\n");
                sb.Append("0.125 0.149 0.192 rg\n");
                sb.Append("(Paciente: ").Append(EscapePdf(SanitizeText(patient.Name)))
                  .Append("   |   Folha ").Append(pageIndex + 1).Append(" de ").Append(pageCount).Append(") Tj\n");

                sb.Append("0 -14 Td\n");
                sb.Append("/F1 8 Tf\n");
                sb.Append("0.7 0.7 0.7 rg\n");
                sb.Append("_________________________________________________________________________________ Tj\n");

                sb.Append("0 -16 Td\n");
            }

            // Cabeçalho das Colunas
            sb.Append("0 -16 Td\n");
            sb.Append("/F2 8 Tf\n");
            sb.Append("0.3 0.3 0.3 rg\n");
            sb.Append("(Data       IG (sem/d)   Peso (kg)   PA (mmHg)   AU (cm)   BCF (bpm)   Apres. Fetal   Mov. Fetal   Edema) Tj\n");

            sb.Append("0 -8 Td\n");
            sb.Append("/F1 7 Tf\n");
            sb.Append("0.75 0.75 0.75 rg\n");
            sb.Append("------------------------------------------------------------------------------------------------------------------------ Tj\n");

            // Linhas de consultas
            if (pageVisits.Count == 0)
            {
                sb.Append("0 -14 Td\n");
                sb.Append("/F1 9 Tf\n");
                sb.Append("0.5 0.5 0.5 rg\n");
                sb.Append("(Nenhuma consulta pre-natal registrada ate o momento.) Tj\n");
            }
            else
            {
                foreach (var visit in pageVisits)
                {
                    var dt = visit.VisitDate.ToString("dd/MM/yyyy");
                    var ig = $"{visit.GestationalAgeWeeks}s {visit.GestationalAgeDays}d";
                    var peso = visit.WeightKg.ToString("F1", CultureInfo.InvariantCulture);
                    var pa = visit.BloodPressure;
                    var au = visit.UterineHeightCm?.ToString("F0", CultureInfo.InvariantCulture) ?? "-";
                    var bcf = visit.FetalHeartRateBpm?.ToString() ?? "-";
                    var apres = visit.FetalPresentation ?? "-";
                    var mf = visit.FetalMovementPresent == true ? "Presente" : (visit.FetalMovementPresent == false ? "Ausente" : "-");
                    var edema = visit.EdemaClassification ?? "Ausente";

                    var line = $"{dt,-10}  {ig,-11}  {peso,-9}  {pa,-10}  {au,-7}  {bcf,-9}  {apres,-13}  {mf,-10}  {edema}";

                    sb.Append("0 -13 Td\n");
                    sb.Append("/F1 8 Tf\n");
                    sb.Append("0.2 0.2 0.2 rg\n");
                    sb.Append("(").Append(EscapePdf(line)).Append(") Tj\n");
                }
            }

            // Rodapé de Autenticação e Diretrizes FEBRASGO
            sb.Append("0 -36 Td\n");
            sb.Append("/F1 8 Tf\n");
            sb.Append("0.4 0.4 0.4 rg\n");
            sb.Append("(Documento gerado eletronicamente em conformidade com as diretrizes do Ministerio da Saude e FEBRASGO.) Tj\n");
            sb.Append("0 -11 Td\n");
            sb.Append("(Cana Med Mulher - Plataforma de Gestao Clinica e Saude da Mulher | Lei 13.787/2018 e CFM | Pagina ")
              .Append(pageIndex + 1).Append(" de ").Append(pageCount).Append(") Tj\n");

            sb.Append("ET");

            pageStreams.Add(Encoding.Latin1.GetBytes(sb.ToString().Replace("\r\n", "\n")));
        }

        int font1Id = 2 * pageCount + 3;
        int font2Id = 2 * pageCount + 4;
        int totalObjects = 2 * pageCount + 4;

        var header = Encoding.Latin1.GetBytes("%PDF-1.4\n");
        var obj1 = Encoding.Latin1.GetBytes("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

        var kidsStr = string.Join(" ", Enumerable.Range(1, pageCount).Select(p => $"{2 * p + 1} 0 R"));
        var obj2 = Encoding.Latin1.GetBytes($"2 0 obj\n<< /Type /Pages /Kids [{kidsStr}] /Count {pageCount} >>\nendobj\n");

        var pageObjects = new List<(byte[] pageObj, byte[] contentHead, byte[] streamBytes, byte[] contentFoot)>();

        for (int p = 1; p <= pageCount; p++)
        {
            int pageObjId = 2 * p + 1;
            int contentObjId = 2 * p + 2;
            var streamBytes = pageStreams[p - 1];

            var pageObj = Encoding.Latin1.GetBytes($"{pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents {contentObjId} 0 R /Resources << /Font << /F1 {font1Id} 0 R /F2 {font2Id} 0 R >> >> >>\nendobj\n");
            var contentHead = Encoding.Latin1.GetBytes($"{contentObjId} 0 obj\n<< /Length {streamBytes.Length} >>\nstream\n");
            var contentFoot = Encoding.Latin1.GetBytes("\nendstream\nendobj\n");

            pageObjects.Add((pageObj, contentHead, streamBytes, contentFoot));
        }

        var objFont1 = Encoding.Latin1.GetBytes($"{font1Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");
        var objFont2 = Encoding.Latin1.GetBytes($"{font2Id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");

        var offsets = new long[totalObjects + 1];
        long currentOffset = header.Length;

        offsets[1] = currentOffset;
        currentOffset += obj1.Length;

        offsets[2] = currentOffset;
        currentOffset += obj2.Length;

        for (int p = 1; p <= pageCount; p++)
        {
            int pageObjId = 2 * p + 1;
            int contentObjId = 2 * p + 2;
            var item = pageObjects[p - 1];

            offsets[pageObjId] = currentOffset;
            currentOffset += item.pageObj.Length;

            offsets[contentObjId] = currentOffset;
            currentOffset += item.contentHead.Length + item.streamBytes.Length + item.contentFoot.Length;
        }

        offsets[font1Id] = currentOffset;
        currentOffset += objFont1.Length;

        offsets[font2Id] = currentOffset;
        currentOffset += objFont2.Length;

        long startXref = currentOffset;

        var sbXref = new StringBuilder();
        sbXref.Append($"xref\n0 {totalObjects + 1}\n0000000000 65535 f \n");
        for (int i = 1; i <= totalObjects; i++)
        {
            sbXref.Append($"{offsets[i]:D10} 00000 n \n");
        }
        var xref = Encoding.Latin1.GetBytes(sbXref.ToString());

        var trailer = Encoding.Latin1.GetBytes(
            $"trailer\n<< /Size {totalObjects + 1} /Root 1 0 R >>\nstartxref\n{startXref}\n%%EOF\n");

        using var ms = new MemoryStream();
        ms.Write(header);
        ms.Write(obj1);
        ms.Write(obj2);

        foreach (var item in pageObjects)
        {
            ms.Write(item.pageObj);
            ms.Write(item.contentHead);
            ms.Write(item.streamBytes);
            ms.Write(item.contentFoot);
        }

        ms.Write(objFont1);
        ms.Write(objFont2);
        ms.Write(xref);
        ms.Write(trailer);

        return ms.ToArray();
    }

    private static string EscapePdf(string input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        return input.Replace("\\", "\\\\").Replace("(", "\\(").Replace(")", "\\)");
    }

    private static string SanitizeText(string input)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        var normalized = input.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalized)
        {
            var uc = CharUnicodeInfo.GetUnicodeCategory(c);
            if (uc != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
