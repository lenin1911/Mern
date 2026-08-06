import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ─── TODO: Replace with your Firebase project config ─────────────────────────
// Firebase Console → Project Settings → Your apps → Web → Config object
const firebaseConfig = {
  apiKey: "AIzaSyB0Hmf0BgnINqyWbhurhxbtSmN_3iQ8O9c",
  authDomain: "mern-f55d1.firebaseapp.com",
  projectId: "mern-f55d1",
  storageBucket: "mern-f55d1.firebasestorage.app",
  messagingSenderId: "468003194925",
  appId: "1:468003194925:web:5bfbecf1e126772c9390a4",
};
// ─────────────────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
