import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6fCApyKhEX8Kebp2OhNuJlDXqaj43gn8",
  authDomain: "file-management-system-160f9.firebaseapp.com",
  projectId: "file-management-system-160f9",
  storageBucket: "file-management-system-160f9.appspot.com",
  messagingSenderId: "731942364385",
  appId: "1:731942364385:web:a69194c11394f6ba0003a0"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);


export default fire;