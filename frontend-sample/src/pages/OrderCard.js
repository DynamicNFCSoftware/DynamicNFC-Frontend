import React, { useState } from 'react';
import api from '../api';

export default function OrderCard(){
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', company: '', jobTitle: '', address: '', notes: ''
  });
  // read plan from querystring to prefill or display
  const params = new URLSearchParams(window.location.search);
  const planParam = params.get('plan') || '';
  const [selectedPlan] = useState(planParam);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function onChange(e){
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  }

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError(null);
    try{
      // send to backend endpoint
      const payload = { ...form, plan: selectedPlan };
      const resp = await api.post('/request-card', payload);
      setSent(true);
    }catch(err){
      console.error('send failed', err);
      setError(err?.response?.data || err.message || 'Send failed');
    }finally{ setLoading(false); }
  }

  if (sent) return (
    <div className="container">
      <div className="order-sent">
        <h2>Request sent</h2>
        <p>Thank you — we've received your request and will be in touch shortly.</p>
      </div>
    </div>
  );

  return (
    <div className="order-hero">
      <div className="container order-inner">
        <div className="order-left">
          <h1>Order your NFC business card</h1>
          <p className="lead">Design, personalize and order your NFC card. Submit your details below and we'll contact you to confirm the order.</p>

          <div className="order-features">
            <div className="feature">• Custom printed card</div>
            <div className="feature">• NFC chip programmed to your link</div>
            <div className="feature">• Bulk team ordering available</div>
          </div>
        </div>

        <div className="order-panel">
          <form onSubmit={onSubmit} className="order-form">
            <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full name" className="input" />
            <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="input" />
            <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" className="input" />
            <input name="company" value={form.company} onChange={onChange} placeholder="Company" className="input" />
            <input name="jobTitle" value={form.jobTitle} onChange={onChange} placeholder="Job title" className="input" />
            <input name="address" value={form.address} onChange={onChange} placeholder="Address" className="input" />
            <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Notes (optional)" className="input" style={{ minHeight: 100 }} />
            {selectedPlan && <div style={{ marginBottom: 8, fontWeight: 600 }}>Selected plan: {selectedPlan}</div>}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn order-cta" type="submit" disabled={loading}>Request Card</button>
              {error && <div style={{ color: '#c33' }}>{String(error)}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
