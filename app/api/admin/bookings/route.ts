import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all bookings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await connectMongo();
        const bookings = await Booking.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: bookings.length, data: bookings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch bookings' }, { status: 500 });
    }
}

// PATCH a booking status
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Please provide a booking ID' }, { status: 400 });
        }

        await connectMongo();
        const { status } = await req.json();

        if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
             return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedBooking }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update booking' }, { status: 500 });
    }
}
