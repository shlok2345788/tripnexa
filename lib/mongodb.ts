import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    "mongodb+srv://<db_username>:<db_password>@cluster0.5gndcdq.mongodb.net/tripnexa?retryWrites=true&w=majority&appName=Cluster0";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (
        !MONGODB_URI ||
        MONGODB_URI.includes("<db_username>") ||
        MONGODB_URI.includes("<db_password>")
    ) {
        throw new Error("Please set a valid MONGODB_URI or MONGODB_URL in environment variables");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
