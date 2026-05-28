import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBVASG6Tdb9Sy7nEdDzpydxogkZgljTX1c",
  authDomain: "elibrary-26.firebaseapp.com",
  databaseURL: "https://elibrary-26-default-rtdb.firebaseio.com",
  projectId: "elibrary-26",
  storageBucket: "elibrary-26.firebasestorage.app",
  messagingSenderId: "78724996103",
  appId: "1:78724996103:web:c21908da53517d9c92dea2"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);