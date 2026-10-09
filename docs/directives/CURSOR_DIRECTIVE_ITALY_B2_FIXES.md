# CURSOR DIRECTIVE — Italy B2 audit fixes (Italian quality pass)

**Branch:** `feat/italy-b2-dashboard-it` (same branch, new commits)          **Type:** implementation
**Read first:** `docs/directives/CURSOR_DIRECTIVE_ITALY_B2_DASHBOARD_IT.md` §4 (Italian style)

## 1. Claude's audit of B2 (2026-10-09)

PASS: scope (extra files `developerThemes.js`, `yachtVesselData.js` only gained `it` next to `fr` — fine), `timeAgo` helper,
`toMillis` + Kanban `NaNd` fix, locale via `getEffectiveLocale`, parity test, functions brief, seed campaign text.
Yacht descriptions in Italian read well.

**FAIL — Italian quality.** Many dashboard strings were translated word by word and are not usable in front of an Italian client.
Examples (all in the new `it` blocks):

| Now (wrong) | English source | Must read like |
|---|---|---|
| `Live acquirente attività` | Live Buyer Activity | `Attività acquirenti in tempo reale` |
| `VIP Activity Riepilogo` | VIP Activity Summary | `Riepilogo attività VIP` |
| `Active Avvisi` | Active Alerts | `Avvisi attivi` |
| `Media Lead Punteggio` | Avg Lead Score | `Punteggio medio dei lead` |
| `Engagement Oltre Tempo` | Engagement Over Time | `Engagement nel tempo` |
| `Tutti traffico combinati` | All Traffic Combined | `Tutto il traffico` |
| `Action Performance` / `Unità Performance` | … Performance | `Rendimento azioni` / `Rendimento unità` |
| `Top Piani da Interesse` | Top Plans by Interest | `Piani più richiesti` |
| `Pipeline salute su tutti contatti` | Pipeline health across all contacts | `Salute della pipeline su tutti i contatti` |
| `VIP Elenco`, `VIP Profili`, `Priorità VIP Elenco` | VIP Directory … | `Elenco VIP`, `Profili VIP`, `Elenco VIP prioritari` |
| `Persona noto` | Person known | `Persona identificata` |
| `Ripeti Visite`, `Prezzo Segnale`, `Riemetti Link` | Repeat Views, Pricing Signal, Reissue Link | `Visite ripetute`, `Segnale di prezzo`, `Rigenera link` |
| `Recente Activity`, `Anticipato Interesse`, `Prezzo Interesse`, `VIP Interesse` | … | natural Italian word order |
| `Enters via NFC Magic Link. Identità noto via vip_id. Use insight for 1-a-1 outreach. Goal: prenotato viewings uplift.` | (half English) | a full Italian sentence |

**FAIL — proper names translated.** Project / company names must stay exactly as in English:
`Prestige Motori Vancouver` → `Prestige Motors Vancouver`, `Prestige Motori` → `Prestige Motors`,
`Golfo Marina Yacht` → `Gulf Marina Yachts`, `Pacifico Marina Yacht` → `Pacific Marina Yachts`. Check every project, dealership,
marina and tower name in every `it` value.

**Changed by Claude (uncommitted, commit it as is):** `pages/UnifiedDashboard/lib/timeAgo.js` + `timeAgo.test.js` — English keeps
`ago` (`5m ago`, the dashboard's main language had lost it) and "under a minute" reads `just now` / `ora` / `à l'instant` / `ahora` / `الآن`
instead of `0m`. Commit: `fix(i18n): keep "ago" in English relative time, "just now" under a minute`.

## 2. Italian quality pass (commit `fix(i18n): Italian dashboard copy quality pass`)

1. Go through **every `it` value added on this branch** (`git diff main...HEAD`), file by file, side by side with `en`.
   Main files: `i18n/portals/dashboard.js`, `tabs/campaignsTab.i18n.js`, `i18n/eventDisplayMap.js`, `i18n/portals/fiveMinuteProof.js`,
   `config/sectorConfig.js`, `UnifiedLayout.jsx`, all tabs and components.
2. Translate the **meaning of the whole phrase**, never word by word. Italian word order: noun first, then adjective/complement
   (`Punteggio medio`, not `Media punteggio`).
3. **Sentence case** — Italian UI does not capitalise every word (`Visite prenotate`, not `Visite Prenotate`). Proper nouns and the
   glossary terms below keep their case.
4. No half-English strings. Allowed English only from the glossary in the B2 directive §4 (VIP, NFC, CRM, ROI, lead, deal, pipeline,
   dashboard, follow-up, tap, outreach, engagement, marketplace, showroom, test drive, brand names, event codes).
5. Proper names unchanged (see table above).

## 3. Verify (PowerShell) — paste output

```powershell
cd frontend
npm run lint; npm run build; npm test; npm run e2e
# every it string with 2+ capitalised words or a stray English word — review each hit, paste the remaining list
git diff main...HEAD -- src | Select-String '^\+.*\bit:\s*"([^"]+)"' -AllMatches | ForEach-Object { $_.Matches | ForEach-Object { $_.Groups[1].Value } } |
  Where-Object { $_ -cmatch '\b(Activity|Active|Over|Performance|Top|Average|Avg|Recent|Link|Directory|Signal|Repeat|Known)\b' -or ($_ -csplit ' ' | Select-Object -Skip 1 | Where-Object { $_ -cmatch '^[A-Z][a-z]' }).Count -ge 2 }
Select-String -Path src\**\*.js,src\**\*.jsx -Pattern 'Prestige Motori|Golfo Marina|Pacifico Marina'
```
Both lists must be empty, or each remaining hit explained (proper noun, glossary term).

## 4. Do not
No deploy, no push. No changes outside `it` values and the two timeAgo files. Do not touch other languages.

## 5. Report back
Commit hashes, command output, the number of `it` strings you rewrote, and 20 before → after examples.
