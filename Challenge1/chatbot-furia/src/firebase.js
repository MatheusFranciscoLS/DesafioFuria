// src/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Substitua os valores abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVCCvQCk64Ly3xQ05Kk7NSWYf0LmeNekk",
  authDomain: "chatbot-furia-db599.firebaseapp.com",
  projectId: "chatbot-furia-db599",
  storageBucket: "chatbot-furia-db599.appspot.com",
  messagingSenderId: "343293718919",
  appId: "1:343293718919:web:8ce2af09c6331268046322",
  measurementId: "G-FT6KVF23P5"
};


let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
export default db;
