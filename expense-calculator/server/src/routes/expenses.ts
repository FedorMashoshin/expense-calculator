import { Router, Request, Response } from 'express';
import { Expense } from '../models/Expense';

const router = Router();

// Get expenses with optional month and year filters
router.get('/', async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        const query: { month?: number; year?: number } = {};

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
        const results = await Expense.aggregate([
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalExpenses: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: [
                                    { $lte: ["$_id.month", 9] },
                                    { $concat: ["0", { $toString: "$_id.month" }] },
                                    { $toString: "$_id.month" }
                                ]
                            }
                        ]
                    },
                    totalExpenses: 1
                }
            },
            { $sort: { date: -1 } }
        ]);

        res.json(results);
    } catch (error) {
        console.error('Error fetching periods:', error);
        res.status(500).json({ message: 'Error fetching periods', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router; 