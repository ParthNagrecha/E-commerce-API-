import db from '../config/db.js'

import { Router } from "express";


const router = Router();

router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    // Basic input validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if user already exists
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: "Email already exists. Try logging in." });
        }

        // Insert new user
        const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING uid, email",
            [email, password]
        );

        // Log success (consider using a proper logging library in production)
        console.log("User registered:", result.rows[0]);

        // Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (err) {
        // Log the error (consider using a proper logging library in production)
        console.error("Registration error:", err);

        // Determine if it's a database constraint violation
        if (err.code === '23505') { // unique_violation
            return res.status(409).json({ message: "Email already exists. Try logging in." });
        }

        // For any other error, send a generic error message
        res.status(500).json({ message: "An error occurred during registration. Please try again later." });
    }
});

export default router;