// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-ry_7e9EZ1Zaq9Vt3zldslzJ9UYf_AHI",
  authDomain: "business-citadel.firebaseapp.com",
  projectId: "business-citadel",
  storageBucket: "business-citadel.appspot.com",
  messagingSenderId: 340896568964,
  appId: "1:340896568964:web:d45ab7d3d46c09898614d1",
  measurementId: "G-D615TXRL9V"
};

function createFirebaseApp(config) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebase = createFirebaseApp(firebaseConfig);
// const analytics = getAnalytics(firebase);
export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions(getApp());

//Local Emulator Setup
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, 'localhost', 8081);
connectFunctionsEmulator(functions, "localhost", 5001);