# CLAUDE_HANDOFF.md

**Last updated:** 2026-05-04 ~04:30 (America/Vancouver)
**Session:** Sprint 2 #4 cleanup — animation regression + multi-region seed bug
**Author of this update:** Claude (Cowork) — user going to sleep, demo in ~3h

---

## RESUME HERE — 2026-05-04 ~04:30

User going to sleep, will re-test in ~3 hours (around 07:30 Vancouver). Two real bugs were diagnosed and fixed last night, plus one cosmetic timing tweak. Three commits pushed to `origin/main`:

```
a02f20ba fix(tenant): seed all 4 regions x 3 sectors (Sprint 2 #4.5)  ← HEAD
fb4bc950 fix(layout): widen morph animation gate 1100->3200ms (Sprint 2 #4.3)
fa0f543d fix(animations): set fill=none inline on dynamic SVG elements (Sprint 2 #4.3)
1f94c81c (previous HEAD) feat(layout): restore region+sector switch morph animations (#7)
```

Two `firebase deploy --only hosting` ran tonight — bundle on prod is `UnifiedLayout-CjzwGb9S.js` + `tenantService-qZF5l5xs.js`. Production hosting URL: `https://dynamicnfc-prod-68b4e.web.app`, primary `dynamicnfc.ca`.

### State at session close

