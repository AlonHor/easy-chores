import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "../../utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { token } = req.body;
    const user = await getUserFromToken(token);
    if (!user) res.status(400).json({ error: "User not found!" });
    else res.status(200).json({ email: user.email, id: user.id });
  }
}
