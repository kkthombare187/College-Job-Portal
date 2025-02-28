const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables from env.env file
const envPath = path.resolve(__dirname, "env.env")
console.log("Loading environment variables from:", envPath)
dotenv.config({ path: envPath })

console.log("Environment variables:")
console.log("DB_HOST:", process.env.DB_HOST)
console.log("DB_USER:", process.env.DB_USER)
console.log("DB_PASSWORD:", process.env.DB_PASSWORD)
console.log("DB_NAME:", process.env.DB_NAME)
console.log("PORT:", process.env.PORT)

const app = express()
app.use(cors())
app.use(express.json())

// Create a MySQL connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

console.log("Database configuration:", dbConfig)

const db = mysql.createConnection(dbConfig)

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err)
    return
  }
  console.log("Connected to MySQL database")

  // Create users table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      mobile VARCHAR(15) NOT NULL,
      gender ENUM('male', 'female', 'other') NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating users table:", err)
    } else {
      console.log("Users table created or already exists")
    }
  })
})

// Registration endpoint
app.post("/register", async (req, res) => {
  const { username, email, mobile, gender, password } = req.body

  console.log("Received registration request:", { username, email, mobile, gender })

  // Simple validation
  if (!username || !email || !mobile || !gender || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    const query = "INSERT INTO users (username, email, mobile, gender, password) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [username, email, mobile, gender, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error registering user:", err)
        return res.status(500).json({ message: "Error registering user", error: err.message })
      }
      console.log("User registered successfully:", result)
      res.status(201).json({ message: "User registered successfully" })
    })
  } catch (error) {
    console.error("Error hashing password:", error)
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

// Profile API route
app.get('/profile', (req, res) => {
  const email = req.query.email;
  if (!email) {
      return res.status(400).json({ message: "Email is required" });
  }

  const query = 'SELECT username, email, mobile, gender FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
      }

      if (result.length > 0) {
          res.json(result[0]);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body

  console.log("Received login request for email:", email)

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  // Check if user exists
  const query = "SELECT * FROM users WHERE email = ?"
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error querying database:", err)
      return res.status(500).json({ message: "Error logging in", error: err.message })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const user = results[0]

    // Compare passwords
    try {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
      }

      // Login successful
      console.log("User logged in successfully:", { id: user.id, username: user.username, email: user.email })
      res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
      console.error("Error comparing passwords:", error)
      res.status(500).json({ message: "Error logging in", error: error.message })
    }
  })
})

const PORT = process.env.PORT || 5000; // Change from 3000 to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


