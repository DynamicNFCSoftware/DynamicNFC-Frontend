import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CardFlip({ frontImage, backImage, flipHint }) {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="oc-card-showcase">
      <div className="oc-card-float">
        <div className="oc-card-shadow" />
        <div
          className={`oc-flip-container${flipped ? ' flipped' : ''}`}
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onClick={() => navigate('/create-physical-card')}
          style={{ cursor: 'pointer' }}
        >
          <div className="oc-flip-inner">
            <div className="oc-flip-face oc-flip-front">
              <img src={frontImage} alt="DynamicNFC Card Front" className="oc-card-img" />
            </div>
            <div className="oc-flip-face oc-flip-back">
              <img src={backImage} alt="DynamicNFC Card Back" className="oc-card-img" />
            </div>
          </div>
        </div>
        <div className="oc-flip-hint">{flipHint}</div>
      </div>
    </div>
  );
}