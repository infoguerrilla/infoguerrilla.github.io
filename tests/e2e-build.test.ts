import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const hasDist = fs.existsSync(path.resolve('dist/index.html'));

describe.skipIf(!hasDist)('Build Output Verification', () => {
  it('generates index, archive, about, and search pages', () => {
    expect(fs.existsSync(path.resolve('dist/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/arquivo/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/sobre/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/busca/index.html'))).toBe(true);
  });

  it('generates author dedicated page and RSS feed', () => {
    expect(fs.existsSync(path.resolve('dist/autor/geraldo-homero-do-couto-neto/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/rss.xml'))).toBe(true);
  });

  it('includes credit to Universitas and I_G logo in footer and header', () => {
    const indexHtml = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');
    expect(indexHtml).toContain('https://universitas-io.github.io');
    expect(indexHtml).toContain('Universitas');
    expect(indexHtml).toContain('I');
    expect(indexHtml).toContain('_');
    expect(indexHtml).toContain('G');
  });

  it('generates legacy /p/ redirects for backwards compatibility', () => {
    expect(fs.existsSync(path.resolve('dist/p/nao-leia-mark-fisher/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/p/software-livre-open-source-privacidade-seguranca/index.html'))).toBe(true);
  });

  it('includes data-pagefind-body on articles and removes academic citation box', () => {
    const postHtml = fs.readFileSync(path.resolve('dist/post/nao-leia-mark-fisher/index.html'), 'utf-8');
    expect(postHtml).toContain('data-pagefind-body');
    expect(postHtml).not.toContain('COUTO NETO, Geraldo Homero do.');
  });

  it('generates pagefind search index after full build', () => {
    expect(fs.existsSync(path.resolve('dist/pagefind/pagefind.js'))).toBe(true);
  });

  it('renders image caption and embedded reading ruler in generated post HTML', () => {
    const postHtml = fs.readFileSync(path.resolve('dist/post/nao-leia-mark-fisher/index.html'), 'utf-8');
    expect(postHtml).toContain('<figcaption');
    expect(postHtml).toContain('Giovanni Battista Piranesi');
    expect(postHtml).toContain('id="header-reading-ruler"');
    expect(postHtml).toContain('id="mobile-theme-toggle"');
  });

  it('generates series index and detail pages with editorial explanation', () => {
    expect(fs.existsSync(path.resolve('dist/series/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/series/das-kapital/index.html'))).toBe(true);

    const seriesHtml = fs.readFileSync(path.resolve('dist/series/das-kapital/index.html'), 'utf-8');
    expect(seriesHtml).toContain('Das Kapital');
    expect(seriesHtml).toContain('trabalho do alfaiate não desapareça na roupa');
    expect(seriesHtml).toContain('vintage-archive-img');
    expect(seriesHtml).toContain('Para que o trabalho do alfaiate não desapareça na roupa');
  });

  it('verifies archive and series navigation in generated post HTML', () => {
    const archiveHtml = fs.readFileSync(path.resolve('dist/arquivo/index.html'), 'utf-8');
    expect(archiveHtml).toContain('data-tag="all"');
    expect(archiveHtml).toContain('data-tags=');
    expect(archiveHtml).not.toContain('data-category=');

    const marxPostHtml = fs.readFileSync(path.resolve('dist/post/para-que-o-trabalho-do-alfaiate-nao-desapareca-na-roupa/index.html'), 'utf-8');
    expect(marxPostHtml).toContain('// SÉRIE ESPECIAL: Das Kapital');
  });
});
