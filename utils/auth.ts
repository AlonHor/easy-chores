import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
});

const db = getFirestore(app);

export async function getUserFromToken(token: string): Promise<any> {
  const userQuery = query(collection(db, "users"), where("token", "==", token));
  const userSnapshot = await getDocs(userQuery);
  if (userSnapshot.docs.length < 1) return null;
  else {
    const user = userSnapshot.docs.map((doc) => doc.data())[0];
    return user;
  }
}
