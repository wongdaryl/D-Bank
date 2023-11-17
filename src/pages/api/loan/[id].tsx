import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from ".";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { id } = req.query;
        const userId = req.headers["x-user-id"];
        const role = req.headers["x-user-role"];

        if (typeof id !== "string") {
            res.status(400).json({ message: "Invalid loan id" });
            return;
        } else if (typeof userId !== "string") {
            res.status(400).json({ message: "Invalid header user id" });
            return;
        } else if (typeof role !== "string") {
            res.status(400).json({ message: "Invalid header user role" });
            return;
        }

        const loans = (await sql`SELECT * FROM loan WHERE id = ${id}`).rows;

        if (!loans || loans.length === 0) {
            res.status(404).json({ message: "Loan not found" });
            return;
        }

        const loan = loans[0];
        console.log("userId", userId);
        console.log("loan.user_id", loan.user_id);
        if (role !== "admin" && loan.user_id !== parseInt(userId)) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const payments = (
            await sql`SELECT * FROM payment WHERE loan_id = ${loan.id} ORDER BY date ASC`
        ).rows;
        const {
            outstandingAmount: outstandingAmount,
            totalPayments: totalPayments,
        } = calculateOutstanding(loan, payments);
        loan.outstanding_amount = outstandingAmount;
        loan.amount_paid = totalPayments;

        res.status(200).json(loans);
    }
}
