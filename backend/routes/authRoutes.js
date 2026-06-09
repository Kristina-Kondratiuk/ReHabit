import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,72}$/.test(password);
};

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, photoUri } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: "Password must be 8-72 characters long and contain at least one uppercase letter and one special character"
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
            passwordHash,
            photoUri
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
                email: user.email,
                photoUri: user.photoUri
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                photoUri: user.photoUri
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

//GET /auth/me
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// PATCH /auth/me
router.patch("/me", authMiddleware, async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({
                message: "At least one field is required"
            });
        }

        if (email && !isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.user.userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already in use"
                });
            }
        }

        const updateData = {};

        if (username) {
            updateData.username = username;
        }

        if (email) {
            updateData.email = email;
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// PATCH /auth/me/photo
router.patch("/me/photo", authMiddleware, async (req, res) => {
    try {
        const { photoUri } = req.body;

        if (photoUri === undefined) {
            return res.status(400).json({
                message: "Photo URI is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { photoUri },
            { new: true }
        ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Photo updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;