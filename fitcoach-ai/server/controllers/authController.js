const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
    });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } 
     catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if(!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: error.message || "Unable to log in",
        });
    }
  
};

const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };