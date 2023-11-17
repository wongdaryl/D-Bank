import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        const { id } = req.query;
        if (typeof id !== "string") {
            res.status(400).json({ message: "Invalid loan id" });
            return;
        }
        
        const { status, role } = req.body;

        if (role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        

        await sql`UPDATE loan SET status = ${status} WHERE id = ${id}`;
        // const updateLoanSql = `UPDATE  SET status = ? WHERE id = ?`;
        // await db.run(updateLoanSql, [status, id]);

        res.status(200).json({ message: "Loan updated successfully" });
    }
}
