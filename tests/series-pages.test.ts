import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Series Routes & Editorial Pages', () => {
  it('verifies that /series index page exists and loads series collection', () => {
    const seriesIndexPath = path.resolve(process.cwd(), 'src/pages/series/index.astro');
    expect(fs.existsSync(seriesIndexPath)).toBe(true);

    const content = fs.readFileSync(seriesIndexPath, 'utf-8');
    expect(content).toContain('getAllSeries');
    expect(content).toContain('BaseLayout');
    expect(content).toMatch(/SÉRIES|DOSSIÊS/i);
  });

  it('verifies that /series/[slug] page exists with getStaticPaths and editorial explanation rendering', () => {
    const seriesSlugPath = path.resolve(process.cwd(), 'src/pages/series/[slug].astro');
    expect(fs.existsSync(seriesSlugPath)).toBe(true);

    const content = fs.readFileSync(seriesSlugPath, 'utf-8');
    expect(content).toContain('getStaticPaths');
    expect(content).toContain('getAllSeries');
    expect(content).toContain('getCollection');
    expect(content).toMatch(/Content|description/);
    expect(content).toContain('posts');
  });
});

