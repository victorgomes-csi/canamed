import type { PrenatalVisitDto } from './medicalRecordsApi';

interface Props {
  visits: Array<Partial<PrenatalVisitDto> & { gestationalAgeWeeks?: number | null; uterineHeightCm?: number | null }>;
}

export function UterineHeightChart({ visits }: Props) {
  // Ordena visitas por idade gestacional em semanas
  const validPoints = visits
    .filter((v) => v.gestationalAgeWeeks && v.gestationalAgeWeeks >= 12 && v.uterineHeightCm)
    .sort((a, b) => a.gestationalAgeWeeks! - b.gestationalAgeWeeks!);

  // Dimensões do SVG
  const width = 500;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Escala X: semanas 12 a 40
  const minW = 12;
  const maxW = 40;
  const scaleX = (w: number) => padLeft + ((w - minW) / (maxW - minW)) * chartW;

  // Escala Y: Altura Uterina em cm (8 a 40cm)
  const minAu = 8;
  const maxAu = 40;
  const scaleY = (au: number) => padTop + chartH - ((au - minAu) / (maxAu - minAu)) * chartH;

  // Curvas de referência FEBRASGO/MS: P10 e P90 para AU
  const refWeeks = [14, 16, 20, 24, 28, 32, 36, 40];
  const p10Points = refWeeks.map((w) => `${scaleX(w)},${scaleY(Math.max(10, w - 3.5))}`).join(' ');
  const p90Points = refWeeks.map((w) => `${scaleX(w)},${scaleY(Math.min(38, w + 3.0))}`).join(' ');

  // Polígono sombreado entre P10 e P90
  const p10Arr = refWeeks.map((w) => `${scaleX(w)},${scaleY(Math.max(10, w - 3.5))}`);
  const p90ArrReversed = [...refWeeks].reverse().map((w) => `${scaleX(w)},${scaleY(Math.min(38, w + 3.0))}`);
  const bandPolygon = [...p10Arr, ...p90ArrReversed].join(' ');

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #E9D5FF',
        borderRadius: '12px',
        padding: '1rem',
        marginTop: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <strong style={{ fontSize: '0.88rem', color: '#6F217B' }}>
          📏 Curva de Altura Uterina (P10 a P90 - FEBRASGO)
        </strong>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
          <span style={{ color: '#B77AD8', fontWeight: 600 }}>-- Percentil 10</span>
          <span style={{ color: '#D83C91', fontWeight: 600 }}>-- Percentil 90</span>
          <span style={{ color: '#852A91', fontWeight: 700 }}>● Paciente</span>
        </div>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Faixa sombreada P10-P90 */}
        <polygon points={bandPolygon} fill="#FAF5FB" />

        {/* Eixos */}
        <line x1={padLeft} y1={padTop + chartH} x2={padLeft + chartW} y2={padTop + chartH} stroke="#CBD5E0" strokeWidth="1.5" />
        <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + chartH} stroke="#CBD5E0" strokeWidth="1.5" />

        {/* Ticks X: semanas */}
        {[12, 16, 20, 24, 28, 32, 36, 40].map((sem) => (
          <g key={`x-${sem}`}>
            <line x1={scaleX(sem)} y1={padTop + chartH} x2={scaleX(sem)} y2={padTop + chartH + 4} stroke="#A0AEC0" />
            <text x={scaleX(sem)} y={padTop + chartH + 16} fontSize="9" textAnchor="middle" fill="#718096">
              {sem}s
            </text>
          </g>
        ))}

        {/* Ticks Y: cm */}
        {[10, 15, 20, 25, 30, 35].map((au) => (
          <g key={`y-${au}`}>
            <line x1={padLeft - 4} y1={scaleY(au)} x2={padLeft} y2={scaleY(au)} stroke="#A0AEC0" />
            <text x={padLeft - 8} y={scaleY(au) + 3} fontSize="9" textAnchor="end" fill="#718096">
              {au}cm
            </text>
          </g>
        ))}

        {/* Linha P10 e P90 */}
        <polyline fill="none" stroke="#B77AD8" strokeWidth="2" strokeDasharray="4 3" points={p10Points} />
        <polyline fill="none" stroke="#D83C91" strokeWidth="2" strokeDasharray="4 3" points={p90Points} />

        {/* Aviso amigável quando não há dados de AU */}
        {validPoints.length === 0 && (
          <g>
            <rect
              x={padLeft + 15}
              y={padTop + chartH / 2 - 20}
              width={chartW - 30}
              height={40}
              rx={8}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#B77AD8"
              strokeDasharray="4 3"
            />
            <text
              x={padLeft + chartW / 2}
              y={padTop + chartH / 2 + 5}
              textAnchor="middle"
              fontSize="11"
              fill="#6F217B"
              fontWeight="600"
            >
              A aferição da altura uterina inicia-se habitualmente a partir da 12ª–14ª semana.
            </text>
          </g>
        )}

        {/* Linha e Pontos de evolução da AU da paciente */}
        {validPoints.length > 1 && (
          <polyline
            fill="none"
            stroke="#852A91"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={validPoints.map((p) => `${scaleX(p.gestationalAgeWeeks!)},${scaleY(p.uterineHeightCm!)}`).join(' ')}
          />
        )}

        {validPoints.map((p, idx) => (
          <g key={`point-${idx}`}>
            <circle
              cx={scaleX(p.gestationalAgeWeeks!)}
              cy={scaleY(p.uterineHeightCm!)}
              r={5}
              fill="#6F217B"
              stroke="#FFFFFF"
              strokeWidth="2"
              
            >
              <title>{`${p.gestationalAgeWeeks}s: Altura Uterina ${p.uterineHeightCm}cm`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
