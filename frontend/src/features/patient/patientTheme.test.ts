import { describe, it, expect } from 'vitest';

declare const process: any;

describe('Design System Serene Bloom - Tokens & Ícones', () => {
  it('deve conter o arquivo patient-serene.css com tokens de paleta e contraste WCAG AA', async () => {
    // @ts-ignore
    const fs = await import('node:fs');
    // @ts-ignore
    const path = await import('node:path');
    const sereneCssPath = path.resolve(process.cwd(), 'src/features/patient/patient-serene.css');

    expect(fs.existsSync(sereneCssPath)).toBe(true);
    const cssContent = fs.readFileSync(sereneCssPath, 'utf-8');

    // WCAG AA Tokens
    expect(cssContent).toContain('--color-serene-primary-text: #B30063;');
    expect(cssContent).toContain('--color-serene-primary: #D8257C;');
    expect(cssContent).toContain('--color-serene-secondary: #7C4C8A;');
    expect(cssContent).toContain('--color-serene-surface: #FDF7FF;');
    expect(cssContent).toContain('--color-serene-surface-low: #F8F1FF;');
    expect(cssContent).toContain('--color-serene-surface-card: #FFFFFF;');
    expect(cssContent).toContain('--color-serene-outline: #8C6F78;');
    expect(cssContent).toContain('--color-serene-text-main: #1D1929;');
    expect(cssContent).toContain('--color-serene-emergency: #DC2626;');

    // Sombras Luminescentes & Soft
    expect(cssContent).toContain('--shadow-serene-soft:');
    expect(cssContent).toContain('--shadow-serene-luminescence:');
  });

  it('deve carregar Material Symbols Outlined no index.html', async () => {
    // @ts-ignore
    const fs = await import('node:fs');
    // @ts-ignore
    const path = await import('node:path');
    const indexHtmlPath = path.resolve(process.cwd(), 'index.html');

    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
    expect(htmlContent).toContain('Material+Symbols+Outlined');
  });
});
