import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Replace these with the actual keys from your Firebase Project Settings
  apiKey: "YOUR_API_KEY",
  authDomain: "dynamicnfc.ca", // This ensures the Google popup works securely
  projectId: "dynamicnfc-prod-68b4e",
  storageBucket: "dynamicnfc-prod-68b4e.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase & Export Auth for your Login.jsx file
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);