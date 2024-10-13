import { ThemeEntity } from '$lib/theme.entity.js';
import { describe, expect, test } from 'vitest';

describe('theme.entity', () => {
  test('css variable test', () => {
    const theme = new ThemeEntity('svt', 'button', 'hover', {
      color: 'white',
      backgroundColor: 'red'
    });
    const cssvar = theme.mergeVariables();
    console.log(cssvar);
    expect(cssvar.indexOf('--svt-button-hover-color')).toBe(0);
    expect(cssvar.includes('--svt-button-hover-background-color')).toBe(true);
  });
});
