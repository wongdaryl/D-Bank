import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    if (typeof userId !== "string") {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }
    const fromUserId = req.headers["x-user-id"];
    if (typeof fromUserId !== "string") {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }
    const fromUserRole = req.headers["x-user-role"];
    if (typeof fromUserRole !== "string") {
        res.status(400).json({ message: "Invalid user role" });
        return;
    }

    if (req.method === "GET") {
        if (fromUserRole !== "admin" && fromUserId !== userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const result = await sql`SELECT * FROM "user" WHERE id = ${userId}`;
        const user = result.rows[0];
        res.status(200).json(user);
    }
}
