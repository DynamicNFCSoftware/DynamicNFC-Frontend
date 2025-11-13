import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NfcBusinessCard(){
  const navigate = useNavigate();
  const [selected, setSelected] = useState('infinite');

  function onOrder(e){
    const plan = e?.currentTarget?.dataset?.plan || selected || 'essential';
    navigate(`/order-card?plan=${encodeURIComponent(plan)}`);
  }

  function selectPlan(plan){
    setSelected(plan);
  }

  return (
    <div className="container" style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start' }}>
        <div>
          <h1>Smart NFC Business Card</h1>
          <p style={{ fontSize: 18, color: '#333' }}>A modern NFC-enabled business card that shares your dynamic profile with a tap.</p>

          <section style={{ marginTop: 18 }}>
            <h3>How it works</h3>
            <ul>
              <li>Tap the card with a phone to open your profile</li>
              <li>Works on iOS & Android without an app</li>
              <li>Reusable & updateable — change content anytime</li>
            </ul>
          </section>

          <section style={{ marginTop: 18 }}>
            <h3>Design examples</h3>
            <div className="card-samples">
              <img src="/images/EssentialCard.jpeg" alt="essential card" />
              <img src="/images/infiniteCard.jpg" alt="infinite card" />
              <img src="/images/customCard.gif" alt="custom card" />
            </div>
          </section>

          <div style={{ marginTop: 24 }}>
            <div className="plans">
              <div className={`plan-card ${selected === 'essential' ? 'selected' : ''}`} onClick={() => selectPlan('essential')}>
                <div className="plan-header">Essential</div>
                <div className="plan-thumb"><img src="/images/EssentialCard.jpeg" alt="essential"/></div>
                <div className="plan-price">$29</div>
                <ul className="plan-features">
                  <li>Single NFC card</li>
                  <li>Standard printing</li>
                  <li>1 URL programmed</li>
                </ul>
                <button className="btn plan-choose" data-plan="essential" onClick={onOrder}>Order Essential</button>
              </div>

              <div className={`plan-card plan-highlight ${selected === 'infinite' ? 'selected' : ''}`} onClick={() => selectPlan('infinite')}>
                <div className="plan-header">Infinite</div>
                <div className="plan-thumb"><img src="/images/infiniteCard.jpg" alt="infinite"/></div>
                <div className="plan-price">$59</div>
                <ul className="plan-features">
                  <li>Premium finish</li>
                  <li>Unlimited URL edits</li>
                  <li>Priority support</li>
                </ul>
                <button className="btn plan-choose" data-plan="infinite" onClick={onOrder}>Order Infinite</button>
              </div>

              <div className={`plan-card ${selected === 'custom' ? 'selected' : ''}`} onClick={() => selectPlan('custom')}>
                <div className="plan-header">Custom</div>
                <div className="plan-thumb"><img src="/images/customCard.gif" alt="custom"/></div>
                <div className="plan-price">Contact</div>
                <ul className="plan-features">
                  <li>Custom design</li>
                  <li>Team discounts</li>
                  <li>Dedicated onboarding</li>
                </ul>
                <button className="btn plan-choose" data-plan="custom" onClick={onOrder}>Request Custom</button>
              </div>
            </div>
          </div>
        </div>

        <aside style={{ padding: 18, background: '#fff', borderRadius: 10 }}>
          <h4>Pricing</h4>
          <p>Starting at $29 for a single card. Discounts for teams.</p>
          <Link to="/order-card" className="primary">Request a card</Link>
        </aside>
      </div>
    </div>
  );
}
