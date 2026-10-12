import { describe, it, expect } from 'vitest';
import pkg from '../package.json';

describe('Project Configuration', () => {
  it('should have required scripts defined', () => {
    expect(pkg.scripts.build).toContain('astro build');
    expect(pkg.scripts.dev).toBe('astro dev');
    expect(pkg.scripts.test).toBe('vitest run');
  });
});
