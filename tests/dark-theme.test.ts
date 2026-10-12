import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Dark Mode Grayish Palette Specification', () => {
  it('uses softer, grayish charcoal tones instead of pitch-black in global.css', () => {
    const cssPath = path.resolve(process.cwd(), 'src/styles/global.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    const darkBlockMatch = cssContent.match(/\[data-theme="dark"\]\s*\{([^}]+)\}/);
    expect(darkBlockMatch).toBeTruthy();

    const darkVars = darkBlockMatch![1];

    // Must NOT use the old pitch-black values
    expect(darkVars).not.toContain('#111215');
    expect(darkVars).not.toContain('#191B20');

    // Must use grayish dark tones for canvas and surface
    expect(darkVars).toMatch(/--color-canvas:\s*#(?:1e2025|202227|22252a)/i);
    expect(darkVars).toMatch(/--color-surface:\s*#(?:282b32|2b2e35|2c2f36)/i);
    expect(darkVars).toMatch(/--color-border:\s*#(?:3e424e|424652|3d414c)/i);
  });
});
