import React from 'react';

export function StatsBar({ t }) {
  return (
    <div className="oc-stats">
      <div className="oc-stat">
        <span className="oc-stat-val">12+</span>
        <span className="oc-stat-lbl">{t('statsCards')}</span>
      </div>
      <div className="oc-stat-sep" />
      <div className="oc-stat">
        <span className="oc-stat-val">40+</span>
        <span className="oc-stat-lbl">{t('statsCountries')}</span>
      </div>
      <div className="oc-stat-sep" />
      <div className="oc-stat">
        <span className="oc-stat-val">&lt; 1s</span>
        <span className="oc-stat-lbl">{t('statsTap')}</span>
      </div>
    </div>
  );
}
