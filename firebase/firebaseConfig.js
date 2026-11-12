// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDq3-RI1pvcqk-FcNjyYH18ltuoGpSq3RY",
  authDomain: "dragonball-z-c9710.firebaseapp.com",
  projectId: "dragonball-z-c9710",
  storageBucket: "dragonball-z-c9710.firebasestorage.app",
  messagingSenderId: "812653630253",
  appId: "1:812653630253:web:2e74bbfd6d714beab479a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };