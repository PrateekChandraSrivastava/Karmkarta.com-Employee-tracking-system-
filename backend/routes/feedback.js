import express from 'express';
import Feedback from '../models/Feedback.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /feedback - Submit new feedback
router.post('/', verifyToken, async (req, res) => {
    try {
        const { from_user, to_employee, comment, rating, date } = req.body;
        // You can enhance validation here if needed
        const feedback = await Feedback.create({
            from_user,
            to_employee,
            comment,
            rating,
            date,
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /feedback - Retrieve feedback entries (optionally filtered by employee)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { to_employee } = req.query;
        let feedbacks;
        if (to_employee) {
            feedbacks = await Feedback.findAll({ where: { to_employee } });
        } else {
            feedbacks = await Feedback.findAll();
        }
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
