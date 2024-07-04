// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVnU3UtVTfyKQVxrdpWgwm7iLbS3F2Sw4",
  authDomain: "hospital-1951d.firebaseapp.com",
  projectId: "hospital-1951d",
  storageBucket: "hospital-1951d.appspot.com",
  messagingSenderId: "294600042958",
  appId: "1:294600042958:web:47a0c5aac703110706639f"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth, firebaseApp };
