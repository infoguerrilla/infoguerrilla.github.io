import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Build Output Verification', () => {
  it('generates index and critical post pages', () => {
    expect(fs.existsSync(path.resolve('dist/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/arquivo/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/sobre/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/busca/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/post/nao-leia-mark-fisher/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/post/software-livre-open-source-privacidade-seguranca/index.html'))).toBe(true);
  });

  it('generates legacy /p/ redirects for backwards compatibility', () => {
    expect(fs.existsSync(path.resolve('dist/p/nao-leia-mark-fisher/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/p/software-livre-open-source-privacidade-seguranca/index.html'))).toBe(true);
  });

  it('includes data-pagefind-body attribute on essay articles', () => {
    const postHtml = fs.readFileSync(path.resolve('dist/post/nao-leia-mark-fisher/index.html'), 'utf-8');
    expect(postHtml).toContain('data-pagefind-body');
  });

  it('generates pagefind search index after full build', () => {
    expect(fs.existsSync(path.resolve('dist/pagefind/pagefind.js'))).toBe(true);
  });
});
