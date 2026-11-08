import { describe, it, expect } from 'vitest';
import { collections } from '../src/content/config';
import fs from 'node:fs';
import path from 'node:path';

describe('AI (0RWX) Categorization & Badge Pop-up', () => {
  it('defaults ai field to AI:0 when omitted in frontmatter', () => {
    const postSchema = collections.post.schema;
    const parsed = postSchema.safeParse({
      title: 'Ensaio Sem IA',
      date: new Date('2026-01-01'),
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.ai).toBe('AI:0');
    }
  });

  it('validates all 4 AI categories (AI:0, AI:R, AI:W, AI:X) and short codes', () => {
    const postSchema = collections.post.schema;

    for (const code of ['AI:0', 'AI:R', 'AI:W', 'AI:X'] as const) {
      const res = postSchema.safeParse({
        title: `Post ${code}`,
        date: new Date('2026-01-01'),
        ai: code,
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.ai).toBe(code);
      }
    }

    const shortRes = postSchema.safeParse({
      title: 'Post Short R',
      date: new Date('2026-01-01'),
      ai: 'R',
    });
    expect(shortRes.success).toBe(true);
    if (shortRes.success) {
      expect(shortRes.data.ai).toBe('AI:R');
    }
  });

  it('validates aiUse and usoIA fields in frontmatter', () => {
    const postSchema = collections.post.schema;

    const withAiUse = postSchema.safeParse({
      title: 'Post com aiUse',
      date: new Date('2026-01-01'),
      ai: 'AI:R',
      aiUse: 'Modelo Qwen3.5 usado para criação do código de extração de dados e visualização.',
    });
    expect(withAiUse.success).toBe(true);
    if (withAiUse.success) {
      expect(withAiUse.data.aiUse).toBe(
        'Modelo Qwen3.5 usado para criação do código de extração de dados e visualização.'
      );
    }

    const withUsoIA = postSchema.safeParse({
      title: 'Post com usoIA',
      date: new Date('2026-01-01'),
      ai: 'AI:W',
      usoIA: 'Revisão gramatical assistida.',
    });
    expect(withUsoIA.success).toBe(true);
    if (withUsoIA.success) {
      expect(withUsoIA.data.usoIA).toBe('Revisão gramatical assistida.');
    }
  });

  it('provides AI_CATEGORIES data, icons, and helper in src/data/ai.ts', async () => {
    const aiDataPath = path.resolve(process.cwd(), 'src/data/ai.ts');
    expect(fs.existsSync(aiDataPath)).toBe(true);

    const { AI_CATEGORIES, getAiCategory } = await import('../src/data/ai');
    expect(AI_CATEGORIES).toHaveLength(4);
    expect(getAiCategory('AI:0').code).toBe('AI:0');
    expect(getAiCategory('AI:0').icon).toBe('/ai/ai-0.png');
    expect(getAiCategory('AI:R').label).toBe('READ');
    expect(getAiCategory('AI:R').icon).toBe('/ai/ai-r.png');
    expect(getAiCategory('AI:W').label).toBe('WRITE');
    expect(getAiCategory('AI:W').icon).toBe('/ai/ai-w.png');
    expect(getAiCategory('AI:X').label).toBe('EXECUTE');
    expect(getAiCategory('AI:X').icon).toBe('/ai/ai-x.png');
    expect(getAiCategory(undefined).code).toBe('AI:0');

    for (const cat of AI_CATEGORIES) {
      const iconDiskPath = path.resolve(process.cwd(), 'public', cat.icon.replace(/^\//, ''));
      expect(fs.existsSync(iconDiskPath)).toBe(true);
    }
  });

  it('renders AiBadge component with popup modal, icons, 0rwx reference, and aiUse disclosure without verbose bottom examples', () => {
    const badgePath = path.resolve(process.cwd(), 'src/components/AiBadge.astro');
    expect(fs.existsSync(badgePath)).toBe(true);

    const badgeContent = fs.readFileSync(badgePath, 'utf-8');
    expect(badgeContent).toContain('<dialog');
    expect(badgeContent).toContain('https://0rwx.com/');
    expect(badgeContent).toContain('aiUse');
    expect(badgeContent).toContain('activeCategory.icon');
    expect(badgeContent).toContain('cat.icon');
    expect(badgeContent).not.toContain('examplesPt');
    expect(badgeContent).not.toContain('codeActionPt');
  });

  it('integrates AiBadge into the post page template right below author metadata', () => {
    const postPagePath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const postPageContent = fs.readFileSync(postPagePath, 'utf-8');

    expect(postPageContent).toContain('AiBadge');
    expect(postPageContent).toContain('<AiBadge');
    expect(postPageContent).toMatch(/post\.data\.ai/);
    expect(postPageContent).toMatch(/aiUse|usoIA/);

    const autoriaIdx = postPageContent.indexOf('AUTORIA:');
    const aiBadgeIdx = postPageContent.indexOf('<AiBadge');
    expect(autoriaIdx).toBeGreaterThan(-1);
    expect(aiBadgeIdx).toBeGreaterThan(autoriaIdx);
  });

  it('renders AI:R + aiUse in built meta-nikolas-direita post and defaults to AI:0 in posts without ai tag', () => {
    const nikolasHtml = fs.readFileSync(
      path.resolve(process.cwd(), 'dist/post/meta-nikolas-direita/index.html'),
      'utf-8'
    );
    expect(nikolasHtml).toContain('CLASSIFICAÇÃO DE USO DE IA:');
    expect(nikolasHtml).toContain('READ (AI:R)');
    expect(nikolasHtml).toContain('criação do código de extração de dados e visualização.');

    const fisherHtml = fs.readFileSync(
      path.resolve(process.cwd(), 'dist/post/nao-leia-mark-fisher/index.html'),
      'utf-8'
    );
    expect(fisherHtml).toContain('ZER0 (AI:0)');
  });

  it('displays the 0RWX AI categorization protocol in src/pages/sobre.astro', () => {
    const sobrePath = path.resolve(process.cwd(), 'src/pages/sobre.astro');
    const sobreContent = fs.readFileSync(sobrePath, 'utf-8');

    expect(sobreContent).toContain('AI_CATEGORIES');
    expect(sobreContent).toContain('0RWX');
    expect(sobreContent).toContain('https://0rwx.com/');
  });

  it('includes AI taxonomy filter and badge in src/pages/arquivo.astro', () => {
    const archivePath = path.resolve(process.cwd(), 'src/pages/arquivo.astro');
    const archiveContent = fs.readFileSync(archivePath, 'utf-8');

    expect(archiveContent).toContain('AI_CATEGORIES');
    expect(archiveContent).toContain('data-ai=');
    expect(archiveContent).toContain('ai-filter-btn');
    expect(archiveContent).toContain('FILTRAR POR TAXONOMIA DE IA (0RWX)');
  });

  it('triggers the 0RWX modal in arquivo.astro when clicking [ENTENDER 0RWX →]', () => {
    const archivePath = path.resolve(process.cwd(), 'src/pages/arquivo.astro');
    const archiveContent = fs.readFileSync(archivePath, 'utf-8');

    expect(archiveContent).toContain('<AiBadge');
    expect(archiveContent).toMatch(/variant=["']link["']/);
    expect(archiveContent).toMatch(/ENTENDER 0RWX/);
  });

  it('does not show any category as selected when rendered in informational link variant', () => {
    const badgePath = path.resolve(process.cwd(), 'src/components/AiBadge.astro');
    const badgeContent = fs.readFileSync(badgePath, 'utf-8');

    // Quando variant === 'link', isCurrent deve ser falso para todas as categorias
    expect(badgeContent).toMatch(/isCurrent\s*=[\s\S]*?variant\s*!==\s*['"]link['"]/);
  });
});
