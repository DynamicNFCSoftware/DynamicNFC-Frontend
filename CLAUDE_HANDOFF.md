# CLAUDE_HANDOFF.md — DynamicNFC

**Last updated:** 2026-11-03 · **Repo:** `C:\Users\oguzh\DynamicNFC\`
This file is a snapshot, not a log. Three sections only. When `Last 5 changes` overflows, the oldest line moves to `docs/handoff-archive/` (or, if it is a lesson, to `memory/feedback_*.md`). Stable facts live in `memory/` — read `memory/MEMORY.md` first.

## Deployed

- **Live:** https://dynamicnfc.ca · last deploy 2026-10-27 22:41 Berlin — PR #38 About page (merge `1dd8b96`) via `deploy.yml` (Deploy hosting run green, live check requires `<title>DynamicNFC`)
- **`main`:** protected (`protect-main`); merge = deploy. Merge method "Create a merge commit" only. Confirm head with `git log -3` before building on it.
- **Branch `feat/product-front-door`:** merged with `main` 2026-10-27, Oguzhan's logged-in QA PASS 2026-10-28 (login → `/unified`, `/my-card`, `/dashboard` → `/my-card`, tour, logout). **Status to confirm: has it been merged into `main` as a PR yet?** If not, that is the next merge.
- **Functions:** 9 deployed, Node 22, us-central1 — unchanged (CLAUDE.md §9). Firestore rules PRs #32/#33 merged 2026-10-17.
- **Local preview:** `npm run preview -- --port 5173` (browser API key blocks 4173 → Login "Network error").
- **Old SA `github-action-1063756147`:** all roles removed 2026-10-27; Google-managed key expired 2026-10-31. Delete the account now if nothing broke.

## In flight

Priority order (Decision framework: revenue-blocking → live bugs → sales enablement → debt → features):

1. **Front-door PR to `main`** (if not merged — see Deployed). Then: CLAUDE.md §6 routes table needs `/my-card`, `/about`, `/dashboard` redirect.
2. **Sales-led pricing** — directive revised 2026-10-19, verified against `main` `3b4df215`, ready for Cursor. Decisions baked in: signup stays open, footer link, no public prices, Starter removed, Pro + Enterprise, card listed as included.
3. **Italy → North American buyers:** step 1 is in `main` (PR #26) but its read-only audit `docs/directives/CURSOR_AUDIT_ITALY_NA_BUYERS_STEP1.md` was **never run** → run it. Step 2: Italy demo portal tells the NA-buyer story (currency EUR only vs EUR + USD/CAD — undecided). Step 3: ~80 Gulf mentions on Enterprise / RealEstate / Developers / card builder, page by page.
4. **CLAUDE.md drift:** §3/§12 still describe 5 visible regions and Arabic in the public selector; decision 2026-10-11 is **Canada, Italy, USA visible; Mexico + Gulf hidden (not deleted), Arabic hidden with them** (`memory/project_decisions_2026_10.md`). Update §3, §10 i18n, §12 together with step 3.
5. **B3 — demo portals in Italian:** raw codes in activity feed, AI-demo Gulf fallbacks, tutorial persona per sector, AED leftovers, Italian car images.
6. **Open with Oguzhan / lawyer:** privacy + terms (Art. 27 EU rep, postal address, DPA template, governing law, CASL for emailing Canadian buyers, "run by our Canadian company" wording) · native Italian review · "A/B testing" claim on Automotive/Enterprise · Enterprise → Yacht tab raw keys `prob2Desc_yacht` / `prob3Desc_yacht`.
7. **Repo tidy:** untracked `Claude outputs/`, `frontend/directives/` → `docs/directives/`, `functions/package-lock.json`; branch `backup-local-main` deletable; `docs/CLAUDE.proposed.md` — merge or drop.
8. Tech debt: CLAUDE.md §14.

## Last 5 changes

- **2026-11-03 (Claude/Cowork)** — Memory system restructured: HANDOFF → snapshot, 1945-line history → `docs/handoff-archive/2026-05_2026-10.md`, front matter on `memory/*.md`, CLAUDE.md §2 memory discipline added.
- **2026-10-27 (Claude + Cursor)** — `/about` live (PR #38, prefix `ab-`, 13 team cards, it/fr/es in `aboutTranslations.js`). Team and legal facts per Oguzhan in `memory/project_decisions_2026_10.md`. Audit caught a Navbar overflow 901–1120 px in it/fr/es that Cursor's EN-only check missed → hamburger breakpoint 1199px. **Lesson filed:** `memory/feedback_mutual_audit.md`.
- **2026-10-27 (Claude)** — Deploy incident 2026-10-24 closed: rollback to `35bb31`, `scripts/guard-project.cjs` + `predeploy` guard (PR #36, #37), CI SA got `serviceusage.serviceUsageConsumer`. Rule: no deploy / no merge without Oguzhan's local review. Details: `memory/feedback_deploy_rule.md` + archive.
- **2026-10-27 (Claude)** — `feat/product-front-door` merged with `main`; two post-merge fixes (`1c514b6` signed-in Navbar overflow; `f82a8dc` onboarding tour leaked onto `/unified`). Login → `/unified`; card → standalone `/my-card` (`mc-`); `/dashboard` → redirect.
- **2026-10-17 (Cursor + Claude)** — `/yacht` landing (PR #31), privacy FAQ wording lawyer-approved (PR #30), Home defect pass (PR #29), Firestore rules (PR #32, #33), sitemap extracted (`docs/SITEMAP_2026_10_17.md`, 54 routes).

Earlier history (Sprints A–D, FAZ 5, Phase 2b/2c, Step A/B Italy, FMP video, incidents 2026-09-18 and 2026-10-24): `docs/handoff-archive/2026-05_2026-10.md`.
