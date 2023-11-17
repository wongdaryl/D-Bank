import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from "..";
import { getDB } from "../../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    const db = await getDB();

    if (req.method === "GET") {
        const loans = await db.all("SELECT * FROM loan WHERE user_id = ?", [
            userId,
        ]);

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

        console.log(loans);

        res.status(200).json(loans);
    }
}
