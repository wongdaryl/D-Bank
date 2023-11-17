import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const payments = (await sql`SELECT * FROM payment`).rows;
        res.status(200).json(payments);
    }
}
