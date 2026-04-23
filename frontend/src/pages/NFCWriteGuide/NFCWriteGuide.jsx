import { useState } from 'react';
import './NFCWriteGuide.css';

const STEPS = [
  {
    id: 1,
    title: 'Get Your NFC Card',
    desc: 'Use any NTAG213, NTAG215, or NTAG216 NFC card or sticker. These are the most compatible with all smartphones.',
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z',
    tips: ['NTAG215 is the most popular — 504 bytes storage', 'Avoid MIFARE Classic — not supported by iPhone', 'Cards, stickers, and wristbands all work'],
  },
  {
    id: 2,
    title: 'Install an NFC Writer App',
    desc: 'Download a free NFC writing app on your phone to program the card with your DynamicNFC URL.',
    icon: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
    tips: ['Android: NFC Tools (free on Play Store)', 'iPhone: NFC Tools or Simply NFC', 'Both apps have a simple "Write" feature'],
  },
  {
    id: 3,
    title: 'Copy Your Card URL',
    desc: 'Go to your DynamicNFC dashboard and copy the unique URL for your digital card.',
    icon: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    tips: ['Your URL format: dynamicnfc.ca/c/YOUR_CARD_ID', 'This URL is dynamic — change your card anytime', 'One URL works for both iPhone and Android'],
  },
  {
    id: 4,
    title: 'Write the URL to Your Card',
    desc: 'Open the NFC writer app, select "Write URL", paste your link, then hold the card to the back of your phone.',
    icon: 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z',
    tips: ['Hold the card flat against your phone\'s NFC reader', 'Keep still for 2-3 seconds until you see "Write successful"', 'The NFC reader is usually in the upper-back area of the phone'],
  },
  {
    id: 5,
    title: 'Test Your Card',
    desc: 'Tap the programmed card on any smartphone. It should open your DynamicNFC digital card instantly.',
    icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
    tips: ['iPhone: Hold near the top edge of the phone', 'Android: Hold near the center-back of the phone', 'No app needed to read — just tap and go'],
  },
];

const FAQ = [
  { q: 'How many times can I rewrite an NFC card?', a: 'Standard NTAG cards can be rewritten over 100,000 times. You can update the URL as often as you like.' },
  { q: 'Will it work with all phones?', a: 'All iPhones from iPhone 7 onwards and virtually all Android phones with NFC support can read NTAG cards.' },
  { q: 'Can I lock the card after writing?', a: 'Yes, most NFC apps offer a "Lock" option. But be careful — locked cards cannot be rewritten. We recommend keeping it unlocked so you can update it.' },
  { q: 'What\'s the tap range?', a: 'NFC works within 1-4 cm. The card needs to be very close to the phone — just a quick tap.' },
  { q: 'Do I need an internet connection to tap?', a: 'You need internet to load the card page after tapping, but the NFC tap itself works without internet.' },
];

export default function NFCWriteGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  const step = STEPS.find(s => s.id === activeStep);

  return (
    <div className="nwg-page">
      <div className="nwg-header">
        <h1 className="nwg-title">How to Write Your NFC Card</h1>
        <p className="nwg-subtitle">Program any NFC card with your DynamicNFC digital card in 5 simple steps.</p>
      </div>

      {/* Progress Bar */}
      <div className="nwg-progress">
        {STEPS.map(s => (
          <button
            key={s.id}
            className={`nwg-step-dot ${s.id === activeStep ? 'active' : ''} ${s.id < activeStep ? 'done' : ''}`}
            onClick={() => setActiveStep(s.id)}
          >
            <span className="nwg-dot-num">{s.id}</span>
            <span className="nwg-dot-label">{s.title}</span>
          </button>
        ))}
        <div className="nwg-progress-bar">
          <div className="nwg-progress-fill" style={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Active Step Card */}
      {step && (
        <div className="nwg-card" key={step.id}>
          <div className="nwg-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d={step.icon} /></svg>
          </div>
          <h2 className="nwg-card-title">Step {step.id}: {step.title}</h2>
          <p className="nwg-card-desc">{step.desc}</p>
          <div className="nwg-tips">
            <span className="nwg-tips-label">Tips</span>
            {step.tips.map((tip, i) => (
              <div key={i} className="nwg-tip">{tip}</div>
            ))}
          </div>
          <div className="nwg-nav">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(p => p - 1)}
              className="nwg-btn nwg-btn-secondary"
            >
              Previous
            </button>
            <button
              disabled={activeStep === STEPS.length}
              onClick={() => setActiveStep(p => p + 1)}
              className="nwg-btn nwg-btn-primary"
            >
              {activeStep === STEPS.length ? 'Done' : 'Next Step'}
            </button>
          </div>
        </div>
      )}

      {/* Compatibility */}
      <div className="nwg-section">
        <h3 className="nwg-section-title">Compatible NFC Tags</h3>
        <div className="nwg-compat-grid">
          {[
            { name: 'NTAG213', bytes: '144', note: 'Short URLs only' },
            { name: 'NTAG215', bytes: '504', note: 'Recommended' },
            { name: 'NTAG216', bytes: '888', note: 'Long URLs + data' },
          ].map(t => (
            <div key={t.name} className={`nwg-compat-card ${t.note === 'Recommended' ? 'recommended' : ''}`}>
              <div className="nwg-compat-name">{t.name}</div>
              <div className="nwg-compat-bytes">{t.bytes} bytes</div>
              <div className="nwg-compat-note">{t.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="nwg-section">
        <h3 className="nwg-section-title">Frequently Asked Questions</h3>
        <div className="nwg-faq-list">
          {FAQ.map((f, i) => (
            <div key={i} className={`nwg-faq ${openFaq === i ? 'open' : ''}`}>
              <button className="nwg-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="nwg-faq-arrow">{openFaq === i ? '\u2212' : '+'}</span>
              </button>
              {openFaq === i && <div className="nwg-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
