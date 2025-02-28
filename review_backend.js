const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 4000; // Use an available port

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Omkar@2006",
  database: "auth_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL");
});

// API to add a review
app.post("/addReview", (req, res) => {
  const { username, review_text } = req.body;
  const sql = "INSERT INTO reviews (username, review_text) VALUES (?, ?)";
  db.query(sql, [username, review_text], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Review added successfully" });
  });
});

// API to get reviews
app.get("/getReviews", (req, res) => {
  const sql = "SELECT * FROM reviews ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
