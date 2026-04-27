const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { name, email, password, role, team } = req.body;

        // 1. Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save to database
        const newUser = await createUser(name, email, hashedPassword, role || 'user', team || null);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Generate JWT Token (Your "Digital ID Card")
        const token = jwt.sign(
            { id: user.id, role: user.role, team: user.team },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, team: user.team }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { register, login };