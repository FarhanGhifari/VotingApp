import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqOw_a_-5eGA_cb99Tjkobi9Vq3QBH7Z8",
  authDomain: "pemilihan-kahim.firebaseapp.com",
  projectId: "pemilihan-kahim",
  storageBucket: "pemilihan-kahim.firebasestorage.app",
  messagingSenderId: "635130566048",
  appId: "1:635130566048:web:71669ab00c3105ee40c0c5",
  measurementId: "G-ZHLH1BTRWK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
