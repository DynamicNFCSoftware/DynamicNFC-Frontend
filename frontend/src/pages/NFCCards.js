import React from 'react';
import { Link } from 'react-router-dom';

export default function NFCCards(){
  return (
    <div className="home-hero">
      <div className="home-inner">
        <h1>NFC Cards</h1>
        <p>Manage your NFC cards here. (Dummy content)</p>
        <Link to="/create-my-card" className="primary">Create an NFC Card</Link>
      </div>
    </div>
  )
}
