import { describe, expect, it } from 'vitest';
import { checkContrast } from '../src/tools/check-contrast.js';

describe('checkContrast', () => {
  it('returns the correct contrast ratio for black on white', () => {
    const contrast = checkContrast('#000000', '#ffffff');

    expect(contrast.ratio).toBe(21);
    expect(contrast.passesAA).toBe(true);
    expect(contrast.passesAAA).toBe(true);
  });

  it('flags low contrast values', () => {
    const contrast = checkContrast('#777777', '#ffffff');

    expect(contrast.passesAA).toBe(false);
    expect(contrast.passesAAA).toBe(false);
  });

  it('rejects alpha colors because they need background compositing', () => {
    expect(() => checkContrast('#00000080', '#ffffff')).toThrow('valid hex values');
  });
});
