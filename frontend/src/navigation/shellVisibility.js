/**
 * Single source for which routes hide global chrome (navbar, breadcrumb, etc.).
 * When adding full-bleed flows, update here once — App.jsx wrappers stay in sync.
 */

function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

/** Navbar: hidden on auth, smart redirect, admin, demos, dedicated card surfaces */
export function shouldHideNavbar(pathname) {
  return (
    pathname === '/login' ||
    pathname.startsWith('/c/') ||
    isAdminPath(pathname) ||
    pathname.startsWith('/unified') ||
    pathname.startsWith('/enterprise/crmdemo') ||
    pathname.startsWith('/automotive/demo') ||
    pathname === '/automotive/dashboard' ||
    pathname === '/card'
  );
}

/** Breadcrumb: same as navbar, plus home (landing has no trail) */
export function shouldHideBreadcrumb(pathname) {
  return pathname === '/' || shouldHideNavbar(pathname);
}

/** Cookie banner: skip minimal tap/redirect surfaces */
export function shouldHideCookieBanner(pathname) {
  return pathname.startsWith('/card') || pathname.startsWith('/c/');
}

/** WhatsApp FAB: skip login + admin */
export function shouldHideWhatsApp(pathname) {
  return pathname === '/login' || isAdminPath(pathname) || pathname.startsWith('/unified');
}
