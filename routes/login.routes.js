import { Router } from "express";
import db from '../config/db.js'

const router =  Router();

router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;
        
        if (password === storedPassword) {
          // Successful login
          res.status(200).json({ 
            message: "Login successful",
            user: {
              id: user.id,
              email: user.email
            }
          });
        } else {
          // Incorrect password
          res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        // User not found
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "An error occurred during login. Please try again later." });
    }
  });


export default router;