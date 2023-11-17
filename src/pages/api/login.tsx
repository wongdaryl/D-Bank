import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { username, password } = req.body;

    const db = await getDB();

    const user = await db.get(
        "SELECT * FROM user WHERE username = ? AND password = ?",
        [username, password]
    );

    if (user) {
        res.status(200).json({ message: "Login successful", user });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
}
