import React from 'react';
import './Skeleton.css';

export default function PageSkeleton() {
  return (
    <div className="sk-page">
      <div className="sk-page-inner">
        {/* Hero skeleton */}
        <div className="sk-hero">
          <div className="sk-hero-text">
            <div className="sk-bone sk-badge" />
            <div className="sk-bone sk-title" />
            <div className="sk-bone sk-title-sm" />
            <div style={{ marginTop: '0.5rem' }}>
              <div className="sk-bone sk-paragraph" />
              <div className="sk-bone sk-paragraph-md" style={{ marginTop: '0.5rem' }} />
              <div className="sk-bone sk-paragraph-sm" style={{ marginTop: '0.5rem' }} />
            </div>
            <div className="sk-cta-row">
              <div className="sk-bone sk-btn" />
              <div className="sk-bone sk-btn-ghost" />
            </div>
          </div>
          <div className="sk-hero-visual">
            <div className="sk-bone sk-card-img" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="sk-stats">
          {[0, 1, 2, 3].map((i) => (
            <div className="sk-stat" key={i}>
              <div className="sk-bone sk-stat-num" />
              <div className="sk-bone sk-stat-label" />
            </div>
          ))}
        </div>

        {/* Section skeleton */}
        <div className="sk-section">
          <div className="sk-section-header">
            <div className="sk-bone sk-section-tag" />
            <div className="sk-bone sk-section-title" />
            <div className="sk-bone sk-section-sub" />
          </div>
          <div className="sk-grid">
            {[0, 1, 2].map((i) => (
              <div className="sk-grid-card" key={i}>
                <div className="sk-bone sk-grid-card-img" />
                <div className="sk-grid-card-body">
                  <div className="sk-bone sk-grid-card-title" />
                  <div className="sk-bone sk-grid-card-text" />
                  <div className="sk-bone sk-grid-card-text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
