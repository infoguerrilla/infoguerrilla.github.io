import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Series UI Components & Post Integration', () => {
  it('verifies that SeriesBox component exists with constructivist navigation', () => {
    const seriesBoxPath = path.resolve(process.cwd(), 'src/components/SeriesBox.astro');
    expect(fs.existsSync(seriesBoxPath)).toBe(true);

    const content = fs.readFileSync(seriesBoxPath, 'utf-8');
    expect(content).toContain('// SÉRIE ESPECIAL:');
    expect(content).toContain('totalCount');
    expect(content).toContain('currentIndex');
    expect(content).toContain('prevPost');
    expect(content).toContain('nextPost');
  });

  it('verifies that post template imports and renders SeriesBox and tags stamps', () => {
    const postTemplatePath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const content = fs.readFileSync(postTemplatePath, 'utf-8');

    expect(content).toContain('SeriesBox');
    expect(content).toContain('getSeriesNavigation');
    expect(content).toContain('<SeriesBox');
    expect(content).toContain('post.data.tags');
  });

  it('verifies that PostCard and HeroPoster display series badge when post belongs to a series', () => {
    const postCardPath = path.resolve(process.cwd(), 'src/components/PostCard.astro');
    const heroPosterPath = path.resolve(process.cwd(), 'src/components/HeroPoster.astro');

    const postCardContent = fs.readFileSync(postCardPath, 'utf-8');
    const heroPosterContent = fs.readFileSync(heroPosterPath, 'utf-8');

    expect(postCardContent).toMatch(/getSeriesName|seriesName/);
    expect(postCardContent).toContain('// SÉRIE:');

    expect(heroPosterContent).toMatch(/getSeriesName|seriesName/);
    expect(heroPosterContent).toContain('// SÉRIE:');
  });
});
