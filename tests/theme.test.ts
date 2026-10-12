import { describe, it, expect } from 'vitest';
import { resolveInitialTheme } from '../src/utils/theme';

describe('Theme Resolution', () => {
  it('should prioritize stored preference if present', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark');
    expect(resolveInitialTheme('paper', true)).toBe('paper');
  });
  it('should fall back to system preference or paper mode', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('paper');
  });
});
