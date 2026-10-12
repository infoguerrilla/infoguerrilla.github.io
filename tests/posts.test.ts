import { describe, it, expect } from 'vitest';
import { formatPostDate, calculateReadingTime, normalizeSlug } from '../src/utils/posts';

describe('Post Utilities', () => {
  it('formats dates into [YYYY.MM.DD] typewriter style', () => {
    const d = new Date('2025-04-19T00:00:00Z');
    expect(formatPostDate(d)).toBe('[2025.04.19]');
  });

  it('calculates realistic reading time', () => {
    const text = new Array(400).fill('palavra').join(' ');
    expect(calculateReadingTime(text)).toBe(2);
  });

  it('normalizes slugs preserving URL safety', () => {
    expect(normalizeSlug('Software-Livre-Open-source-Privacidade-Segurança'))
      .toBe('software-livre-open-source-privacidade-seguranca');
  });
});
