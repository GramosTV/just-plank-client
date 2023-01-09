import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBtNX-Gs4M6n6pq5NnUMPhF9GULtqcUC9I",
    authDomain: "just-plank.firebaseapp.com",
    projectId: "just-plank",
    storageBucket: "just-plank.appspot.com",
    messagingSenderId: "1019359633712",
    appId: "1:1019359633712:web:50ecda3058260a6de5a8f5",
    measurementId: "G-7E3MJPG64B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, provider)
    .then((result: any) => {
      console.log(result);
      return result.user.accessToken;
    })
    .catch((error) => {
      console.log(error);
      return false
    });
};