import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnqe082_v4H_qkYa3fM-QOiR_EuB2G8r0",
  authDomain: "web-firebase-79aed.firebaseapp.com",
  projectId: "web-firebase-79aed",
  storageBucket: "web-firebase-79aed.appspot.com",
  messagingSenderId: "672750416263",
  appId: "1:672750416263:web:b911c7e2985824e94d2322",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
