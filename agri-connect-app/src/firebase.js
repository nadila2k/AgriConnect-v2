// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK7DEu_S3GWvTw00ToXZ0-FCo-wXojZkw",
  authDomain: "agrichat-e1054.firebaseapp.com",
  projectId: "agrichat-e1054",
  storageBucket: "agrichat-e1054.firebasestorage.app",
  messagingSenderId: "901024082036",
  appId: "1:901024082036:web:2e34262dc36bf9156a0921"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);