import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Archive & Search Tag-Only Filter', () => {
  it('verifies that /arquivo uses tags exclusively for filtering', () => {
    const archivePath = path.resolve(process.cwd(), 'src/pages/arquivo.astro');
    expect(fs.existsSync(archivePath)).toBe(true);

    const content = fs.readFileSync(archivePath, 'utf-8');

    // Deve coletar tags dos posts
    expect(content).toContain('post.data.tags');

    // Deve ter atributos data-tag e data-tags
    expect(content).toContain('data-tag="all"');
    expect(content).toContain('data-tag=');
    expect(content).toContain('data-tags=');

    // O script no cliente deve ler o parâmetro 'tag'
    expect(content).toMatch(/params\.get\(['"]tag['"]\)/);

    // Não deve conter mais data-category nem data-categories
    expect(content).not.toContain('data-category=');
    expect(content).not.toContain('data-categories=');

    // Se o post tiver série, deve exibir badge de série
    expect(content).toMatch(/getSeriesName|seriesName/);
    expect(content).toContain('// SÉRIE:');
  });

  it('verifies that index.astro displays popular tags linking to /arquivo?tag=', () => {
    const indexPath = path.resolve(process.cwd(), 'src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('p.data.tags');
    expect(content).toContain('/arquivo?tag=');
  });

  it('verifies that busca.astro indexes tags and series for fallback search', () => {
    const buscaPath = path.resolve(process.cwd(), 'src/pages/busca.astro');
    const content = fs.readFileSync(buscaPath, 'utf-8');

    expect(content).toContain('tags: p.data.tags');
    expect(content).toMatch(/series/);
  });

  it('prevents search placeholder from overlapping [LIMPAR] on mobile by removing examples and adding padding', () => {
    const buscaPath = path.resolve(process.cwd(), 'src/pages/busca.astro');
    const content = fs.readFileSync(buscaPath, 'utf-8');

    // Input possui padding à direita para não encavalar no botão [LIMPAR]
    expect(content).toMatch(/pr-(?:20|24)/);

    // Placeholder inicial/mobile sem os exemplos longos
    expect(content).toMatch(/placeholder=["'](?:Pesquisar\.\.\.|Buscar\.\.\.)["']/);

    // Ajuste dinâmico responsivo no script
    expect(content).toMatch(/updatePlaceholder|matchMedia/);
  });

  it('limits initial tags on index.astro to 20 with an expansion button for the rest', () => {
    const indexPath = path.resolve(process.cwd(), 'src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf-8');

    // As tags além do índice 20 devem ter classe ou atributo para ficarem ocultas inicialmente
    expect(content).toMatch(/index\s*>=\s*20/);
    expect(content).toContain('expand-index-tags-btn');
    expect(content).toContain('setupIndexTagsExpand');
  });

  it('limits initial tag filter buttons on arquivo.astro to 20 with an expansion button for the rest', () => {
    const archivePath = path.resolve(process.cwd(), 'src/pages/arquivo.astro');
    const content = fs.readFileSync(archivePath, 'utf-8');

    // As tags de filtro além do índice 20 devem ter classe para ficarem ocultas inicialmente
    expect(content).toMatch(/index\s*>=\s*20/);
    expect(content).toContain('expand-archive-tags-btn');
    expect(content).toContain('archive-extra-tag');
  });
});

