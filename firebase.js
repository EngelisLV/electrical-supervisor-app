import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkrz6DB23DCfOAiyB7z5By46LVxArzGeY",
  authDomain: "electrical-supervisor-app.firebaseapp.com",
  projectId: "electrical-supervisor-app",
  storageBucket: "electrical-supervisor-app.appspot.com",
  messagingSenderId: "273097031861",
  appId: "1:273097031861:web:db290cdb3406a7aea37efc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
