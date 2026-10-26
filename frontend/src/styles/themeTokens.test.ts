import { describe, expect, it } from 'vitest';

declare const process: any;

describe('Identidade Visual Canônica e Tokens Oficiais (Task 7)', () => {
  it('define as cores canônicas oficiais do Cana Med Mulher em theme.css', async () => {
    // @ts-ignore
    const fs = await import('node:fs');
    // @ts-ignore
    const path = await import('node:path');
    const themeCssPath = path.resolve(process.cwd(), 'src/styles/theme.css');
    const themeContent = fs.readFileSync(themeCssPath, 'utf-8');

    // #008080 Teal, #005F6A Petróleo, #66CDAA Menta, #E6F3F3 Soft Teal
    expect(themeContent).toMatch(/--brand-primary:\s*#008080/i);
    expect(themeContent).toMatch(/--brand-hover:\s*#006666/i);
    expect(themeContent).toMatch(/--brand-magenta:\s*#005F6A/i);
    expect(themeContent).toMatch(/--brand-soft:\s*#E6F3F3/i);
    expect(themeContent).toContain('--brand-primary: #008080;');
    expect(themeContent).toContain('--brand-hover: #006666;');
    expect(themeContent).toContain('--brand-magenta: #005F6A;');
    expect(themeContent).toContain('--brand-lilac: #66CDAA;');
    expect(themeContent).toContain('--brand-soft: #E6F3F3;');
  });

  it('não contém nenhum resquício de hexadecimais roxos/magentas legados em theme.css', async () => {
    // @ts-ignore
    const fs = await import('node:fs');
    // @ts-ignore
    const path = await import('node:path');
    const themeCssPath = path.resolve(process.cwd(), 'src/styles/theme.css');
    const themeContent = fs.readFileSync(themeCssPath, 'utf-8');

    const forbiddenColors = [
      '#852A91',
      '#6F217B',
      '#D83C91',
      '#B77AD8',
      '#F7ECF8',
      '#581862',
    ];

    for (const color of forbiddenColors) {
      const regex = new RegExp(color, 'i');
      expect(themeContent, `theme.css contém cor proibida ${color}`).not.toMatch(regex);
    }
  });

  it('não contém nenhum resquício de hexadecimais roxos/magentas legados nos componentes do frontend', async () => {
    // @ts-ignore
    const fs = await import('node:fs');
    // @ts-ignore
    const path = await import('node:path');
    const srcDir = path.resolve(process.cwd(), 'src');
    const forbiddenRegex = /#(852A91|6F217B|D83C91|B77AD8|F7ECF8|581862)\b/i;

    const checkDir = (dir: string): { file: string; line: number; text: string }[] => {
      let violations: { file: string; line: number; text: string }[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          violations = violations.concat(checkDir(fullPath));
        } else if (/\.(tsx|ts|css)$/.test(entry.name) && entry.name !== 'themeTokens.test.ts') {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          lines.forEach((line: string, idx: number) => {
            if (forbiddenRegex.test(line)) {
              violations.push({
                file: path.relative(srcDir, fullPath),
                line: idx + 1,
                text: line.trim(),
              });
            }
          });
        }
      }
      return violations;
    };

    const violations = checkDir(srcDir);
    expect(violations, `Encontradas cores proibidas: ${JSON.stringify(violations, null, 2)}`).toHaveLength(0);
  });
});
