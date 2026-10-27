// Stops a Firebase deploy that targets the wrong project (incident 2026-10-24).
const want = process.argv[2];
if (process.env.GCLOUD_PROJECT !== want) {
  console.error(`Blocked: this repo deploys only to ${want}, not ${process.env.GCLOUD_PROJECT}`);
  process.exit(1);
}
