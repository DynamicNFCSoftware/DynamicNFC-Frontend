import { auth, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Portal → Firestore bridge.
 * If an admin is logged in (same browser), writes portal events
 * to tenants/{uid}/events so the Unified Dashboard sees them in real-time.
 * If no user is logged in, silently does nothing (fire-and-forget).
 */
export function bridgeEventToFirestore(ev) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const doc = { ...ev, source: "portal_bridge" };

    // Convert ISO timestamp string to Firestore Timestamp for proper ordering
    if (typeof doc.timestamp === "string") {
      doc.timestamp = Timestamp.fromDate(new Date(doc.timestamp));
    }

    addDoc(collection(db, "tenants", user.uid, "events"), doc).catch(() => {});
  } catch (_) {
    // Never block portal UX
  }
}
