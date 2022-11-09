import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "../../../utils/auth";

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
    const user = await getUserFromToken(token);
    if (!user) res.status(400).json({ error: "User not found!" });
    else {
      const choreQuery = query(
        collection(db, "chores"),
        where("userId", "==", user.id),
        where("id", "==", req.query.id)
      );
      const choreSnapshot = await getDocs(choreQuery);
      const chore = choreSnapshot.docs.map((doc) => doc.data())[0];
      res.status(200).json(chore);
    }
  } else if (req.method === "PUT") {
    let { token, chore } = req.body;
    const userQuery = query(
      collection(db, "users"),
      where("token", "==", token)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.docs.length < 1)
      res.status(400).json({ error: "User not found!" });
    else {
      const user = userSnapshot.docs.map((doc) => doc.data())[0];
      const choreQuery = query(
        collection(db, "chores"),
        where("userId", "==", user.id),
        where("id", "==", req.query.id)
      );
      const choreSnapshot = await getDocs(choreQuery);
      const choreDoc = choreSnapshot.docs.map((doc) => doc)[0];
      await setDoc(choreDoc.ref, chore, { merge: true });
      res.status(200).json(chore);
    }
  } else if (req.method === "DELETE") {
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
      const choreQuery = query(
        collection(db, "chores"),
        where("userId", "==", user.id),
        where("id", "==", req.query.id)
      );
      const choreSnapshot = await getDocs(choreQuery);
      const choreDoc = choreSnapshot.docs.map((doc) => doc)[0];
      await deleteDoc(choreDoc.ref);
      res.status(200).json(choreDoc.data());
    }
  }
}
