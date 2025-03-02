import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPVxETUBsHuKvMDBIlJs83xuFThW2WvrE",
    authDomain: "bitebridge-47816.firebaseapp.com",
    projectId: "bitebridge-47816",
    storageBucket: "bitebridge-47816.firebasestorage.app",
    messagingSenderId: "784765858080",
    appId: "1:784765858080:web:08ce97f1c6c39fc9d1e745"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };