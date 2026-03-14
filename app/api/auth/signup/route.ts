import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists with this email" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully", userId: newUser._id }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
    }
}
