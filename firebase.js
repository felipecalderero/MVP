import {  initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBBNXFMk4Iv4Va34g0zfofYMt0DDnpR1ss",
  authDomain: "mymentalwellbeing-1b7c7.firebaseapp.com",
  projectId: "mymentalwellbeing-1b7c7",
  storageBucket: "mymentalwellbeing-1b7c7.appspot.com",
  messagingSenderId: "883615416193",
  appId: "1:883615416193:web:23c73c514ba63329aa3280"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);


const db = getFirestore(app);
export { auth };

export { db };