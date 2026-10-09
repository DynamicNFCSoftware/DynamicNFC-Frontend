# Decisions — October 2026 (Oguzhan)

## Legal entity
- The legal entity is **NFC Software Systems Inc.** (BC1545283). "DynamicNFC" is the product brand.
- Never write "DynamicNFC Card Inc." or "DynamicNFC Software Inc." on the site or in documents.
- This company is the subject of the SUV file (Keiretsu Forum Canada). The site must not contradict the Canada-focused business plan.

## Positioning
- **Canada is the home base.** "Made in Canada" and the Vancouver R&D story stay dominant on the public site.
- Gulf, USA, Mexico and Italy are **expansion markets**, always described as expansion from Canada.
- Code parity across regions is unchanged: every region × sector combination must work the same.

## Languages
- Public site: English, Italian, French, Spanish, Arabic (order in the selector: EN, IT, FR, ES, AR). Dropdown selector, not a cycle button.
- Demo portals and Unified Dashboard: Italian arrives with the Italy region (Step B).
- Italian matters most right now: Italy goes live within about a month (from 2026-10-06). A native speaker reads the Italian before launch.

## Claims on the site
- **Data location:** say "stored in Canada" only. Do NOT say data stays in each country's own region — the architecture is one Firestore database in Montréal with Cloud Functions in us-central1. Change the wording only after per-region data residency is actually built.
- **Compliance:** say "built on / designed around PIPEDA (and GDPR) principles", never "compliant" or "certified", until a lawyer signs off.
- **Performance numbers:** no direct figures in marketing copy ("in half", percentages, multipliers).
- **ROI calculator** (`/sales/roi-calculator`): keeps its fixed model figures for now, with the "illustrative model" disclaimer. Revisit later; preferred fix is visitor-set assumption sliders.
- **"Digital business card":** allowed where it describes the separate add-on card product for customers (Pricing, Blog, card builder). The NFC card in the VIP flow is still the "VIP Access Key".

## Legal text status
- Privacy policy sections 8–14 (GDPR) and the cookie banner wording are a **draft for the lawyer**, written 2026-10-06. IT/FR/ES legal text is machine-translated.

## Open questions
- Does the dealer dashboard really have "A/B testing"? The Automotive and Enterprise pages say so. To discuss.
- EU representative (GDPR Art. 27), postal address in the Privacy policy, a data processing agreement template, governing-law clause in the Terms — ask the lawyer.
- Enterprise → Yacht tab shows raw keys `prob2Desc_yacht` / `prob3Desc_yacht`: copy was never written.
