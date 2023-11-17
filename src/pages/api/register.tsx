import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../util/dbUtil";

type Data = {
    message: string;
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { name, username, password } = req.body;
    const db = await getDB();

    const user = await db.get("SELECT * FROM user WHERE username = ?", [
        username,
    ]);

    if (user) {
        // user already exists in database
        res.status(409).json({ message: "User already exists" });
        return;
    }

    const insertUserSql = `INSERT INTO user(name, username, password, role) VALUES(?, ?, ?, ?)`;

    db.run(insertUserSql, [name, username, password, "user"], (err: any) => {
        if (err) {
            return console.error(err.message);
        }
    });

    res.status(201).json({ message: "Registration successful" });
}
