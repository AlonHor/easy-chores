import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { token } = req.body;
    const userQuery = query(
      collection(db, "users"),
      where("token", "==", token)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.docs.length < 1)
      res.status(400).json({ error: "User not found!" });
    else {
      const user = userSnapshot.docs.map((doc) => doc.data())[0];
      await setDoc(doc(db, "users", user.id), { token: null }, { merge: true });
      res.status(200).json({ message: "Logged out!" });
    }
  }
}
