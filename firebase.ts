// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig2 = {
  apiKey: "AIzaSyB1m_8wcK-yxJb3WzcUv6ra0OVvTqEY0SM",
  authDomain: "first-project-6c1af.firebaseapp.com",
  databaseURL: "https://first-project-6c1af-default-rtdb.firebaseio.com",
  projectId: "first-project-6c1af",
  storageBucket: "first-project-6c1af.appspot.com",
  messagingSenderId: "175994969707",
  appId: "1:175994969707:web:fd4b9dd7584c8a241c5b2e",
  measurementId: "G-EP9T2D77BQ",
};

const firebaseConfig = {
  apiKey: "AIzaSyAAkqQYSy0mUK326NCG6FFllYO0Q0TPsQA",
  authDomain: "results-94c30.firebaseapp.com",
  projectId: "results-94c30",
  storageBucket: "results-94c30.appspot.com",
  messagingSenderId: "1000428286448",
  appId: "1:1000428286448:web:fb743eee4c36d61e202d35",
  measurementId: "G-S09JREBNWT",
};

const app = initializeApp(firebaseConfig2);
const storage = getStorage(app);
export { storage, app };
