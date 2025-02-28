const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Omkar@2006",
    database: "registerdb"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Save Profile Data
app.post("/saveProfile", (req, res) => {
    const { name, email, mobile } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.status(500).json({ success: false });
            return;
        }

        if (result.length > 0) {
            db.query(
                "UPDATE users SET name = ?, mobile = ? WHERE email = ?",
                [name, mobile, email],
                (err) => {
                    if (err) {
                        res.status(500).json({ success: false });
                        return;
                    }
                    res.json({ success: true });
                }
            );
        } else {
            db.query(
                "INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)",
                [name, email, mobile],
                (err) => {
                    if (err) {
                        res.status(500).json({ success: false });
                        return;
                    }
                    res.json({ success: true });
                }
            );
        }
    });
});

// Fetch Profile Data
app.get("/getProfile", (req, res) => {
    const email = req.query.email;

    db.query("SELECT name, email, mobile FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.status(500).json({ success: false });
            return;
        }

        if (result.length > 0) {
            res.json({ success: true, ...result[0] });
        } else {
            res.json({ success: false });
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
