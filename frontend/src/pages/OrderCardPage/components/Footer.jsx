import React from 'react';

export function Footer({ t }) {
  return (
    <footer className="oc-footer">
      <div className="oc-footer-inner">
        <div className="oc-footer-brand">
          <a href="/" className="oc-logo">
            <img src="/assets/images/logo.png" alt="DynamicNFC" style={{height:'52px',width:'auto'}} />
          </a>
        </div>
        <div className="oc-footer-cols">
          <div className="oc-footer-col">
            <h5>{t('footProduct')}</h5>
            <a href="/enterprise">{t('footEnterprise')}</a>
            <a href="/nfc-cards">{t('footNfcCards')}</a>
            <a href="/order-card">{t('footOrderCard')}</a>
          </div>
          <div className="oc-footer-col">
            <h5>{t('footAccount')}</h5>
            <a href="/create-card">{t('footCreateCard')}</a>
            <a href="/login">{t('footLogin')}</a>
            <a href="/login">{t('footSignup')}</a>
          </div>
        </div>
      </div>
      <div className="oc-footer-bottom">
        <p>{t('footCopy')}</p>
      </div>
    </footer>
  );
}
