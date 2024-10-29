import { UIHelper } from '$lib/helper.js';
import { describe, test, expect } from 'vitest';

describe('helper.ts', () => {
  test('16rem => [16, "rem"]', () => {
    const [size, unit] = UIHelper.parseSizeUnit('16rem');
    expect(size).toBe(16);
    expect(unit).toBe('rem');
  });
  test('16 => [16, "px"]', () => {
    const [size, unit] = UIHelper.parseSizeUnit('16');
    expect(size).toBe(16);
    expect(unit).toBe('px');
  });
});
