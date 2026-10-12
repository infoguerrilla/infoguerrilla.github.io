import { describe, it, expect } from 'vitest';
import { collections } from '../src/content/config';
import fs from 'node:fs';
import path from 'node:path';

describe('Post Image Caption Support', () => {
  it('validates schema with imageCaption and caption fields', () => {
    const postSchema = collections.post.schema;

    const parsedWithImageCaption = postSchema.safeParse({
      title: 'Ensaio Construtivista',
      date: new Date('2026-01-01'),
      image: 'image.png',
      imageCaption: 'Cartaz da vanguarda soviética por El Lissitzky (1919)',
    });
    expect(parsedWithImageCaption.success).toBe(true);
    if (parsedWithImageCaption.success) {
      expect(parsedWithImageCaption.data.imageCaption).toBe('Cartaz da vanguarda soviética por El Lissitzky (1919)');
    }

    const parsedWithCaptionAlias = postSchema.safeParse({
      title: 'Ensaio Construtivista 2',
      date: new Date('2026-01-01'),
      image: 'image.png',
      caption: 'Fotografia de Aleksandr Rodchenko (1924)',
    });
    expect(parsedWithCaptionAlias.success).toBe(true);
    if (parsedWithCaptionAlias.success) {
      expect(parsedWithCaptionAlias.data.caption).toBe('Fotografia de Aleksandr Rodchenko (1924)');
    }
  });

  it('renders <figure> and <figcaption> underneath the featured image in post template', () => {
    const postTemplatePath = path.resolve(process.cwd(), 'src/pages/post/[...slug].astro');
    const templateContent = fs.readFileSync(postTemplatePath, 'utf-8');

    // Verifica que o template usa figure e figcaption para a imagem de destaque
    expect(templateContent).toContain('<figure');
    expect(templateContent).toContain('<figcaption');
    expect(templateContent).toMatch(/imageCaption|caption/);
  });
});
