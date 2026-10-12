import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Mobile Header Responsiveness & Theme Toggle Placement', () => {
  it('hides ThemeToggle from top bar on mobile and places it inside hamburger menu panel', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    // O alternador no topo deve estar oculto em mobile (visível apenas em md+)
    expect(headerContent).toMatch(/hidden\s+md:(?:block|flex|inline-flex)[\s\S]*?<ThemeToggle/);

    // O painel mobile deve conter o ThemeToggle
    const mobilePanelMatch = headerContent.match(/id="mobile-menu-panel"[\s\S]*?<\/div>\s*<\/div>/);
    expect(mobilePanelMatch).toBeTruthy();
    expect(mobilePanelMatch![0]).toContain('<ThemeToggle');
  });

  it('supports multiple theme toggle instances in ThemeToggle.astro via data-theme-toggle', () => {
    const themeTogglePath = path.resolve(process.cwd(), 'src/components/ThemeToggle.astro');
    const toggleContent = fs.readFileSync(themeTogglePath, 'utf-8');

    expect(toggleContent).toContain('data-theme-toggle');
    expect(toggleContent).toMatch(/querySelectorAll.*data-theme-toggle/);
  });

  it('uses shrink-0 and min-w-0 on header brand to prevent mobile viewport blowout', () => {
    const headerPath = path.resolve(process.cwd(), 'src/components/Header.astro');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');

    expect(headerContent).toContain('min-w-0');
    expect(headerContent).toContain('shrink-0');
  });
});
