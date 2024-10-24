import util, { arr } from '$lib/util/index.js';
import { describe, test, expect } from 'vitest';

describe('util', () => {
  test('array', () => {
    const persons: { seq: number; gender: 'M' | 'F'; lang: string }[] = [
      { seq: 0, gender: 'F', lang: 'ko' },
      { seq: 1, gender: 'F', lang: 'ko' },
      { seq: 1, gender: 'F', lang: 'ja' },
      { seq: 2, gender: 'M', lang: 'en' },
      { seq: 2, gender: 'M', lang: 'en' }
    ];
    const groupGender = arr.partition(persons, (person) => person.gender);
    expect(groupGender.F.length).toBe(3);
    expect(groupGender.M.length).toBe(2);

    const groupLang = util.arr.partition(persons, (person) => person.lang);
    expect(groupLang.ko.length).toBe(2);
    expect(groupLang.ja.length).toBe(1);
    expect(groupLang.en.length).toBe(2);
  });
});
