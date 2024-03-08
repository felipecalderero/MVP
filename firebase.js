import {  initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDvePolkHbT9vHHAAHNm_9jeRDit-piw0o",
  authDomain: "mymentalwellbeing--mvp.firebaseapp.com",
  projectId: "mymentalwellbeing--mvp",
  storageBucket: "mymentalwellbeing--mvp.appspot.com",
  messagingSenderId: "377059469902",
  appId: "1:377059469902:web:b2c5211ffbe02139e6f11f"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);


const db = getFirestore(app);
export { auth };

export { db };