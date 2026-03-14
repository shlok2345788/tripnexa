import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all cars
export async function GET() {
    try {
        await connectMongo();
        const cars = await Car.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: cars.length, data: cars }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch cars' }, { status: 400 });
    }
}

// POST a new car (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await connectMongo();
        const body = await req.json();

        const car = await Car.create(body);
        return NextResponse.json({ success: true, data: car }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create car' }, { status: 400 });
    }
}

// PATCH a car (Admin only) (Update details or status)
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Please provide an ID to update' }, { status: 400 });
        }

        await connectMongo();
        const body = await req.json();

        const updatedCar = await Car.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!updatedCar) {
            return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedCar }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update car' }, { status: 400 });
    }
}

// DELETE a car (Admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Please provide an ID to delete' }, { status: 400 });
        }

        await connectMongo();
        const deletedCar = await Car.findByIdAndDelete(id);

        if (!deletedCar) {
            return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to delete car' }, { status: 400 });
    }
}
