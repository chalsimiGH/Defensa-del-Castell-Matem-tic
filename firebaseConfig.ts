
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// La teva configuració de Firebase real
const firebaseConfig = {
  apiKey: "AIzaSyBsX2K-ZqTeFiXbL3xxYYG_l4piimdPQvA",
  authDomain: "castellmatematic.firebaseapp.com",
  projectId: "castellmatematic",
  storageBucket: "castellmatematic.firebasestorage.app",
  messagingSenderId: "189820081218",
  appId: "1:189820081218:web:54fab5c1d1c0435e5a09db",
  measurementId: "G-7NQBZDK7PL"
};

// Initialize Firebase safely
let dbExport: Firestore | null = null;

try {
  const app = initializeApp(firebaseConfig);
  // Inicialitzem la base de dades
  dbExport = getFirestore(app);
  // Inicialitzem Google Analytics (opcional, però venia al teu codi)
  const analytics = getAnalytics(app);
  
  console.log("✅ Firebase inicialitzat correctament connectat a: castellmatematic");
} catch (error) {
  console.error("Error inicialitzant Firebase:", error);
}

// Export db which might be null if config is missing
export const db = dbExport;
