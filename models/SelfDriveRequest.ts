import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISelfDriveRequest extends Document {
    pickupLocation: string;
    startDate: Date;
    endDate: Date;
    carType: "Sedan" | "SUV" | "Luxury";
    userName: string;
    userPhone: string;
    userEmail: string;
    drivingLicenseNumber: string;
    drivingLicenseImage: string; // URL of the uploaded image
    status: "Pending" | "Approved" | "Rejected" | "Completed";
}

const SelfDriveRequestSchema: Schema = new Schema(
    {
        pickupLocation: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        carType: { type: String, enum: ["Sedan", "SUV", "Luxury"], required: true },
        userName: { type: String, required: true },
        userPhone: { type: String, required: true },
        userEmail: { type: String, required: true },
        drivingLicenseNumber: { type: String, required: true },
        drivingLicenseImage: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "Completed"], default: "Pending" },
    },
    { timestamps: true }
);

export const SelfDriveRequest: Model<ISelfDriveRequest> =
    mongoose.models.SelfDriveRequest || mongoose.model<ISelfDriveRequest>("SelfDriveRequest", SelfDriveRequestSchema);
