import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from ".";
import { getDB } from "../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const db = await getDB();
    if (req.method === "GET") {
        const { id } = req.query;
        if (typeof id !== "string") {
            res.status(400).json({ message: "Invalid loan id" });
            return;
        }

        // const loans = await db.all("SELECT * FROM loan WHERE id = ?", [id]);
        const loans = (await sql`SELECT * FROM loan WHERE id = ${id}`).rows;

        if (!loans || loans.length === 0) {
            res.status(404).json({ message: "Loan not found" });
            return;
        }

        for (let i = 0; i < loans.length; i++) {
            const payments = (
                await sql`SELECT * FROM payment WHERE loan_id = ${loans[i].id} ORDER BY date ASC`
            ).rows;
            const {
                outstandingAmount: outstandingAmount,
                totalPayments: totalPayments,
            } = calculateOutstanding(loans[i], payments);
            loans[i].outstanding_amount = outstandingAmount;
            loans[i].amount_paid = totalPayments;
        }
        res.status(200).json(loans);
    }
}
