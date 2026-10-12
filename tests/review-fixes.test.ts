import { describe, it, expect } from 'vitest';
import { normalizeSlug } from '../src/utils/posts';
import { shouldDisableTilt } from '../src/scripts/tilt';

describe('Review Fixes Verification', () => {
  it('detects touch/coarse devices to disable tilt', () => {
    expect(shouldDisableTilt(true, false, false)).toBe(true); // prefers-reduced-motion
    expect(shouldDisableTilt(false, true, true)).toBe(true);  // pointer: coarse
    expect(shouldDisableTilt(false, false, false)).toBe(true); // hover: none
    expect(shouldDisableTilt(false, false, true)).toBe(false); // desktop fine pointer with hover
  });

  it('normalizes slugs preserving case-insensitive and accent-free forms', () => {
    const raw = 'Software-Livre-Open-source-Privacidade-Segurança';
    expect(normalizeSlug(raw)).toBe('software-livre-open-source-privacidade-seguranca');
  });

  it('correctly handles root path normalization for navigation highlight', () => {
    const normalizeNavPath = (path: string) => path.replace(/\/$/, "") || "/";
    expect(normalizeNavPath("/")).toBe("/");
    expect(normalizeNavPath("/arquivo/")).toBe("/arquivo");
  });
});
