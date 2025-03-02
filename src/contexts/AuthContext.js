import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { storeData, getData, removeData, STORAGE_KEYS } from '../utils/asyncStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            ...userDoc.data()
          };
          
          setUser(userData);
          
          // Store basic user info in AsyncStorage
          await storeData(STORAGE_KEYS.USER_NAME, userData.name);
          await storeData(STORAGE_KEYS.USER_EMAIL, userData.email);
          await storeData(STORAGE_KEYS.USER_PHONE, userData.phone);
          await storeData(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Basic fallback if Firestore fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        setUser(null);
        // Clear user data from AsyncStorage on logout
        await removeData(STORAGE_KEYS.USER_NAME);
        await removeData(STORAGE_KEYS.USER_EMAIL);
        await removeData(STORAGE_KEYS.USER_PHONE);
        await removeData(STORAGE_KEYS.IS_LOGGED_IN);
      }
      setLoading(false);
    });

    // Check if user was previously logged in (for quick UI display while Firebase initializes)
    const checkLocalAuth = async () => {
      const isLoggedIn = await getData(STORAGE_KEYS.IS_LOGGED_IN);
      if (isLoggedIn === 'true') {
        const name = await getData(STORAGE_KEYS.USER_NAME);
        const email = await getData(STORAGE_KEYS.USER_EMAIL);
        const phone = await getData(STORAGE_KEYS.USER_PHONE);
        
        // Set temporary user data while waiting for Firebase
        if (email) {
          setUser({ name, email, phone, isLocalOnly: true });
        }
      }
    };
    
    checkLocalAuth();

    // Clean up the listener
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};