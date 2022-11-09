import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "../../utils/auth";

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
      const choresQuery = query(
        collection(db, "chores"),
        where("userId", "==", user.id)
      );
      const choresSnapshot = await getDocs(choresQuery);
      const chores = choresSnapshot.docs.map((doc) => doc.data());
      res.status(200).json(chores);
    }
  }
}
