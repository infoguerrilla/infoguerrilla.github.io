import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Clean Markdown Numeric Notes ([1], [2]) & Auto-Linking Rehype Plugin', () => {
  const postPath = path.resolve(
    process.cwd(),
    'src/content/post/direita-e-software-livre/index.md'
  );

  it('uses clean [N] markdown syntax and a plain numbered list in direita-e-software-livre/index.md without raw HTML tags', () => {
    const content = fs.readFileSync(postPath, 'utf-8');

    // Sem HTML verboso no markdown
    expect(content).not.toContain('<sup><a');
    expect(content).not.toContain('<li id="nota-');
    expect(content).not.toContain('<ol class="references-list">');

    // Usa apenas [1], [4], etc. no texto markdown
    expect(content).toContain('Consenso de Washington[1].');
    expect(content).toContain('contra o Estado[4].');
    expect(content).toContain('2017[17].');
    expect(content).toContain('aborto[23].');

    // Lista numerada simples em Markdown no final
    expect(content).toContain('### Referências');
    expect(content).toMatch(/\n1\. /);
    expect(content).toMatch(/\n10\. /);
  });

  it('automatically compiles [N] to linked <sup><a href="#nota-N"> and <li id="nota-N"> via rehype plugin', async () => {
    const pluginPath = path.resolve(process.cwd(), 'src/utils/rehype-numeric-notes.mjs');
    expect(fs.existsSync(pluginPath)).toBe(true);

    const { rehypeNumericNotes } = await import('../src/utils/rehype-numeric-notes.mjs');
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{ type: 'text', value: 'Texto com nota[1] e outra[2].' }],
        },
        {
          type: 'element',
          tagName: 'h3',
          properties: {},
          children: [{ type: 'text', value: 'Referências' }],
        },
        {
          type: 'element',
          tagName: 'ol',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'li',
              properties: {},
              children: [{ type: 'text', value: 'Fonte Um' }],
            },
            {
              type: 'element',
              tagName: 'li',
              properties: {},
              children: [{ type: 'text', value: 'Fonte Dois' }],
            },
          ],
        },
      ],
    };

    rehypeNumericNotes()(tree);

    const pChildren = tree.children[0].children;
    expect(pChildren.some((c: any) => c.tagName === 'sup')).toBe(true);

    const ol = tree.children[2] as any;
    expect(ol.properties.className).toContain('references-list');
    expect(ol.children[0].properties.id).toBe('nota-1');
    expect(ol.children[1].properties.id).toBe('nota-2');
  });

  it('formats democracia-vertigem/index.md with clean [1], [2] citations and numbered references', () => {
    const demPath = path.resolve(
      process.cwd(),
      'src/content/post/democracia-vertigem/index.md'
    );
    const content = fs.readFileSync(demPath, 'utf-8');

    expect(content).toContain('[1]');
    expect(content).toContain('[2]');
    expect(content).toContain('### Referências');
    expect(content).toMatch(/\n1\. /);
    expect(content).toMatch(/\n2\. /);
  });

  it('uses high-opacity header-glass with backdrop-blur-md in Header.astro instead of broken bg-canvas/95', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const cssPath = path.resolve(process.cwd(), 'src/styles/global.css');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(headerContent).not.toContain('bg-canvas/95');
    expect(headerContent).toContain('header-glass');
    expect(cssContent).toContain('.header-glass');
  });
});
