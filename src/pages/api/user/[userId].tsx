import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    const db = await getDB();

    if (req.method === "GET") {
        const user = await db.get("SELECT * FROM user WHERE id = ?", [userId]);
        res.status(200).json(user);
    }
}
