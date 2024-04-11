import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmvDUlSkLyRY93bu2LB3U1FRPogDeL8eo",
  authDomain: "techbook-by-qcore.firebaseapp.com",
  projectId: "techbook-by-qcore",
  storageBucket: "techbook-by-qcore.appspot.com",
  messagingSenderId: "154531357862",
  appId: "1:154531357862:web:a8a98816be20d437b14067",
  measurementId: "G-9P293J668H",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logout = () => {
  signOut(auth);
};

export { auth, signInWithPopup, db, logout };
