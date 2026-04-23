import React from "react";

export default function QRCodeDisplay({ qrUrl, successMessage, hashId }) {
  const cardUrl = `${window.location.origin}/card/?hashId=${hashId}`;

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <p style={{ color: 'white' }}>{successMessage}</p>
      <h4 style={{ marginBottom: 8, color: 'white' }}>Your QR (scan to open)</h4>
      <img
        src={qrUrl}
        alt="QR Code"
        style={{
          width: 200,
          height: 200,
          display: 'block',
          margin: '0 auto',
          background: 'white',
          padding: 8,
          borderRadius: 8,
        }}
      />
      <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <a
          href={qrUrl}
          download={`card-${Date.now()}.png`}
          className="button analytics w-inline-block"
          style={{ textDecoration: 'none' }}
        >
          <div className="text-size-intermediate text-color-white btn">
            Download QR
          </div>
        </a>
        <button
          className="button analytics w-inline-block"
          onClick={() => navigator.clipboard.writeText(cardUrl)}
        >
          <div className="text-size-intermediate text-color-white btn">
            Copy URL
          </div>
        </button>
      </div>
    </div>
  );
}
