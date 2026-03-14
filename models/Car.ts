import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICar extends Document {
    name: string;
    type: "Sedan" | "SUV" | "Luxury";
    image: string;
    pricePerKm: number;
    pricePerDay: number;
    status: "Available" | "Maintenance";
}

const CarSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ["Sedan", "SUV", "Luxury"], required: true },
        image: { type: String, required: true },
        pricePerKm: { type: Number, required: true },
        pricePerDay: { type: Number, required: true },
        status: { type: String, enum: ["Available", "Maintenance"], default: "Available" },
    },
    { timestamps: true }
);

export const Car: Model<ICar> = mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
