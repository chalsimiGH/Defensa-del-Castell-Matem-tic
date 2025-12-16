
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Afegeix aquí les teves claus de Firebase de la consola (Project Settings > General > Your apps)
// Substitueix els valors que comencen per "SUBSTITUEIX..."
const firebaseConfig = {
  apiKey: "SUBSTITUEIX_AIXO_PER_LA_TEVA_API_KEY",
  authDomain: "SUBSTITUEIX_AIXO.firebaseapp.com",
  projectId: "SUBSTITUEIX_AIXO",
  storageBucket: "SUBSTITUEIX_AIXO.appspot.com",
  messagingSenderId: "SUBSTITUEIX_AIXO",
  appId: "SUBSTITUEIX_AIXO"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
