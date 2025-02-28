import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// In production, use an environment variable for the secret
const JWT_SECRET = 'your_jwt_secret';
const SALT_ROUNDS = 10;

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, password, role, email, department, position, manager_id } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
        });
        console.log('User created:', newUser);

        // If the user is registering as an employee, also create an Employee record
        if (role.toLowerCase() === 'employee') {
            console.log("Creating employee record with:", {
                name: username,
                email: email || `${username}@example.com`,
                department: department || null,
                position: position || null,
                manager_id: manager_id || null,
            });
            const employeeRecord = await Employee.create({
                name: username, // Consider collecting a separate "name" field in a real app.
                email: email || `${username}@example.com`,
                department: department || null,
                position: position || null,
                manager_id: manager_id || null,
            });
            console.log("Employee record created:", employeeRecord);
        }
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: err.message });
    }
});


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Compare the password with the stored hashed password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Create a JWT token (valid for 1 hour)
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
