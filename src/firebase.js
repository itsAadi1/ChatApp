// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8qkMHXtsQB_6FBFAzhTtU6wE6RBAbUuA",
  authDomain: "chatapp-20737.firebaseapp.com",
  projectId: "chatapp-20737",
  storageBucket: "chatapp-20737.firebasestorage.app",
  messagingSenderId: "1052819373295",
  appId: "1:1052819373295:web:57c2305c3a8ab26c3f2f1a",
  measurementId: "G-EF000N4Q32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('✅ Firestore offline persistence enabled');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ The current browser does not support all features required for persistence');
    } else {
      console.error('❌ Error enabling offline persistence:', err);
    }
  });

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);