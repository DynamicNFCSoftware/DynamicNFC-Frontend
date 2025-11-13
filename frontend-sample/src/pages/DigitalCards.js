import React from 'react';
import { Link } from 'react-router-dom';

export default function DigitalCards(){
  return (
    <div className="home-hero">
      <div className="home-inner">
        <h1>Digital Cards</h1>
        <p>Manage your digital cards here. (Dummy content)</p>
        <Link to="/create-my-card" className="primary">Create a Digital Card</Link>
      </div>
    </div>
  )
}
