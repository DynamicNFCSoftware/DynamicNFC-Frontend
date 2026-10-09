import { describe, it, expect } from 'vitest';
import { common } from '../common';

// Every *Translations.js file exports objects keyed by language.
// Italian, French and Spanish must carry exactly the same keys.
const modules = import.meta.glob('../../**/*Translations.js', { eager: true });
const keys = (o) => Object.keys(o).sort();

describe('translation key parity', () => {
  it('common.js has the same keys in all five languages', () => {
    for (const l of ['it', 'fr', 'es', 'ar']) expect(keys(common[l]), l).toEqual(keys(common.en));
  });

  for (const [file, mod] of Object.entries(modules)) {
    for (const [name, tr] of Object.entries(mod)) {
      if (!tr?.it || !tr?.fr || !tr?.es) continue;
      it(`${file} · ${name}`, () => {
        expect(keys(tr.fr), 'fr').toEqual(keys(tr.it));
        expect(keys(tr.es), 'es').toEqual(keys(tr.it));
      });
    }
  }
});
