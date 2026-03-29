import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            passwordHash
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

export default router;