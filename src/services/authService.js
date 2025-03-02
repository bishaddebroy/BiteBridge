import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { auth, db, storage } from './firebase';
  
  // Register a new user
  export const registerUser = async (email, password, userData) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: new Date(),
        ...userData
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  // Upload profile picture
  export const uploadProfilePicture = async (uri, userId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a reference to the location where we'll store the image
      const storageRef = ref(storage, `profilePictures/${userId}`);
      
      // Upload the image
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with the image URL
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      // Update the user document in Firestore
      await setDoc(doc(db, "users", userId), {
        photoURL: downloadURL
      }, { merge: true });
      
      return downloadURL;
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in a user
  export const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  // Sign out a user
  export const signOutUser = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Reset password
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  };