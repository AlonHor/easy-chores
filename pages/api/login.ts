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
import { randomUUID } from "crypto";
import { SHA3 } from "sha3";

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
    let { email, password } = req.body;
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest("hex");
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.docs.length < 1)
      res.status(400).json({ error: "No user with that email!" });
    else {
      const user = userSnapshot.docs.map((doc) => doc.data())[0];
      if (user.password === password) {
        const token = randomUUID();
        await setDoc(doc(db, "users", user.id), { token }, { merge: true });
        res.status(200).json({ token });
      } else res.status(400).json({ error: "Incorrect password!" });
    }
  }
}
