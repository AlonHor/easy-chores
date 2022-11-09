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
    if (email && password) {
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        res.status(400).json({ error: "Invalid email" });
        return;
      }
      if (password.length < 6) {
        res
          .status(400)
          .json({ error: "Password must be at least 8 characters" });
        return;
      }
    } else {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const hash = new SHA3(512);
    hash.update(password);
    password = hash.digest("hex");
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.docs.length > 0)
      res.status(400).json({ error: "User already exists" });
    else {
      const token = randomUUID();
      const id = randomUUID();
      const newUser = {
        email,
        password,
        token,
        id,
      };
      await setDoc(doc(db, "users", id), newUser);
      res.status(200).json({ token });
    }
  }
}
