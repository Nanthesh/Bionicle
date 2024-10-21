import { initializeApp } from "firebase/app";

import { getAuth, signInWithPopup, GoogleAuthProvider,sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "./firebase";
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const sendResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };