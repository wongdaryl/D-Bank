import path from "path";
import { open } from "sqlite";
import { Database } from "sqlite3";
path.resolve(__dirname, __filename);

let db: any = null;

async function openDB() {
    db = await open({
        filename: "./collection.db",
        driver: Database,
    });
}

export const getDB = async () => {
    if (db === null) await openDB();
    return db;
};
