import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCTF1VTErEB91jKWj-_fU5Cvm8Pvec-PAQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "turing-shoreline-cdw77.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "turing-shoreline-cdw77",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "turing-shoreline-cdw77.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "244696811360",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:244696811360:web:e8031988c85289eabec005"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
