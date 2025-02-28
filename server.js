// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS  // Your app password
//     }
// });

// app.post('/send-email', async (req, res) => {
//     const { email, name, date, timeSlot,con_job } = req.body;

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Job Application Confirmation',
//         text: `Dear ${name},\n\nYou have successfully applied for a part-time job.\nDate: ${date}\nTime Slot: ${timeSlot}\nYour Job:${con_job}\n\Complete your work on time!\nBest of luck!\n\nRegards,\nCollege Job Portal`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ success: true, message: 'Email sent successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error sending email' });
//     }
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",        // Change this if you have a different MySQL username
    password: "Omkar@2006",        // Enter your MySQL password here
    database: "registerdb" // Ensure this matches your database name
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database");
    }
});

// Job Application API Endpoint
app.post("/apply-job", (req, res) => {
    const { firstName, lastName, email, mobile, year, branch, division, date, timeSlot, con_job, experience } = req.body;

    const sql = `INSERT INTO job_applications (first_name, last_name, email, mobile, year, branch, division, work_date, time_slot, job_role, experience)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [firstName, lastName, email, mobile, year, branch, division, date, timeSlot, con_job, experience], (err, result) => {
        if (err) {
            console.error("❌ Error inserting job application:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // Send Email Notification
        sendEmail(email, firstName + " " + lastName, date, timeSlot, con_job);

        res.status(200).json({ message: "Application submitted successfully!" });
    });
});

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "college.job24@gmail.com",  // Replace with your email
        pass: "tiku jasm btgs bqpb"   // Replace with your email app password (NOT your Gmail password)
    }
});

// Function to Send Email Notification
function sendEmail(email, name, date, timeSlot, job) {
    const mailOptions = {
        from: "college.job24@gmail.com", // Replace with your email
        to: email,
        subject: "Job Application Confirmation",
        text: `Dear ${name},\n\nYour job application has been successfully submitted!\n\n📅 Date: ${date}\n⏰ Time Slot: ${timeSlot}\n💼 Job Role: ${job}\n\nBest of luck!\nCollege Job Portal`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error sending email:", error);
        } else {
            console.log("📧 Email sent:", info.response);
        }
    });
}

// Start the Server
app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});
