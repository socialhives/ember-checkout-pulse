
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAhgQH2Jb3dw8jf2ChTKU70S8FOp6NhCx8",
  authDomain: "madapetgate.firebaseapp.com",
  projectId: "madapetgate",
  storageBucket: "madapetgate.appspot.com",
  messagingSenderId: "404291050782",
  appId: "1:404291050782:web:3b7312b4e3e76005063d0f",
  measurementId: "G-2PDEV6N0NQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
