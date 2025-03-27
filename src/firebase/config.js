import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLFAZZio2cOu30oSiL7b7YyYERXxF4Koo",
  authDomain: "fracta-f25ca.firebaseapp.com",
  projectId: "fracta-f25ca",
  storageBucket: "fracta-f25ca.firebasestorage.app",
  messagingSenderId: "842624004733",
  appId: "1:842624004733:web:abb0ee1387754e1df77714",
  measurementId: "G-TCSQRP1R5F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 