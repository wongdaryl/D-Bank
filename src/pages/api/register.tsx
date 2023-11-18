import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    message: string;
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { name, username, password, dateOfBirth, monthlyIncome } = req.body;

    const result = await sql`SELECT * FROM "user" WHERE username = ${username}`;

    if (result.rows.length > 0) {
        // user already exists in database
        res.status(409).json({ message: "User already exists" });
        return;
    }

    await sql`INSERT INTO "user" (name, username, password, date_of_birth, monthly_income, role) VALUES (${name}, ${username}, ${password}, ${dateOfBirth}, ${monthlyIncome},'user')`;

    res.status(201).json({ message: "Registration successful" });
}
