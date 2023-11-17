import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const db = await getDB();

        const loans = await db.all("SELECT * FROM loan");

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
    } else if (req.method === "POST") {
        const { userId, amount, currency, startDate, endDate, interestRate } =
            req.body;

        const db = await getDB();

        const insertLoanSql = `INSERT INTO loan(user_id, amount, currency, start_date, end_date, interest_rate, amount_paid, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(insertLoanSql, [
            userId,
            amount,
            currency,
            startDate,
            endDate,
            interestRate,
            0,
            "pending",
        ]);

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

    const outstandingAmount = amount + accruedInterest - totalPayments;
    return { outstandingAmount, totalPayments };
};
