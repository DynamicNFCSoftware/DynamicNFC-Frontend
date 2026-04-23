# SIDEBAR FIX — UnifiedLayout

**Dosya:** `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` ve eşlik eden CSS (`UnifiedLayout.css` veya inline).

**LOCKED — değiştirme:** Topbar layout (logo+başlık solda; ●Live + 🇺🇸 + lang button + 🌙 + Export PDF sağda). Sadece sidebar'a dokun.

---

## Problem 1 — Collapsed state: icon'lar inline/hizalı değil

Sorunlar:
- Hamburger button + sector switcher (home/auto/yacht) ile alttaki nav rail farklı genişlikte ve hizasız.
- "AL NOOR RESIDENCES" text label collapsed state'te görünüyor → **gizlenmeli**.
- Section başlıkları ("INTELLIGENCE", "OPERATIONS", "SYSTEM") collapsed'da görünmemeli → yerine 1px divider gelsin.
- Aktif item'in (Overview) highlight'ı rail'in tüm genişliğini kaplıyor → collapsed'da **40×40 centered tile** olmalı.

### CSS

```css
/* Collapsed rail = 64px sabit genişlik */
.unified-sidebar.is-collapsed {
  inline-size: 64px;
}

/* Collapsed'da tüm nav item'lar */
.unified-sidebar.is-collapsed .nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 40px;
  block-size: 40px;
  margin-inline: auto;
  margin-block: 4px;
  padding: 0;
  border-radius: 8px;
}

/* Collapsed'da label, badge sayısı, section başlıkları, project adı gizle */
.unified-sidebar.is-collapsed .nav-label,
.unified-sidebar.is-collapsed .nav-badge,
.unified-sidebar.is-collapsed .section-header,
.unified-sidebar.is-collapsed .project-name { display: none; }

/* Section başlıkları yerine 1px divider */
.unified-sidebar.is-collapsed .nav-section + .nav-section {
  border-block-start: 1px solid var(--border-subtle);
  margin-block-start: 8px;
  padding-block-start: 8px;
}

/* Sector switcher (home/auto/yacht) ile nav rail aynı 40×40 grid'de */
.unified-sidebar.is-collapsed .sector-switcher button {
  inline-size: 40px;
  block-size: 40px;
  margin-inline: auto;
}

/* Footer (Portal links + user avatar) collapsed'da icon-only */
.unified-sidebar.is-collapsed .portal-links-toggle .label,
.unified-sidebar.is-collapsed .user-email { display: none; }
.unified-sidebar.is-collapsed .user-avatar { margin-inline: auto; }
```

---

## Problem 2 — Expanded state çok ferah, biraz daha compact yap

Şu an item'ler 14-16px padding ile çok uzun. Density artır:

```css
.unified-sidebar:not(.is-collapsed) {
  inline-size: 220px;          /* şu an muhtemelen 240-260px */
}

.unified-sidebar:not(.is-collapsed) .nav-item {
  padding-block: 8px;          /* eski: ~12px */
  padding-inline: 10px;        /* eski: ~14px */
  font-size: 13px;             /* eski: 14px */
  gap: 10px;                   /* icon ile label arası */
}

.unified-sidebar:not(.is-collapsed) .nav-item .nav-icon {
  inline-size: 18px;
  block-size: 18px;            /* eski: 20px */
}

.unified-sidebar:not(.is-collapsed) .section-header {
  font-size: 10px;             /* eski: 11-12px */
  padding-block: 6px;          /* eski: ~10px */
  letter-spacing: 0.08em;
}

.unified-sidebar:not(.is-collapsed) .user-email {
  font-size: 11px;             /* footer email çok büyük */
}
```

---

## Problem 3 — Aktif sector'e göre section header renkleri

Sidebar'da "INTELLIGENCE", "OPERATIONS", "SYSTEM" başlıkları şu an hep gri. Aktif sector'e göre renk değişsin.

### Renk atamaları (brand-aligned)

| Sector | Section header rengi | Neden |
|--------|---------------------|-------|
| Real Estate | `#e63946` (Brand Red) | Ana brand rengi, residential'ın primary'si |
| Automotive | `#457b9d` (Brand Blue) | Tech/trust, otomotiv için doğal |
| Yacht | `#b8860b` (Gold Accent) | Luxury gulf altın — yacht premium feel |

### Uygulama

Sidebar container'a sector-based class ekle:

```jsx
// UnifiedLayout.jsx içinde — useSector hook'tan aktif sector'ü al
const { activeSector } = useSector(); // veya prop'tan
<aside className={`unified-sidebar sector-${activeSector}`} ...>
```

CSS:

```css
/* Varsayılan (fallback) */
.unified-sidebar .section-header {
  color: var(--text-muted);
  transition: color 200ms ease;
}

/* Real Estate — kırmızı */
.unified-sidebar.sector-real-estate .section-header,
.unified-sidebar.sector-realestate .section-header {
  color: #e63946;
}

/* Automotive — mavi */
.unified-sidebar.sector-automotive .section-header {
  color: #457b9d;
}

/* Yacht — altın */
.unified-sidebar.sector-yacht .section-header {
  color: #b8860b;
}
```

**Not:** Badge sayıları (VIP CRM yanındaki "3" gibi) aynı renk kodunu takip edebilir — istersen aynı class'a `.nav-badge` ekle. Şimdilik sadece section header'lar için uygula.

### Test
- Real Estate aktifken → INTELLIGENCE/OPERATIONS/SYSTEM kırmızı.
- Automotive'e geç → mavi.
- Yacht'a geç → altın.
- Geçişte 200ms yumuşak animasyon.

---

## Test Checklist (build'den sonra kontrol et)

1. **Collapsed:** tüm icon'lar 40×40 grid'de, dikey ortalı, eşit aralıklı.
2. **Collapsed:** "AL NOOR RESIDENCES", "INTELLIGENCE/OPERATIONS/SYSTEM", email — hiçbiri görünmüyor.
3. **Collapsed:** Overview highlight kutusu sadece icon'u kaplıyor, rail'in tamamını değil.
4. **Expanded:** 220px width, padding daha sıkı, font 13px, hâlâ okunabilir.
5. **Tooltip:** collapsed item'larda hover ile label çıkıyor (zaten varsa dokunma; yoksa `title={label}` ekle).
6. **RTL (Arapça):** sidebar sağa yapışıyor — `margin-inline-start` kullandığından sorun çıkmaz.
7. **Build:** `npm run build` temiz geçiyor.

---

## Dosya bütünlüğü (TRUNCATION WARNING)

Edit sonrası mutlaka:
```bash
wc -l frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx
tail -5 frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx
```

Dosya `}` ile bitmeli. 500+ satır → truncation riski yüksek.
