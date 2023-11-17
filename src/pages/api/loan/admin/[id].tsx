import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../../../util/dbUtil";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PATCH") {
        const { status, role } = req.body;

        if (role !== "admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const { id } = req.query;

        const db = await getDB();

        const updateLoanSql = `UPDATE  SET status = ? WHERE id = ?`;
        await db.run(updateLoanSql, [status, id]);

        res.status(200).json({ message: "Loan updated successfully" });
    }
}
