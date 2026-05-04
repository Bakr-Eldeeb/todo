import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // optional

const firebaseConfig = {
  apiKey: "AIzaSyB30RdPsDx8nCyUMUD-9tEPzgWMwEmwcCc",
  authDomain: "todo-share-40bfa.firebaseapp.com",
  projectId: "todo-share-40bfa",
  storageBucket: "todo-share-40bfa.appspot.com",
  messagingSenderId: "296214164614",
  appId: "1:296214164614:web:d9940b2b56fbb2744a0d07",
  measurementId: "G-KGZTWTKEBC"
};

const app = initializeApp(firebaseConfig);


// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);