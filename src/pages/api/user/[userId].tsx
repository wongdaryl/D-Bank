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

    if (req.method === "GET") {
        const result = await sql`SELECT * FROM "user" WHERE id = ${userId}`;
        const user = result.rows[0];
        res.status(200).json(user);
    }
}
