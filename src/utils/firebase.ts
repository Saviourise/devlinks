import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "devlinks-dcc60.firebaseapp.com",
  projectId: "devlinks-dcc60",
  storageBucket: "devlinks-dcc60.appspot.com",
  messagingSenderId: "343776212439",
  appId: "1:343776212439:web:157947ef2ae7504ad1c792",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
