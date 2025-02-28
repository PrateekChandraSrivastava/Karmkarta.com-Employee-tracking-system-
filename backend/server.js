import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config.js';  // Import Sequelize instance
import './models/index.js'; // This ensures all models are registered
import authRoutes from './routes/auth.js';  // Import auth routes
import { verifyToken } from './middleware/authMiddleware.js';
import employeeRoutes from './routes/employees.js';
import taskRoutes from './routes/tasks.js';
import goalRoutes from './routes/goals.js';
import performanceMetricsRoutes from './routes/performanceMetrics.js';
import feedbackRoutes from './routes/feedback.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Backend server is running!');
});


app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/tasks', taskRoutes);
app.use('/goals', goalRoutes);
app.use('/performance-metrics', performanceMetricsRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/reports', reportRoutes);


// Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.send(`Hello ${req.user.username}, you have access!`);
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Database connection successful!');
    } catch (error) {
        res.status(500).send(`Database connection failed: ${error.message}`);
    }
});

// Sync all defined models to the DB
sequelize
    .sync({ alter: true })  // Use { force: true } to drop and recreate tables (be cautious)
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

