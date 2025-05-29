import express from 'express';
import { Expense } from '../models/Expense';

const router = express.Router();

// Get expenses with optional month and year filters
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        const query: any = {};

        if (month && year) {
            query.month = parseInt(month as string);
            query.year = parseInt(year as string);
        } else if (year) {
            query.year = parseInt(year as string);
        } else {
            // Default to last month
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            query.month = date.getMonth() + 1;
            query.year = date.getFullYear();
        }

        const expenses = await Expense.find(query).sort({ date: 1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
});

// Add new expenses
router.post('/', async (req, res) => {
    try {
        const expenses = req.body;
        const savedExpenses = await Expense.insertMany(expenses);
        res.status(201).json(savedExpenses);
    } catch (error) {
        res.status(500).json({ message: 'Error saving expenses', error });
    }
});

// Get available years and months
router.get('/periods', async (req, res) => {
    try {
        const periods = await Expense.aggregate([
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month'
                    }
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1
                }
            }
        ]);

        const years = [...new Set(periods.map(p => p._id.year))];
        const months = [...new Set(periods.map(p => p._id.month))];

        res.json({ years, months });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching periods', error });
    }
});

export default router; 