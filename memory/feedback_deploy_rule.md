# Standing rule — hosting deploys (Oguzhan, 2026-10-06)

- Deploy hosting **only** with `npm run deploy` from `C:\Users\oguzh\DynamicNFC`. It builds, checks the build output, then deploys with the project named explicitly.
- Never type `firebase deploy` by hand, and never from another folder.
- Second allowed route (decided 2026-10-07): the GitHub workflow `deploy.yml`, which deploys from `main` after lint, build, tests, browser tests and the build-output check, then confirms the live site. Off until set up per `docs/CI_DEPLOY_SETUP.md`.
- Why: a stray `firebase.json` + `.firebaserc` in `C:\Users\oguzh` deployed a one-file `dist` over dynamicnfc.ca twice (2026-09-09, unnoticed for nine days; 2026-10-06, fixed within minutes).
- After any hosting deploy: open dynamicnfc.ca and confirm the real site loads. "Deploy complete!" is not proof.
- First move if the live site is wrong: Firebase Console → Hosting → Release history → roll back.
