const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const logger = require('../utils/logger');

const register = async (req, res) => {
    try {
        const { name, email, password, role, team } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to database
        const newUser = await createUser(name, email, hashedPassword, role || 'user', team || null);

        res.status(201).json({ 
            status: 'success', 
            message: 'User registered successfully', 
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, team: newUser.team } 
        });
    } catch (error) {
        logger.error('Registration Error: %o', error);
        res.status(500).json({ status: 'error', message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, team: user.team },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, team: user.team }
        });
    } catch (error) {
        logger.error('Login Error: %o', error);
        res.status(500).json({ status: 'error', message: 'Server error during login' });
    }
};

module.exports = { register, login };