import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Table of Contents (Sumário) Responsiveness and Scroll', () => {
  it('supports isMobile prop and renders collapsible <details> for mobile and scrollable nav for desktop', () => {
    const tocPath = path.resolve(process.cwd(), 'src/components/TableOfContents.astro');
    expect(fs.existsSync(tocPath)).toBe(true);
    const tocContent = fs.readFileSync(tocPath, 'utf-8');

    // Aceita isMobile?: boolean
    expect(tocContent).toMatch(/isMobile\??\s*:\s*boolean/);

    // Estrutura retrátil mobile com <details> e <summary>
    expect(tocContent).toContain('<details');
    expect(tocContent).toContain('<summary');
    expect(tocContent).toMatch(/ABRIR|FECHAR|EXPANDIR|RECOLHER/);

    // Rolagem independente com overflow-y-auto e overscroll-contain
    expect(tocContent).toContain('overflow-y-auto');
    expect(tocContent).toContain('overscroll-contain');

    // Altura máxima para permitir scroll em desktop
    expect(tocContent).toMatch(/max-h-\[calc\(100vh/);
  });

  it('updates post template to pass isMobile to mobile TOC and proper aside sticky desktop TOC', () => {
    const postTemplatePath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const content = fs.readFileSync(postTemplatePath, 'utf-8');

    // Mobile TOC passa isMobile={true}
    expect(content).toMatch(/<TableOfContents[\s\S]*?isMobile=\{true\}[\s\S]*?\/>/);

    // Desktop TOC no aside sticky
    expect(content).toMatch(/<aside[\s\S]*?sticky[\s\S]*?<TableOfContents/);
  });

  it('includes custom scrollbar utility in global.css', () => {
    const globalCssPath = path.resolve(process.cwd(), 'src/styles/global.css');
    const cssContent = fs.readFileSync(globalCssPath, 'utf-8');

    expect(cssContent).toContain('custom-scrollbar');
  });
});

