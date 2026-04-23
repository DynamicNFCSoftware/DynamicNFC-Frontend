# CURSOR DIRECTIVE — UnifiedLayout.jsx Tail Fix (Build Blocker)

**Priority:** P0 — build is broken. Apply this fix first.

---

## Task

Fix truncation at end of `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx`.

The file is cut mid-SVG on line 708 inside the theme-toggle moon icon ternary. Build fails with:

```
vite build failed:
frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx:708:74
ERROR: Unexpected end of file
```

---

## Exact Change

### File
`frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx`

### Find (last 5 lines of the file — exactly as they are now)

```jsx
            <button type="button" className="ud-btn-icon" onClick={toggleTheme} aria-label={tx.toggleTheme}>
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none
```

### Replace with

```jsx
            <button type="button" className="ud-btn-icon" onClick={toggleTheme} aria-label={tx.toggleTheme}>
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <ExportPDF />
          </div>
        </div>
        <div className="ud-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

---

## What This Restores

1. Closes the moon SVG (light-theme icon path)
2. Closes the theme toggle `<button>`
3. Adds `<ExportPDF />` — already imported at line 12, was never rendered
4. Closes `</div>` for `ud-topbar-actions`
5. Closes `</div>` for `ud-topbar`
6. Adds `<div className="ud-main-content"><Outlet /></div>` for route content
7. Closes `</main>` (ud-main)
8. Closes `</div>` (ud-content-area)
9. Closes the `LayoutContent` function with `);` + `}`

---

## Topbar Right-Side Order — LOCKED (do not change)

After this fix, `.ud-topbar-actions` renders in this exact order:

1. ● Live/Demo indicator
2. 🇺🇸 Region selector (flag + dropdown)
3. Language toggle (EN / AR / FR buttons, region-filtered)
4. 🌙 Theme toggle (sun ↔ moon)
5. **Export PDF** (branded jsPDF button — new)

**Do not** reorder, do not replace the logo on the left with text, do not move Live indicator to the left.

---

## Verification (run after applying)

```bash
cd frontend
wc -l src/pages/UnifiedDashboard/UnifiedLayout.jsx
# Expected: ~720 lines

tail -15 src/pages/UnifiedDashboard/UnifiedLayout.jsx
# Expected: ends with `}`

npm run build
# Expected: ✓ built in X.XXs — no errors
```

---

## ⚠️ Truncation Warning

This file is ~720 lines. Cursor edits have historically truncated 500+ line files silently. After ANY edit here:

1. Run `wc -l` and confirm line count
2. Run `tail -15` and confirm file ends with `}`
3. Run `npm run build` and confirm it succeeds

If truncated again, restore from this directive.

---

## After This Fix

Once build is green, apply next directive: `CURSOR_EXPORTPDF_LETTERHEAD.md` (letterhead PDF export).
