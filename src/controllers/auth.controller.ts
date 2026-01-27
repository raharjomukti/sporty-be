import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

export const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        
        // create and sign JWT
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1d",
        })
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })    
        } catch (error) {
            console.error("Signin error:", error);
            res.status(500).json({ message: "Server error"});
    }
};

export const initiateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if an admin user already exists
        const count = await User.countDocuments({});
        if (count > 0) {
            res.status(400).json({ message: "Admin already exists, we can only  1 admin user, please delete database for create new admin" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "Admin user created successfully" });
    } catch (error) {
        console.error("Initiate admin error:", error);
        res.status(500).json({ message: "Server error" });
    }
};