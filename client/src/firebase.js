// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "clubconnect-b2127.firebaseapp.com",
  projectId: "clubconnect-b2127",
  storageBucket: "clubconnect-b2127.appspot.com",
  messagingSenderId: "320073650623",
  appId: "1:320073650623:web:d4431bd9442b0d83c3910a",
  measurementId: "G-4C1364CY0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);