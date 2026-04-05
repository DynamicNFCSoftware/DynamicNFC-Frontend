import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- BUNA İHTİYACIMIZ VAR

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
export const db = getFirestore(app); // <-- VE BUNA

export async function initRemoteConfig() {}
export function getConfigValue() { return null; }