import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Header Reading Ruler Integration', () => {
  it('embeds the reading progress ruler directly at the bottom edge of the Header component', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    expect(headerContent).toContain('id="header-reading-progress"');
    expect(headerContent).toContain('header-reading-ruler');
    expect(headerContent).toMatch(/setupReadingProgress|updateReadingProgress/);
  });

  it('removes separate ReadingRuler component invocation from post template', () => {
    const postTemplatePath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const templateContent = fs.readFileSync(postTemplatePath, 'utf-8');

    expect(templateContent).not.toContain('<ReadingRuler');
    expect(templateContent).not.toContain("import ReadingRuler from '../../components/ReadingRuler.astro'");
  });
});
