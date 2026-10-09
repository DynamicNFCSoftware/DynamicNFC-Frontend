// Stops a deploy when the build output is missing or far too small.
// Background: the live site was overwritten twice by a one-file deploy (2026-09-09, 2026-10-06).
import { existsSync, readdirSync } from 'node:fs';

const dist = 'frontend/dist';
const assets = existsSync(`${dist}/assets`) ? readdirSync(`${dist}/assets`).length : 0;

if (!existsSync(`${dist}/index.html`) || assets < 50) {
  console.error(`Deploy stopped: ${dist} looks wrong (index.html missing, or only ${assets} asset files).`);
  process.exit(1);
}
