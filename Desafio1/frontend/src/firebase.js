/**
 * firebase.js - Inicialização do Firebase para uso no React
 * Exporta instâncias do Firestore, Auth e provedores de login para uso nos componentes.
 */
// Importa funções necessárias do SDK
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVCCvQCk64Ly3xQ05Kk7NSWYf0LmeNekk",
  authDomain: "chatbot-furia-db599.firebaseapp.com",
  projectId: "chatbot-furia-db599",
  storageBucket: "chatbot-furia-db599.appspot.com",
  messagingSenderId: "343293718919",
  appId: "1:343293718919:web:8ce2af09c6331268046322",
  measurementId: "G-FT6KVF23P5",
};

// Inicializa o app (evita duplicidade em hot reload)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializa serviços
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, signInAnonymously, signInWithPopup, signOut };
export default db;
