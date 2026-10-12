import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Site-Wide Social Links Specification', () => {
  it('points Header and Footer social links to the Info_Guerrilla publication handles, not personal author accounts', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const footerPath = path.resolve(process.cwd(), 'src/components/Footer.astro');

    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    const footerContent = fs.readFileSync(footerPath, 'utf-8');

    // Neither header nor footer should reference personal author accounts
    expect(headerContent).not.toContain('geraldohomero');
    expect(footerContent).not.toContain('geraldohomero');
    expect(footerContent).not.toContain('orcid.org');
    expect(footerContent).not.toContain('lattes.cnpq.br');

    // Both should point to infoguerrilla
    expect(headerContent).toContain('github.com/infoguerrilla');
    expect(footerContent).toContain('github.com/infoguerrilla');
    expect(headerContent).toContain('bsky.app/profile/infoguerrilla');
    expect(footerContent).toContain('bsky.app/profile/infoguerrilla');
  });

  it('keeps author personal research accounts safely in author profile markdown', () => {
    const authorPath = path.resolve(process.cwd(), 'src/content/authors/geraldo-homero-do-couto-neto.md');
    const authorContent = fs.readFileSync(authorPath, 'utf-8');

    expect(authorContent).toContain('geraldohomero');
    expect(authorContent).toContain('orcid.org/0000-0001-6686-7182');
  });
});

