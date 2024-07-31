import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB2q5P_Motk9Q1jzOZe-TE6_Tr00Cnw6zM",
  authDomain: "formify-33302.firebaseapp.com",
  projectId: "formify-33302",
  storageBucket: "formify-33302.appspot.com",
  messagingSenderId: "1050174460465",
  appId: "1:1050174460465:web:d4193f70b897f5af0ebb10",
  measurementId: "G-QLXR67MT4K"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };