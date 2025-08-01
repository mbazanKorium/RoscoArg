// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgNyb-lQO2dHHsTKpxAjQgz8undHiIDWs",
  authDomain: "rosco-dev-a9bc1.firebaseapp.com",
  projectId: "rosco-dev-a9bc1",
  storageBucket: "rosco-dev-a9bc1.firebasestorage.app",
  messagingSenderId: "215770752364",
  appId: "1:215770752364:web:31f8e00ef06950f9777f49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
