import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCTF1VTErEB91jKWj-_fU5Cvm8Pvec-PAQ",
  authDomain: "turing-shoreline-cdw77.firebaseapp.com",
  projectId: "turing-shoreline-cdw77",
  storageBucket: "turing-shoreline-cdw77.firebasestorage.app",
  messagingSenderId: "244696811360",
  appId: "1:244696811360:web:e8031988c85289eabec005"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
