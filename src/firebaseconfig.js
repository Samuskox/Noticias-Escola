import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAZq59arlcMLju7U7FcvB20Vh1AwuqKTQY",
  authDomain: "jornal-escola-25b08.firebaseapp.com",
  projectId: "jornal-escola-25b08",
  storageBucket: "jornal-escola-25b08.firebasestorage.app",
  messagingSenderId: "23961679957",
  appId: "1:23961679957:web:dfe23274b8b91f5812bcdc",
  measurementId: "G-YZW5PFQQZ4"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar no site
export const db = getFirestore(app);
export const storage = getStorage(app);