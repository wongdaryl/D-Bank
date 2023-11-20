import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";
import { calculateOutstanding } from "../../loan";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    if (typeof userId !== "string") {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }
    const fromUserId = req.headers["x-user-id"];
    if (typeof fromUserId !== "string") {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }
    const fromUserRole = req.headers["x-user-role"];
    if (typeof fromUserRole !== "string") {
        res.status(400).json({ message: "Invalid user role" });
        return;
    }

    if (req.method === "GET") {
        if (fromUserRole !== "admin" && fromUserId !== userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const result = await sql`SELECT * FROM "user" WHERE id = ${userId}`;
        const user = result.rows[0];

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

        user.loans = loans;
        res.status(200).json(user);
    }
}
