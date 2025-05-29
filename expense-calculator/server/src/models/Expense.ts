import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

// Indexes for faster queries
expenseSchema.index({ month: 1, year: 1 });
expenseSchema.index({ date: 1 });

export const Expense = mongoose.model('Expense', expenseSchema); 