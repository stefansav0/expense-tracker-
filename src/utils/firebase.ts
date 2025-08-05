// utils/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this line

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBg_OYviTQf4Z0FMWuR7p7-24KAOLZ5fgI",
  authDomain: "expense-tracker-d4bd8.firebaseapp.com",
  projectId: "expense-tracker-d4bd8",
  storageBucket: "expense-tracker-d4bd8.appspot.com",
  messagingSenderId: "252793135440",
  appId: "1:252793135440:web:d6944a27febd8180090c55"
};

// ✅ Initialize Firebase only once (for Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export storage here
