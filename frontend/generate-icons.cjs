const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0f1118';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.15);
  ctx.fill();

  // "D" letter
  const fontSize = size * 0.45;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('D', size * 0.4, size * 0.5);

  // NFC waves (3 arcs in blue)
  ctx.strokeStyle = '#457b9d';
  ctx.lineWidth = size * 0.025;
  ctx.lineCap = 'round';

  const cx = size * 0.65;
  const cy = size * 0.45;

  for (let i = 1; i <= 3; i++) {
    const r = size * 0.08 * i;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }

  // Red dot
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename} (${size}x${size})`);
}

const dir = 'public/icons';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

generateIcon(192, `${dir}/icon-192.png`);
generateIcon(512, `${dir}/icon-512.png`);
console.log('Done!');
