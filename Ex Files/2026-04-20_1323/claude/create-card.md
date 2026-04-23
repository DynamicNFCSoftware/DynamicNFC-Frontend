# CreateCard Page

## Overview

`frontend/src/pages/CreateCard/CreateCard.jsx` - Page where users create new digital business cards.

**URL:** `http://localhost:3000/create-card`

## External Script Integration

The page uses an external helper script for DOM interactions (popups, image uploads, field inputs).

### Helper Module
- **File:** `frontend/src/pages/CreateCard/CreateCardHelper.js`
- **Exports:** `initCardCreate()`, `destroyCardCreate()`

### React Lifecycle Integration (lines 57-74)
```jsx
useEffect(() => {
  // Load CSS once
  loadCssOnce("/assets/css/f0be61666b9614df.css");
  loadCssOnce("/assets/css/f984sdf8q4q5qwq.css");

  // Wait ONE render so DOM exists
  requestAnimationFrame(() => {
    initCardCreate();   // Initialize event listeners
    setIsLoadingAssets(false);
  });

  return () => {
    destroyCardCreate(); // Cleanup on unmount
  };
}, []);
```

**Key points:**
- CSS loaded from `/assets/css/` (local, not remote)
- `requestAnimationFrame` ensures DOM is ready before init
- `destroyCardCreate()` cleans up event listeners on unmount (fixes navigation issues)

## QR Code Display Flow

After successful card creation, the left panel switches from card preview to QR code display.

### State
- `qrUrl` - QR code image URL
- `savedHashId` - Hash ID from save response

### Save Flow (submitCardToAPI - lines 116-205)
1. POST form data to `/api/users/upload`
2. Extract `hashId` from response
3. Generate QR URL
4. Navigate to `/card/?hashId={hashId}`

## Related

- **Card View Page:** `frontend/src/pages/Card/` - Displays saved card
- **Helper Module:** `frontend/src/pages/CreateCard/CreateCardHelper.js`
- **API Endpoint:** `POST /api/users/upload`
