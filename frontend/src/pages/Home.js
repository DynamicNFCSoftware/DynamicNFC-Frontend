import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-hero">
      <div className="home-inner">
        <h1>Make your dynamic digital card</h1>
        <p>Create a professional digital business card in seconds — share anywhere.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/create-my-card" className="primary">Create My Card</Link>
          <Link to="/nfc-business-card" className="primary" style={{ background: '#00a86b' }}>Order my card</Link>
        </div>
      </div>
    </div>
  );
}
