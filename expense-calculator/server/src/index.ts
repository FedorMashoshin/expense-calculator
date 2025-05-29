import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import uploadRouter from './routes/upload';
import expensesRouter from './routes/expenses';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/expenses', expensesRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});