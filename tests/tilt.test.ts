import { describe, it, expect } from 'vitest';
import { calculateTiltAngles } from '../src/scripts/tilt';

describe('Tilt Calculation', () => {
  it('returns (0, 0) at the exact center of element', () => {
    const angles = calculateTiltAngles(100, 100, 200, 200, 6);
    expect(angles.rotateX).toBeCloseTo(0);
    expect(angles.rotateY).toBeCloseTo(0);
  });

  it('clamps rotation within maximum degrees at corners', () => {
    const angles = calculateTiltAngles(0, 0, 200, 200, 6);
    expect(Math.abs(angles.rotateX)).toBeLessThanOrEqual(6);
    expect(Math.abs(angles.rotateY)).toBeLessThanOrEqual(6);
  });
});

