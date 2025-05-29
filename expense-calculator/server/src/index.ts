import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import expenseRoutes from './routes/expenses';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});