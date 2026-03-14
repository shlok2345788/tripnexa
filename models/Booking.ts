import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
    pickupLocation: string;
    dropLocation: string;
    pickupDate: Date;
    pickupTime: string;
    carType: "Sedan" | "SUV" | "Luxury";
    passengerCount: number;
    userName: string;
    userPhone: string;
    userEmail: string;
    notes?: string;
    status: "Pending" | "Approved" | "Rejected" | "Completed";
    distance?: number;
    estimatedPrice?: number;
}

const BookingSchema: Schema = new Schema(
    {
        pickupLocation: { type: String, required: true },
        dropLocation: { type: String, required: true },
        pickupDate: { type: Date, required: true },
        pickupTime: { type: String, required: true },
        carType: { type: String, enum: ["Sedan", "SUV", "Luxury"], required: true },
        passengerCount: { type: Number, required: true },
        userName: { type: String, required: true },
        userPhone: { type: String, required: true },
        userEmail: { type: String, required: true },
        notes: { type: String },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "Completed"], default: "Pending" },
        distance: { type: Number },
        estimatedPrice: { type: Number },
    },
    { timestamps: true }
);

export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
