import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFd3QGyDMeejavcCWFKym7dokcwCAMSec",
  authDomain: "prepwise-fdb51.firebaseapp.com",
  projectId: "prepwise-fdb51",
  storageBucket: "prepwise-fdb51.firebasestorage.app",
  messagingSenderId: "1086981467522",
  appId: "1:1086981467522:web:3770f6317ad68e2530339b",
  measurementId: "G-HJYC5HC7KG"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);