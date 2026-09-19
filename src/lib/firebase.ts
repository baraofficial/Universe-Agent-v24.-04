import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCU8COb1Rp6uZbgT7l3QNXsF5OZbeh5pNs",
  authDomain: "bara-ai-9cd30.firebaseapp.com",
  projectId: "bara-ai-9cd30",
  storageBucket: "bara-ai-9cd30.firebasestorage.app",
  messagingSenderId: "74999991599",
  appId: "1:74999991599:web:6bb076a875740c3e8565da",
  measurementId: "G-QJ11GECF4P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Inisialisasi Analytics jika didukung di browser
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { app, db, auth, googleProvider, analytics };
