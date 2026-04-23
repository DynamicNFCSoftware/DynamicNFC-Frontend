import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "AIzaSyCZPigJ3EQbyKtHeZu6VxHU2yCmaBG6hvU",
  authDomain: "dynamicnfc-prod-68b4e.firebaseapp.com",
  projectId: "dynamicnfc-prod-68b4e",
  storageBucket: "dynamicnfc-prod-68b4e.firebasestorage.app",
  messagingSenderId: "511000068860",
  appId: "1:511000068860:web:24d1cab3dc48f6dccacd79"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Remote Config for A/B testing
export const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
remoteConfig.defaultConfig = {
  hero_cta_text: "Get Your Card",
  hero_cta_variant: "A",
};

let rcReady = false;
export const initRemoteConfig = async () => {
  if (rcReady) return;
  try {
    await fetchAndActivate(remoteConfig);
    rcReady = true;
  } catch (e) {
    console.warn("Remote Config fetch failed:", e);
  }
};

export const getConfigValue = (key) => {
  try {
    return getValue(remoteConfig, key).asString();
  } catch {
    return remoteConfig.defaultConfig[key] || "";
  }
};