import { describe, it, expect } from 'vitest';
import { collections } from '../src/content/config';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

describe('Author Content Collection & Editing Architecture', () => {
  it('defines authors collection schema with all required fields', () => {
    const authorSchema = collections.authors.schema;

    const validAuthor = {
      name: 'Maria da Silva',
      role: 'Filósofa e Pesquisadora',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Especialista em teoria crítica e estética construtivista.',
      degrees: ['Doutora em Filosofia (USP)'],
      researchTopics: ['Estética', 'Teoria Crítica'],
      links: {
        lattes: 'http://lattes.cnpq.br/12345',
        github: 'https://github.com/mariadasilva',
      },
    };

    const parsed = authorSchema.safeParse(validAuthor);
    expect(parsed.success).toBe(true);
  });

  it('provides dedicated markdown file for Geraldo Homero do Couto Neto matching schema', () => {
    const authorFilePath = path.resolve(
      process.cwd(),
      'src/content/authors/geraldo-homero-do-couto-neto.md'
    );
    expect(fs.existsSync(authorFilePath)).toBe(true);

    const fileContent = fs.readFileSync(authorFilePath, 'utf-8');
    const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---/);
    expect(frontmatterMatch).toBeTruthy();
    const data = YAML.parse(frontmatterMatch![1]);

    const parsed = collections.authors.schema.safeParse(data);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe('Geraldo Homero do Couto Neto');
      expect(parsed.data.degrees.length).toBeGreaterThan(0);
      expect(parsed.data.researchTopics.length).toBeGreaterThan(0);
    }
  });

  it('renders author template with markdown body content support in autor/[slug].astro', () => {
    const templatePath = path.resolve(process.cwd(), 'src/pages/autor/[slug].astro');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    expect(templateContent).toContain('author.render');
    expect(templateContent).toContain('<Content />');
  });
});
