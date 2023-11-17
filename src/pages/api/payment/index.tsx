import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const db = await getDB();

        const payments = await db.all("SELECT * FROM payment");

        res.status(200).json(payments);
    } 
}