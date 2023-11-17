import path from "path";
import { open } from "sqlite";
import { Database } from "sqlite3";
const dir = path.resolve(__dirname);

let db: any = null;

async function openDB() {
    console.log('dir', dir);
    db = await open({
        filename: "./collection.db",
        driver: Database,
    });
}

export const getDB = async () => {
    if (db === null) await openDB();
    return db;
};
