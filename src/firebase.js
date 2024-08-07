import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAqNKPO0vvRzwoqrUsA-iZhoYQeM89lkmA",
    authDomain: "juno-49a24.firebaseapp.com",
    projectId: "juno-49a24",
    storageBucket: "juno-49a24.appspot.com",
    messagingSenderId: "1018218151214",
    appId: "1:1018218151214:web:7fd77698cebaaba62c0ebf",
    measurementId: "G-KMBPRF63FF"
  };
  

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const googleProvider = new GoogleAuthProvider();
  export const db = getFirestore(app);