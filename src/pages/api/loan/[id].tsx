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

        const loans = await db.all("SELECT * FROM loan WHERE id = ?", [id]);

        if (!loans || loans.length === 0) {
            res.status(404).json({ message: "Loan not found" });
            return;
        }

        for (let i = 0; i < loans.length; i++) {
            const payments = await db.all(
                "SELECT * FROM payment WHERE loan_id = ? ORDER BY date ASC",
                [loans[i].id]
            );
            const {
                outstandingAmount: outstandingAmount,
                totalPayments: totalPayments,
            } = calculateOutstanding(loans[i], payments);
            loans[i].outstanding_amount = outstandingAmount;
            loans[i].amount_paid = totalPayments;
        }
        res.status(200).json(loans);
    } else if (req.method === "PATCH") {
        const { paymentAmount, userId } = req.body;
        const { id } = req.query;

        const loan = await db.get("SELECT * FROM loan WHERE id = ?", [id]);

        if (loan.user_id !== userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        const payments = await db.all(
            "SELECT * FROM payment WHERE loan_id = ? ORDER BY date ASC",
            [id]
        );
        const {
            outstandingAmount: outstandingAmount,
            totalPayments: totalPayments,
        } = calculateOutstanding(loan, payments);

        const newOutstandingAmount = outstandingAmount - paymentAmount;

        if (newOutstandingAmount < 0) {
            res.status(400).json({ message: "Invalid payment amount" });
            return;
        } else if (newOutstandingAmount === 0) {
            const updateLoanSql = `UPDATE loan SET amount_paid = ?, status = ? WHERE id = ?`;
            await db.run(updateLoanSql, [paymentAmount, "paid", id]);
        } else {
            const updateLoanSql = `UPDATE loan SET amount_paid = ? WHERE id = ?`;
            await db.run(updateLoanSql, [paymentAmount, id]);
        }

        res.status(200).json({ message: "Loan updated successfully" });
    }
}
