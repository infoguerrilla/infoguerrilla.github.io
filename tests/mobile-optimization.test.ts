import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Mobile UX & AI Pop-up Mobile Optimization', () => {
  it('optimizes AiBadge modal for mobile with sticky header, active-first ordering, and scroll lock', () => {
    const badgePath = path.resolve(process.cwd(), 'src/components/AiBadge.astro');
    const content = fs.readFileSync(badgePath, 'utf-8');

    // Cabeçalho fixo (sticky) dentro do pop-up para fácil fechamento no celular
    expect(content).toContain('sticky top-0');

    // Card da categoria ativa aparece primeiro no mobile (order-first sm:order-none)
    expect(content).toContain('order-first sm:order-none');

    // Trava o scroll do body enquanto o modal está aberto no mobile
    expect(content).toContain("document.body.style.overflow = 'hidden'");
  });

  it('prevents mobile horizontal blowout from wide tables and long URLs in global.css', () => {
    const cssPath = path.resolve(process.cwd(), 'src/styles/global.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Links longos nas referências não devem estourar a largura da tela
    expect(cssContent).toContain('overflow-wrap: anywhere');

    // Tabelas em artigos devem ter scroll horizontal contido em telas pequenas
    expect(cssContent).toMatch(/\.academic-prose\s+table[\s\S]*?overflow-x:\s*auto/);
  });

  it('stacks post header metadata cleanly on mobile viewports', () => {
    const postPath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const postContent = fs.readFileSync(postPath, 'utf-8');

    expect(postContent).toContain('flex-col sm:flex-row');
  });
});
