import { describe, it, expect } from 'vitest';
import { getSectorConfig, calculateLeadScore, getLeadTemperature, mapEvent } from '../sectorConfig';

describe('sectorConfig', () => {
  it('returns real estate config by default', () => {
    const config = getSectorConfig('real_estate');
    expect(config.id).toBe('real_estate');
    expect(config.identity.defaultProject.name.en).toBe('Al Noor Residences');
  });

  it('returns automotive config', () => {
    const config = getSectorConfig('automotive');
    expect(config.id).toBe('automotive');
    expect(config.identity.defaultProject.name.en).toBe('Prestige Motors');
  });

  it('calculates lead score correctly', () => {
    const events = [
      { type: 'portal_opened' },
      { type: 'view_unit' },
      { type: 'request_pricing' },
    ];
    const score = calculateLeadScore(events, 'real_estate');
    // 5 + 10 + 15 = 30
    expect(score).toBe(30);
  });

  it('caps score at maxScore', () => {
    const events = Array(20).fill({ type: 'book_viewing' }); // 20 × 25 = 500
    const score = calculateLeadScore(events, 'real_estate');
    expect(score).toBe(100);
  });

  it('returns correct temperature', () => {
    const hot = getLeadTemperature(75, 'real_estate', 'en');
    expect(hot.level).toBe('hot');

    const warm = getLeadTemperature(50, 'real_estate', 'ar');
    expect(warm.level).toBe('warm');
    expect(warm.label).toBe('عميل دافئ');
  });

  it('maps events correctly per sector', () => {
    expect(mapEvent('booking', 'real_estate')).toBe('book_viewing');
    expect(mapEvent('booking', 'automotive')).toBe('test_drive_request');
  });
});
