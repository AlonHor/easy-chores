import { randomUUID } from "crypto";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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
    let { name, day, token } = req.body;
    const user = await getUserFromToken(token);
    if (!user) res.status(400).json({ error: "User not found!" });
    else {
      const id = randomUUID();
      const newChore = {
        name,
        day,
        userId: user.id,
        id,
      };
      await setDoc(doc(db, "chores", id), newChore);
      res.status(200).json({ message: "Chore created!" });
    }
  }
}
