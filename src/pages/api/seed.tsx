// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await sql`CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        name TEXT,
        username TEXT,
        password TEXT,
        role TEXT,
        monthly_income DOUBLE PRECISION,
        date_of_birth DATE
    );`;

    const values1 = [
        [1, "Bobby Tan", "bobbytan", "password", "user", 5000, "1999-27-11"],
        [2, "Bobby Admin", "admin", "admin", "admin", 5000, "1999-27-11"],
    ];

    for (const value of values1) {
        await sql`INSERT INTO "user" (id, name, username, password, role) VALUES (${value[0]}, ${value[1]}, ${value[2]}, ${value[3]}, ${value[4]})`;
    }

    await sql`CREATE TABLE IF NOT EXISTS loan (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        amount DOUBLE PRECISION,
        currency TEXT,
        start_date DATE,
        end_date DATE,
        interest_rate DOUBLE PRECISION,
        status TEXT,
        type TEXT,
        FOREIGN KEY (user_id) REFERENCES "user" (id)
    );`;

    const values2 = [
        [1, 1, 1000, "SGD", "2023-10-01", "2024-01-01", 0.05, "active", "car"],
        [2, 1, 2000, "SGD", "2023-10-01", "2024-01-01", 0.05, "active", "home"],
        [3, 1, 1000, "SGD", "2023-12-01", "2024-03-01", 0.05, "pending", "business"],
    ];

    for (const value of values2) {
        await sql`INSERT INTO loan (id, user_id, amount, currency, start_date, end_date, interest_rate, status) VALUES (${value[0]}, ${value[1]}, ${value[2]}, ${value[3]}, ${value[4]}, ${value[5]}, ${value[6]}, ${value[7]})`;
    }

    await sql`CREATE TABLE IF NOT EXISTS payment (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER,
        amount DOUBLE PRECISION,
        date DATE,
        FOREIGN KEY (loan_id) REFERENCES loan (id)
    );`

    const values3 = [
        [1, 200, "2023-10-10"],
        [1, 400, "2023-10-20"],
    ];

    for (const value of values3) {
        await sql`INSERT INTO payment (loan_id, amount, date) VALUES (${value[0]}, ${value[1]}, ${value[2]})`;
    }

    res.status(200).json({ name: "John Doe" });
}
