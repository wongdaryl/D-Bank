import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from "../../loan";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { loanId } = req.query;
    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];
    if (typeof loanId !== "string") {
        res.status(400).json({ message: "Invalid loan id" });
        return;
    }

    if (req.method === "GET") {
        if (typeof userId !== "string") {
            res.status(400).json({ message: "Invalid header user id" });
            return;
        } else if (typeof role !== "string") {
            res.status(400).json({ message: "Invalid header user role" });
            return;
        }
        const loanResp = (await sql`SELECT * FROM loan WHERE id = ${loanId}`)
            .rows;

        if (!loanResp || loanResp.length === 0) {
            res.status(404).json({ message: "Loan not found" });
            return;
        } else if (
            role !== "admin" &&
            loanResp[0].user_id !== parseInt(userId)
        ) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const payments = (
            await sql`SELECT * FROM payment WHERE loan_id = ${loanId}`
        ).rows;
        res.status(200).json(payments);
    } else if (req.method === "POST") {
        const { userId, amount, loanId } = req.body;

        // const loan = await db.get("SELECT * FROM loan WHERE id = ?", [loanId]);
        const loanResp = (await sql`SELECT * FROM loan WHERE id = ${loanId}`)
            .rows;

        if (!loanResp || loanResp.length === 0) {
            res.status(404).json({ message: "Loan not found" });
            return;
        } else if (loanResp[0].user_id !== userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const loan = loanResp[0];

        // const payments = await db.all(
        //     "SELECT * FROM payment WHERE loan_id = ? ORDER BY date ASC",
        //     [loanId]
        // );

        const payments = (
            await sql`SELECT * FROM payment WHERE loan_id = ${loanId} ORDER BY date ASC`
        ).rows;
        const {
            outstandingAmount: outstandingAmount,
            totalPayments: totalPayments,
        } = calculateOutstanding(loan, payments);

        if (amount > outstandingAmount) {
            res.status(400).json({ message: "Payment amount too large" });
            return;
        }

        // Get today's date in YYYY-MM-DD format as a string
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const date = `${year}-${month}-${day}`;

        await sql`INSERT INTO payment(loan_id, amount, date) VALUES(${loanId}, ${amount}, ${date})`;
        // db.run(insertPaymentSql, [loanId, amount, date]);

        if (amount === outstandingAmount) {
            await sql`UPDATE loan SET status = ${"paid"} WHERE id = ${loanId}`;
        }
        res.status(201).json({ message: "Payment created successfully" });
    }
}