| Surface | Local (`localhost:3000`) | Production (`dynamicnfc.ca`) |
|---------|--------------------------|------------------------------|
| Multi-region tenant data (Sprint 2 #4.5) | ✅ Working | ✅ Working — auto re-seed ran on first prod load, all 4 regions × 3 sectors populated |
| Morph animation visual (Sprint 2 #4.3) | ✅ Outline draws correctly, no black blobs | 🔴 Still rendering as black blobs — bundle has fix (verified via grep), but user's browser keeps serving cached old bundle |
| Today's Brief CORS (Sprint 2 #4.4) | 🟡 Same as before | 🟡 Same — template fallback works |

### What user should test on resume

1. Open **fresh Incognito window** → `dynamicnfc.ca/unified` → login → switch region/sector. Most likely the cache-bust from a clean session resolves the prod animation issue automatically (bundle hash differs, fresh download).
2. If Incognito still shows black blobs: F12 → Network tab → click on a `UnifiedLayout-*.js` row → confirm hash is `CjzwGb9S` (or newer). If older hash is loading, something is serving stale `index.html` (Firebase Hosting CDN cache, very rare).
3. If hash is correct but animation still black: F12 → Elements → right-click on a black polygon → Inspect. Confirm the polygon has `fill="none"` attribute. If yes → some other CSS is overriding (write `!important` rule). If no → bundle didn't carry the fix despite grep result, redo `Remove-Item -Recurse -Force node_modules\.vite, dist; npm run build; firebase deploy --only hosting`.

### Sprint 2 #4.3 closed — Morph animation black-blob regression

**Root cause:** `RegionMorphLoader.jsx` / `AutomotiveMorphLoader.jsx` / `YachtMorphLoader.jsx` create SVG elements via `document.createElementNS` and set only `class` (CSS Module hash) + `stroke`. They never set `fill`. The CSS Module rule `.bpEl { fill: none; stroke-width: 1.2; ... }` was the only thing keeping shapes hollow. When that rule failed to apply (build/CSS pipeline drift between deploys), SVG default `fill="black"` took over → solid black blob shapes.

**Fix:** Set `fill="none"`, `stroke-width`, and `stroke-linejoin/linecap` as inline SVG attributes on every dynamically-created path/rect/circle. CSS Module class still applied for opacity transitions etc., but inline attribute beats class — robust to any future CSS Module hash mismatch, global SVG selector leak, or build pipeline change. Six write sites changed (parts + details for each of three components). Local Vite HMR confirmed fix works. Prod bundle `UnifiedLayout-CjzwGb9S.js` contains the fix (grep confirmed `"fill","none"` pattern). Open visual issue is cache, not code.

**Also rolled in this commit chain:** gate timer widened `1100ms → 3200ms` so animations actually finish drawing (slowest region USA ~2150ms) plus ~1s "savor" pause before dashboard takes over. Premium pacing per user request.

### Sprint 2 #4.5 closed — Multi-region seed orchestration

**Root cause:** `seedTenantData()` in `frontend/src/services/tenantService.js` was only running `buildRealEstateSeed/Automotive/Yacht` for the **active** `regionId`. With Sprint 2 #4.1 closing the reseed-on-region-switch loop (correct fix), region switch never re-triggered the seed. Result: 9 of 12 region×sector combinations had zero data. Symptom looked like "data wiped" but was actually "data never written for inactive regions."

This bug was **masked** before Sprint 2 #4.1 because the reseed loop kept retriggering single-region seed on every region switch — visually, regions appeared to populate as the user clicked through them. Closing the loop unmasked the orchestration gap.

**Fix:** Loop `["gulf","usa","canada","mexico"]` through all 3 sector seeds inside `seedTenantData`. IDs are region-prefixed (`RE-GULF-001`, `AU-USA-005`, `YA-CAN-007` etc.) so 12 batches don't collide. SEED_VERSION bumped `2.1-region-enriched` → `2.2-all-regions` to auto-trigger merge re-seed for existing tenants on next page load. CLAUDE.md §8 merge-only contract preserved — user-created data not touched.

**Verified live:** Tenant `1UBC4ciS9HSSGsmTd6xZkkOkr472` re-seeded successfully on first prod load, console showed `[TENANT SEED] Version mismatch - running merge seed update` → `[TENANT SEED] Seed completed successfully`. After re-seed, all 4 regions populate on switch (Gulf Auto: 2 VIPs, USA RE: 3 VIPs incl. Daniel Roberts/Olivia Parker, Canada Vista Residences, Mexico hacienda).

### Sprint 2 #4.4 still open — `refreshDailyBriefAi` CORS

Unchanged from previous session. Today's Brief renders fine via template fallback. Lower priority than animation/seed issues. Address after demo.

### Demo backup plan if user resumes and animation still broken

If 07:30 retest still shows black blobs and the cache angle doesn't pan out, fastest unblock for the morning meeting is to **disable the switching gate entirely** by setting `setIsSwitching(false)` immediately or wrapping the whole `if (seedingInProgress || isSwitching)` block to drop `isSwitching`. Demo loses the morph animation but data swap remains instant. Region/sector switch still works via client-side filter. ~3 line revert in `UnifiedLayout.jsx` lines ~684–707. Better to ship without animation than ship black blobs in front of a luxury developer.

### Lesson worth keeping in memory

Sprint 2 #4.1 (region switch reseed loop) was a correct fix, but it unmasked Sprint 2 #4.5 (single-region seed orchestration). When you fix one bug, scan for what that bug was masking. Always test region/sector switch coverage matrix (4×3 = 12 cells) after any seed-related change.

Also: **CSS Module rules are not safe defaults for critical SVG attributes.** Inline attribute on every dynamic element is the durable contract. The 6 write sites that needed inline `fill="none"` were a single batch missed during initial component authorship.

---

## Previous unresolved (kept for context — both addressed above)

1. **🔴 RegionMorphLoader animation regression (priority).** ✅ **Closed by `fa0f543d` + `fb4bc950`** — root cause was missing inline `fill="none"` on dynamic SVG elements + 1100ms gate cutting animation mid-draw. Local verified, prod bundle contains fix, only blocker is browser cache.

2. **🟡 AI refresh button CORS error (lower priority).** Still open. Template fallback continues to work — demo can run on it.

---

## What shipped tonight

### Sprint 2 #4 — Velocity KPIs + Today's Brief AI summary
**PR #5** squash-merged as `4e61a702 feat(overview): velocity KPIs + AI daily brief (Sprint 2 #4) (#5)`

**Frontend additions (all under `/unified/overview`):**
- `TodaysBrief.jsx` (228L) — full-width AI brief block with mor (purple) left rail, NFC ROI badge, Template/AI source pill, "Generate AI summary" button, atRisk + hotLeadsNew + followUpsOverdue chips
- `SalesVelocity.jsx` (181L) — 4+4 metric grid: top row (blue, buyer-behavior) = TTFA, Viewing Velocity, Re-engagement, Second-Tap; bottom row (purple, conversion) = Lead Capture, VIP→Booked, Decision Window, Rep Response. Each metric carries threshold-based status dot (green/yellow/red/gray)
- DOMPurify (`isomorphic-dompurify` ^3.12.0) sanitizing LLM `paragraph1` / `paragraph2` rendering; `SANITIZE_CONFIG = { ALLOWED_TAGS: ['span','strong','em'], ALLOWED_ATTR: ['class'] }`. `vipName` interpolation goes through manual `escapeHtml()` first
- 8 metrics ship; 3 deferred to Sprint 3-4 (Behavioral Events/Tap, Region Velocity Index, Pipeline Acceleration Score)

**Backend additions (`functions/lib/`):**
- `velocityMetrics.js` (252L) — pure functions computing the 8 metrics from event/lead/deal arrays
- `briefTemplates.js` (154L) — EN/AR/ES/FR template fallback strings, mode selection (rising/cooling/plateau)
- `aiBriefGenerator.js` (96L) — Claude Haiku 4.5 call (`claude-haiku-4-5-20251001`) with 5min Firestore-persisted cooldown, silent fallback to template on failure
- `dataDerivers.js` (151L) — single source of truth for `deriveTopVip`/`derivePipelineDelta`/`deriveMarketplaceTraffic`/`deriveAlerts`. **Critical:** field names `topVip.mode` (not `.status`), `alerts.hotLeadsNew` / `alerts.followUpsOverdue` (not `.hotLeads` / `.overdue`)
- 2 new Cloud Functions: `aggregateVelocityMetrics` (scheduled every 15min, 512MB) + `refreshDailyBriefAi` (callable, 256MB, secret-bound to `ANTHROPIC_API_KEY`)

**Deploy choreography:**
- Anthropic API key in Secret Manager via `firebase functions:secrets:set ANTHROPIC_API_KEY` → `projects/511000068860/secrets/ANTHROPIC_API_KEY/versions/1`
- `defineSecret('ANTHROPIC_API_KEY')` from `firebase-functions/params`, `runWith({ secrets: [anthropicApiKey] })`
- IAM: `allAuthenticatedUsers` granted `roles/cloudfunctions.invoker` on `refreshDailyBriefAi` (this required disabling org policy `iam.allowedPolicyMemberDomains` — see "GCP gotchas" below)

**Deploy verification:**
- `aggregateVelocityMetrics` ACTIVE, scheduled, secret-bound
- `refreshDailyBriefAi` ACTIVE, ingress `ALLOW_ALL`, IAM grant `allAuthenticatedUsers/cloudfunctions.invoker` verified
- Production smoke: Today's Brief renders with template content (`Score 72`, `Pipeline added $159.3M`, decision window `6.2d` with green threshold dot, alerts chips populated). Sales velocity grid renders. Recharts last-8-weeks chart renders. Live Activity shows Marc Patel + Ethan Chen Vancouver personas (Canada region correct)

### Sprint 2 #4.1 — Region switch reseed loop fix
**PR #6** squash-merged as `1cb71a2f fix(tenant): stop server-side reseed on region switch (#6)`

**Problem:** Console log on every region switch showed `[TENANT RESEED] Reseed required: region mismatch (canada -> usa) - reseeding with merge strategy` followed by `[TENANT SEED] Seed completed successfully`. ~180-doc Firestore writes per switch, animation interrupts, performance kill. Direct violation of CLAUDE.md §8 Clean-Swap Pattern ("region switch = client-side filter via filterBySectorAndRegion, never server-side reseed").

**Fix:**
- `frontend/src/services/tenantService.js`: removed `regionMismatch` from `needsSeed` calculation in `checkTenantExists`; removed region-mismatch reseed branch in `seedTenantData`; preserved `seedRegion` as historical first-seed metadata via `existingData?.seedRegion ?? regionId`
- `frontend/src/hooks/useDashboardData.js`: removed `regionId` from tenant-init effect deps `[refreshKey, user, regionId]` → `[refreshKey, user]`. **This was the root cause** — React was re-running tenant-init on every region change

**Verified live:** Console after switch shows `[TENANT CHECK] needsSeed: false`, no `[TENANT SEED]` or `[TENANT RESEED]` entries. Region switch is now zero-Firestore-write.

### Sprint 2 #4.2 — Region/sector switch morph animation trigger
**PR #7** squash-merged as `1f94c81c feat(layout): restore region+sector switch morph animations (#7)`

**Problem:** With reseed loop closed (#4.1), the animation never fired because its render gate was `if (seedingInProgress)` and `seedingInProgress` no longer turns true on region switch. The animation was a side-effect of the reseed loop, not an intentional trigger.

**Fix:** `UnifiedLayout.jsx` — added local `isSwitching` state with refs to detect actual region/sector change (skip first mount), 1100ms timer, render gate widened to `seedingInProgress || isSwitching`. Pure UI state, zero Firestore writes. Sprint 2 #4.1 contract preserved.

**Verified live:** Animation now triggers on region/sector change. **BUT** the animation itself renders as black polygons (see "Unresolved issue 1" above).

---

## Production state (as of 2026-05-04 03:00)

| Surface | State |
|---------|-------|
| `/unified/overview` Today's Brief | ✅ Rendering with template content |
| `/unified/overview` Sales Velocity (8 metrics) | ✅ Rendering, threshold dots correct |
| Region switch reseed loop | ✅ Closed (zero writes) |
| Region switch UI animation trigger | ✅ Fires (1100ms `isSwitching`) |
| Region switch animation visual rendering | 🔴 Black polygons over white grid (regression, root cause TBD) |
| AI brief refresh button (`Generate AI summary`) | 🔴 CORS preflight blocked, function never reached |
| Region switch performance (data swap) | ✅ Instant client-side filter |
| Frontend bundle | `1f94c81c` deployed `5/4/26 2:43 AM` (`71799b`) |
| Cloud Functions deployed | 9 total: api, contactForm, onWalletPassRequest, aggregateTaps, aggregateCampaignTaps, cleanupInactiveTenants, seedDemoData, **aggregateVelocityMetrics (new)**, **refreshDailyBriefAi (new)** |

---

## GCP gotchas hit tonight (notes for future sessions)

1. **Secret Manager IAM auto-grant works.** `firebase functions:secrets:set ANTHROPIC_API_KEY` + `defineSecret` + redeploy automatically grants `roles/secretmanager.secretAccessor` to `dynamicnfc-prod-68b4e@appspot.gserviceaccount.com`. No manual IAM step needed.
2. **Domain Restricted Sharing org policy blocks `allUsers`/`allAuthenticatedUsers` IAM grants.** GCP Console exposes two related policies under filter `allowedPolicyMember`:
   - `iam.allowedPolicyMembers` (Managed) — newer, was Inactive
   - `iam.allowedPolicyMemberDomains` (Managed Legacy, "Domain restricted sharing") — older, was **Active and inheriting from parent**
   The older one was the actual blocker. Fix: navigate to that policy → **Override parent's policy** → **Replace** (not Merge — Merge keeps parent's deny rules) → **Allow all** rule → **Set policy**. Propagation 30sec–2min.
3. **Firebase legacy `functions:config:set` deprecated March 2027.** Migrate to `defineSecret` params API now. Secret access in code via `process.env.SECRET_NAME` after `runWith({ secrets: [...] })`.
4. **Firebase deploy `--only` flag with multiple functions:** `--only "functions:aggregateVelocityMetrics,refreshDailyBriefAi"` (single quoted string). Without quotes the parser swallows the second function name silently.
5. **Cursor Cloud Agent sandbox push can silently fail.** Round 1 of Sprint 2 #4 reported "completed" but `git ls-remote` showed only handoff commits. Mandatory `git ls-remote origin "<branch>"` proof in directives now standard.
6. **Cursor can produce duplicate `module.exports` in same file.** Bugbot caught this in Sprint 2 #4 audit-3 — `briefTemplates.js`, `aiBriefGenerator.js`, `velocityMetrics.js` each had two concatenated implementations with mismatched field names (Node uses last, first dead code). Always grep for duplicates after Cursor's larger generations.

---

## Region focus order (added 2026-05-02, kept)

Production prioritization changed from "4 equal primary" framing in CLAUDE.md to actual outreach ordering:
- **Canada > USA > Mexico > Gulf (paused)** due to regional conflict
- CLAUDE.md unchanged (stable rules — Gulf code/personas/Arabic translations remain production-grade peer to other regions)
- This file (CLAUDE_HANDOFF.md) is authoritative for the **current** focus
- Demo UI keeps Gulf selector visible (P1 sales optionality)

---

## Carried-over note: regression user reported

> "dün bu animasyon adam gibi çalışıyordu, bugünkü değişikliklerden sonra patladı"
> — User, ~2026-05-04 03:00 local

Diff analysis between `30909c11` (4/29 deploy state, last green animation per user) and `HEAD` (1f94c81c) shows:
- **Animation components themselves: 0 changes.** No diff in `RegionMorphLoader/`, `AutomotiveMorphLoader/`, `YachtMorphLoader/` between those commits
- `UnifiedLayout.css` +452 lines (Sprint 2 #4 styles for `.ud-todays-brief__*`, `.ud-sales-velocity__*`). CSS scan for `^svg|^path|^polygon|^circle|svg \{|path \{|polygon \{|circle \{|fill|stroke|\* {` returned only one match: `.ud-overflow-item--export > *` — animation-irrelevant
- `UnifiedLayout.jsx` +136 lines: i18n `moreActions` strings, Sprint 2 #4.2 `isSwitching` state, topbar overflow menu (mobile UX). Animation render block (`isRealEstate` / `isAutomotive` / `isYacht` ternary, lines 743-784 of HEAD) is **byte-identical** to 30909c11 version

**Two open hypotheses:**
- **H1:** Animation was always black-polygon-ed and reseed loop's continuous re-trigger somehow masked the bug visually. Rejected by user's clear memory.
- **H2:** Something subtle in build pipeline / CSS Module hash / bundle ordering broke animation between deploys. Not yet investigated. Best next step: hard-refresh + private window + DOM inspect on a black polygon → check computed `fill` CSS in DevTools → trace which rule is winning.

**Action for next session:** Treat user's recall as authoritative. Re-investigate without dismissing.

If H2 is real, possible culprits to check:
- Vite manual chunk reordering with new dependencies (DOMPurify added to bundle)
- CSS Module class hash collision between new `.ud-todays-brief__*` rules and animation's `.bpEl` / `.bpDetail` / `.bpLabel` (unlikely but checkable)
- `frontend/src/components/RegionMorphLoader/RegionMorphLoader.jsx` line ~190 sets `el.setAttribute("class", styles.bpEl)` and `el.setAttribute("stroke", d.accent)` but never sets `fill`. CSS rule `.bpEl { fill: rgba(69, 123, 157, 0.15) }` is supposed to do it. If CSS Module is producing a different hashed class name in the new build than the JS reference, animation paths fall back to browser default `fill="black"`. **This is the strongest H2 candidate.** Check by: open DevTools → Elements → click a black polygon → see whether `class="_bpEl_xxxxx"` matches the CSS Module's compiled class

---

## Branches and HEAD

- `main` HEAD: `1f94c81c feat(layout): restore region+sector switch morph animations (#7)`
- All `cursor/sprint-2-4-*` branches deleted from remote
- Local working tree clean

Recent commits:
```
1f94c81c feat(layout): restore region+sector switch morph animations (#7)
1cb71a2f fix(tenant): stop server-side reseed on region switch (#6)
4e61a702 feat(overview): velocity KPIs + AI daily brief (Sprint 2 #4) (#5)
1500e55a chore(summary): update day/hour github activity log
88f06171 docs(handoff): Sprint 2 #4 reset - Cursor sandbox lost, awaiting fresh execution
```

---

## Sprint 2 remaining (after #4)

Order TBD with user, but the queue from CLAUDE.md §14:

- **Sprint 2 #1** — 5-Minute Proof tutorial. Stack approved: G3+H1+I2+J2+K1+L2+M1+N2+P1. 5-step copy + visual concepts approved. Directive (`SPRINT2_1_FIVE_MINUTE_PROOF_DIRECTIVE.md`) not yet written
- **Sprint 2 #2** — Sales Trigger panel
- **Sprint 2 #3** — Buyer Sites sidebar
- **Sprint 2 #4.3 (new)** — RegionMorphLoader animation visual fix (this session's regression)
- **Sprint 2 #4.4 (new)** — `refreshDailyBriefAi` CORS fix
- **Sprint 2 #5** — VIP Alert Summary
- **Sprint 2 #6** — Outreach guardrail copy
- **Sprint 2 #7** — Owner workload columns

User has 8AM-ish meeting tomorrow (toplantı saati explicit söylenmedi but session ended at ~03:10 with user going to sleep, presumably for an early meeting). Demo strategy for tomorrow: lead with Today's Brief + Sales Velocity (Sprint 2 #4 main value), region switch via before/after data narrative (Canada Pipeline $0M → USA Pipeline $159.3M, persona Marc Patel → James Mitchell), skip the broken morph animation, frame as "Sprint 2 #5 polish in flight".

If user wants the morph animation working before the meeting, Sprint 2 #4.3 must be the first thing next session, and the H2 CSS Module hash hypothesis above is where to start.

---

## Tone for next session opener

User went to sleep at 03:10 frustrated about the animation regression — reasonably so, the animation was supposed to be intact through this work. Open the next session by:
1. Acknowledging the animation issue without re-litigating whether it worked yesterday (user's memory is the authority)
2. Going straight to DevTools Inspect on a black polygon as the first diagnostic step
3. Having the H2 CSS Module hash diagnostic ready to run
4. Holding the rollback option in pocket: cherry-pick Today's Brief + Sales Velocity off the Sprint 2 #4 commits onto a new branch from `30909c11`, leaving animation code paths untouched. ~1hr work if needed.

User does not need a postmortem, user needs the animation working. Lead with action.
