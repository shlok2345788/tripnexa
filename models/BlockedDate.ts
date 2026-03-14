import mongoose from 'mongoose';

const BlockedDateSchema = new mongoose.Schema({
    date: {
        type: String, // Storing as YYYY-MM-DD string for easy comparison
        required: [true, 'Please provide a date'],
        unique: true,
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason (e.g., Booking Full)'],
        default: 'Booking Full',
    },
}, { timestamps: true });

export default mongoose.models.BlockedDate || mongoose.model('BlockedDate', BlockedDateSchema);
