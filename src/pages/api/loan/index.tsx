import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const loans = (await sql`SELECT * FROM loan`).rows;

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
    } else if (req.method === "POST") {
        const {
            userId,
            type,
            amount,
            currency,
            startDate,
            endDate,
            interestRate,
        } = req.body;

        await sql`INSERT INTO loan(user_id, type, amount, currency, start_date, end_date, interest_rate, status) VALUES(${userId}, ${type}, ${amount}, ${currency}, ${startDate}, ${endDate}, ${interestRate}, 'pending')`;
        res.status(201).json({ message: "Loan created successfully" });
    }
}

export const calculateOutstanding = (loan: any, payments: any) => {
    const { amount, start_date, interest_rate, status } = loan;

    if (status === "paid") {
        return { outstandingAmount: 0, totalPayments: amount };
    } else if (status === "pending") {
        return { outstandingAmount: amount, totalPayments: 0 };
    }

    let accruedInterest = 0;
    let totalPayments = 0;
    let prev_date = new Date(start_date);

    const DAYS_IN_YEAR = 365;

    for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        const date = new Date(payment.date);
        const daysSinceLastPayment = Math.floor(
            (date.getTime() - prev_date.getTime()) / (1000 * 3600 * 24)
        );
        const interest =
            amount * interest_rate * (daysSinceLastPayment / DAYS_IN_YEAR);
        accruedInterest += interest;
        totalPayments += payment.amount;
        prev_date = date;
    }
    const daysSinceLastPayment = Math.floor(
        (new Date().getTime() - prev_date.getTime()) / (1000 * 3600 * 24)
    );
    const interest =
        amount * interest_rate * (daysSinceLastPayment / DAYS_IN_YEAR);
    accruedInterest += interest;

    // round float to nearest 2 decimal places
    const outstandingAmount =
        Math.round((amount + accruedInterest - totalPayments) * 100) / 100;
    return { outstandingAmount, totalPayments };
};
