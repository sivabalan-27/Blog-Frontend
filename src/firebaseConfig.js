import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAj3ve-10e_sOBN1UPBKbT8yiqqUGSeyws",
  authDomain: "blog-app-cb890.firebaseapp.com",
  projectId: "blog-app-cb890",
  storageBucket: "blog-app-cb890.appspot.com",
  //storageBucket: "blog-app-cb890.firebasestorage.app",
  messagingSenderId: "263834434907",
  appId: "1:263834434907:web:b3cb82602bab88d8936e7e",
  measurementId: "G-7N7YB4M74E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
