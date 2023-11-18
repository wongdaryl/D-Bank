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
        const userId = req.headers["x-user-id"];
        if (typeof userId !== "string") {
            res.status(400).json({ message: "Invalid header user id" });
            return;
        }
        const role = req.headers["x-user-role"];
        if (typeof role !== "string") {
            res.status(400).json({ message: "Invalid header user role" });
            return;
        }
        
        const { status } = req.body;

        const userRows = (await sql`SELECT * FROM "user" WHERE id = ${userId}`).rows;
        if (!userRows || userRows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = userRows[0];
        if (user.role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        await sql`UPDATE loan SET status = ${status} WHERE id = ${id}`;
        // const updateLoanSql = `UPDATE  SET status = ? WHERE id = ?`;
        // await db.run(updateLoanSql, [status, id]);

        res.status(200).json({ message: "Loan updated successfully" });
    }
}
