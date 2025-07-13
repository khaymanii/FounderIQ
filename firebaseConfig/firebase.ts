// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "import.meta.env.VITE_FIREBASE_API_KEY",
  authDomain: "founderiq.firebaseapp.com",
  projectId: "founderiq",
  storageBucket: "founderiq.firebasestorage.app",
  messagingSenderId: "261956641644",
  appId: "1:261956641644:web:acd637b2414c0e9f898949",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
