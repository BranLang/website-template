import * as en from '../../src/assets/i18n/en.json';
import * as sk from '../../src/assets/i18n/sk.json';

function getKeys(obj: any, prefix = ''): string[] {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      acc.push(...getKeys(obj[key], pre + key));
    } else {
      acc.push(pre + key);
    }
    return acc;
  }, [] as string[]);
}

describe('i18n Translation Files', () => {
  const enKeys = getKeys(en);
  const skKeys = getKeys(sk);

  it('should have the same keys in English and Slovak files', () => {
    const enSet = new Set(enKeys);
    const skSet = new Set(skKeys);

    const missingInSk = enKeys.filter(k => !skSet.has(k));
    const missingInEn = skKeys.filter(k => !enSet.has(k));

    expect(missingInSk).withContext('Keys missing in sk.json').toEqual([]);
    expect(missingInEn).withContext('Keys missing in en.json').toEqual([]);
  });
});
