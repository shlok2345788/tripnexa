import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import BlockedDate from '@/models/BlockedDate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all blocked dates (publicly accessible so booking forms can read them)
export async function GET() {
    try {
        await connectMongo();
        const dates = await BlockedDate.find({}).sort({ date: 1 });
        return NextResponse.json({ success: true, count: dates.length, data: dates }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch dates' }, { status: 400 });
    }
}

// POST a new blocked date (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await connectMongo();
        const body = await req.json();

        // Ensure date is unique, handle duplicates gracefully
        const existing = await BlockedDate.findOne({ date: body.date });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Date is already blocked' }, { status: 400 });
        }

        const date = await BlockedDate.create(body);
        return NextResponse.json({ success: true, data: date }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to block date' }, { status: 400 });
    }
}

// DELETE a blocked date (Admin only)
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
        const deletedDate = await BlockedDate.findByIdAndDelete(id);

        if (!deletedDate) {
            return NextResponse.json({ success: false, error: 'Date not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to delete blocked date' }, { status: 400 });
    }
}
