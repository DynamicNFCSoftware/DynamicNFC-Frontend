import { describe, it, expect } from 'vitest';
import { common } from '../common';
import { getRegistry } from '../index';
import '../portals/dashboard';
import '../portals/fiveMinuteProof';
import '../eventDisplayMap';
import '../../pages/UnifiedDashboard/tabs/campaignsTab.i18n';
import { UI as campaignsUI } from '../../pages/UnifiedDashboard/tabs/campaignsTab.i18n';
import { getAvailableSectors, getSectorConfig } from '../../config/sectorConfig';

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

// Dashboard `fr` blocks are sometimes a partial slice of `en` (sales triggers only).
// `it` keeps every `fr` key and every `en` key, so Italian does not fall back to English.
function assertItalianCovers(node, path, errors) {
  if (!node || typeof node !== 'object') return;
  if (Object.prototype.hasOwnProperty.call(node, 'fr')) {
    if (!Object.prototype.hasOwnProperty.call(node, 'it')) errors.push(`${path} missing it`);
    else if (node.fr && typeof node.fr === 'object' && typeof node.it === 'object') {
      for (const key of Object.keys(node.fr)) {
        if (!Object.prototype.hasOwnProperty.call(node.it, key)) errors.push(`${path}.it missing ${key}`);
      }
    }
    if (node.en && node.it && typeof node.en === 'object' && typeof node.it === 'object') {
      for (const key of Object.keys(node.en)) {
        if (!Object.prototype.hasOwnProperty.call(node.it, key)) errors.push(`${path}.it missing en key ${key}`);
      }
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === 'object') assertItalianCovers(value, `${path}.${key}`, errors);
  }
}

describe('dashboard Italian covers French', () => {
  const registered = ['dashboard', 'todaysBrief', 'salesVelocity', 'fiveMinuteProof', 'eventDisplay'];

  it('registered dashboard modules carry every fr key and every en key in it', () => {
    const registry = getRegistry();
    const errors = [];
    for (const name of registered) assertItalianCovers(registry[name], name, errors);
    assertItalianCovers(campaignsUI, 'campaignsUI', errors);
    expect(errors).toEqual([]);
  });

  it('every sectorConfig object that holds fr also holds it', () => {
    const errors = [];
    for (const sector of getAvailableSectors()) {
      assertItalianCovers(getSectorConfig(sector.id), sector.id, errors);
    }
    expect(errors).toEqual([]);
  });
});
