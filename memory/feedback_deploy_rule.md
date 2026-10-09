# Standing rule — hosting deploys (Oguzhan, 2026-10-06)

- Deploy hosting **only** with `npm run deploy` from `C:\Users\oguzh\DynamicNFC`. It builds, checks the build output, then deploys with the project named explicitly.
- Never type `firebase deploy` by hand, and never from another folder.
- Second allowed route (decided 2026-10-07): the GitHub workflow `deploy.yml`, which deploys from `main` after lint, build, tests, browser tests and the build-output check, then confirms the live site. ON since 2026-10-08 (first run deployed PR #19). Merging a PR into `main` = a deploy.
- Why: a stray `firebase.json` + `.firebaserc` in `C:\Users\oguzh` deployed a one-file `dist` over dynamicnfc.ca twice (2026-09-09, unnoticed for nine days; 2026-10-06, fixed within minutes).
- After any hosting deploy: open dynamicnfc.ca and confirm the real site loads. "Deploy complete!" is not proof.
- First move if the live site is wrong: Firebase Console → Hosting → Release history → roll back.
- `main` is protected (ruleset `protect-main`, 2026-10-08): every change goes through a PR with a green `CI / build-and-test` check. Merge with "Create a merge commit" only — a squash merge made local `main` diverge once.
- No workflow may push to `main` directly (it will be rejected); write reports to the job summary or an artifact instead.
