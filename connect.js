const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
    "./collection.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        name TEXT,
        username TEXT,
        password TEXT,
        role TEXT
      )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created user table.");

            // Clear the existing data in the user table
            db.run(`DELETE FROM user`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from user");

                // Insert new data into the user table
                const values = [
                    [1, "Bobby Tan", "bobbytan", "password", "user"],
                    [2, "Bobby Admin", "admin", "admin", "admin"],
                ];
                const insertUserSql = `INSERT INTO user(id, name, username, password, role) VALUES(?, ?, ?, ?, ?)`;

                for (let i = 0; i < values.length; i++) {
                    db.run(insertUserSql, values[i], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const id = this.lastID; // get the id of the last inserted row
                        console.log(`Rows inserted, ID ${id}`);
                    });
                }
            });
        }
    );
    db.run(
        `CREATE TABLE IF NOT EXISTS loan (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        amount DOUBLE,
        currency TEXT,
        start_date TEXT,
        end_date TEXT,
        interest_rate DOUBLE,
        amount_paid DOUBLE,
        status TEXT,
        FOREIGN KEY (user_id) REFERENCES user (id)
      )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created loan table.");

            // Clear the existing data in the user table
            db.run(`DELETE FROM loan`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from loan");

                // Insert new data into the user table
                const values = [
                    [1, 1, 1000, "SGD", "2023-10-01", "2024-01-01", 0.05, 0, "active"],
                    [2, 1, 2000, "SGD", "2023-10-01", "2024-01-01", 0.05, 0, "active"],
                    [3, 1, 1000, "SGD", "2023-12-01", "2024-03-01", 0.05, 0, "pending"],
                ];
                const insertLoanSql = `INSERT INTO loan(id, user_id, amount, currency, start_date, end_date, interest_rate, amount_paid, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                for (let i = 0; i < values.length; i++) {
                    db.run(insertLoanSql, values[i], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const id = this.lastID; // get the id of the last inserted row
                        console.log(`Rows inserted, ID ${id}`);
                    });
                }

                
            });
        }
    );
    db.run(
        `CREATE TABLE IF NOT EXISTS payment (
        id INTEGER PRIMARY KEY,
        loan_id INTEGER,
        amount DOUBLE,
        date TEXT,
        FOREIGN KEY (loan_id) REFERENCES loan (id)
      )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created payment table.");

            db.run(`DELETE FROM payment`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from payment");

                // Insert new data into the user table
                const values = [
                    [1, 200, "2023-10-10"],
                    [1, 400, "2023-10-20"],
                ];
                const insertPaymentSql = `INSERT INTO payment(loan_id, amount, date) VALUES(?, ?, ?)`;

                for (let i = 0; i < values.length; i++) {
                    db.run(insertPaymentSql, values[i], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const id = this.lastID; // get the id of the last inserted row
                        console.log(`Rows inserted, ID ${id}`);
                    });
                }

                //   Close the database connection after all insertions are done
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("Closed the database connection.");
                });
            });
        }
    );
});
