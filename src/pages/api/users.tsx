import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const users = await sql`SELECT * FROM "user"`;

    res.status(200).json(users.rows);
}