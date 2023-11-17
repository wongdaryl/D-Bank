import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from "..";

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
        const loans = (await sql`SELECT * FROM loan WHERE user_id = ${userId}`)
            .rows;

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
