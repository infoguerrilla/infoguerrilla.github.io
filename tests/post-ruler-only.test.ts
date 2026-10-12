import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Reading Ruler Exclusivity to Posts', () => {
  it('conditionally hides header reading ruler on non-post pages in Header component', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    expect(headerContent).toMatch(/isPost\s*=\s*currentPath\.startsWith\('\/post'\)/);
    expect(headerContent).toContain('${isPost ?');
  });

  it('ensures reading progress script verifies post presence before activating', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    expect(headerContent).toMatch(/if\s*\(!article\)/);
    expect(headerContent).toContain("rulerContainer.classList.add('hidden')");
  });

  it('verifies that dist/index.html hides the ruler while dist/post/ shows it', () => {
    const indexHtml = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');
    const postHtml = fs.readFileSync(path.resolve('dist/post/nao-leia-mark-fisher/index.html'), 'utf-8');

    // Em index.html, a régua deve ter a classe hidden
    expect(indexHtml).toMatch(/id="header-reading-ruler"[^>]*class="[^"]*hidden/);

    // Em posts, a régua NÃO deve ter a classe hidden
    const postRulerMatch = postHtml.match(/id="header-reading-ruler"[^>]*class="([^"]*)"/);
    expect(postRulerMatch).toBeTruthy();
    expect(postRulerMatch![1]).not.toContain('hidden');
  });
});
