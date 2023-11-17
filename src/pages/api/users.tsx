import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../util/dbUtil";

type Data = {
    users: any;
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const db = await getDB();

    const users = await db.all("SELECT * FROM user ");

    res.status(200).json(users);
}