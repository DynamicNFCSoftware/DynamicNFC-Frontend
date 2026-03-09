import React from 'react';

export function Footer({ t }) {
  return (
    <footer className="oc-footer">
      <div className="oc-footer-inner">
        <div className="oc-footer-brand">
          <a href="#" className="oc-logo">
            Dynamic<span>NFC</span>
          </a>
        </div>
        <div className="oc-footer-cols">
          <div className="oc-footer-col">
            <h5>{t('footProduct')}</h5>
            <a href="#">{t('footEnterprise')}</a>
            <a href="#">{t('footNfcCards')}</a>
            <a href="#">{t('footOrderCard')}</a>
          </div>
          <div className="oc-footer-col">
            <h5>{t('footAccount')}</h5>
            <a href="#">{t('footCreateCard')}</a>
            <a href="#">{t('footLogin')}</a>
            <a href="#">{t('footSignup')}</a>
          </div>
        </div>
      </div>
      <div className="oc-footer-bottom">
        <p>{t('footCopy')}</p>
      </div>
    </footer>
  );
}
