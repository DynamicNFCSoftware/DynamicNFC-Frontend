import { auth, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Portal → Firestore bridge — DUAL WRITE.
 *
 * ALWAYS writes to top-level `behaviors` (Firestore rules allow public create;
 * legacy /admin/* panel reads from here; this is the canonical record for
 * anonymous/public portal traffic).
 *
 * ADDITIONALLY writes to `tenants/{uid}/events` when an admin is logged in
 * in the same browser (cross-tab demo + pilot live dashboard scenario —
 * Unified Dashboard's per-tenant subscription picks it up in real-time).
 *
 * Fire-and-forget on both writes. Never blocks portal UX.
 */
export function bridgeEventToFirestore(ev) {
  try {
    const doc = { ...ev, source: "portal_bridge" };

    if (typeof doc.timestamp === "string") {
      doc.timestamp = Timestamp.fromDate(new Date(doc.timestamp));
    }

    addDoc(collection(db, "behaviors"), doc).catch(() => {});

    const user = auth.currentUser;
    if (user?.uid) {
      addDoc(collection(db, "tenants", user.uid, "events"), doc).catch(() => {});
    }
  } catch (_) {
    // Never block portal UX
  }
}
