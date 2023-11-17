import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../../../util/dbUtil";
import { calculateOutstanding } from "../../loan";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { loanId } = req.query;
    const db = await getDB();

    if (req.method === "GET") {
        const payments = await db.all(
            "SELECT * FROM payment WHERE loan_id = ?",
            [loanId]
        );

        res.status(200).json(payments);
    } else if (req.method === "POST") {
        const { userId, amount, loanId } = req.body;

        const db = await getDB();

        const loan = await db.get("SELECT * FROM loan WHERE id = ?", [loanId]);

        if (!loan) {
            res.status(404).json({ message: "Loan not found" });
            return;
        } else if (loan.user_id !== userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const payments = await db.all(
            "SELECT * FROM payment WHERE loan_id = ? ORDER BY date ASC",
            [loanId]
        );
        const {
            outstandingAmount: outstandingAmount,
            totalPayments: totalPayments,
        } = calculateOutstanding(loan, payments);

        if (amount > outstandingAmount) {
            res.status(400).json({ message: "Invalid payment amount" });
            return;
        }

        // Get today's date in YYYY-MM-DD format as a string
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const date = `${year}-${month}-${day}`;

        const insertPaymentSql = `INSERT INTO payment(loan_id, amount, date) VALUES(?, ?, ?)`;

        db.run(insertPaymentSql, [loanId, amount, date]);

        if (amount === outstandingAmount) {
            const updateLoanSql = `UPDATE loan SET status = ? WHERE id = ?`;
            await db.run(updateLoanSql, ["paid", loanId]);
        }

        res.status(201).json({ message: "Payment created successfully" });
    }
}
