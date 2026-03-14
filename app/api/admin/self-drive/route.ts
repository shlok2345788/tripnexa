import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { SelfDriveRequest } from '@/models/SelfDriveRequest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all self-drive requests
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await connectMongo();
        const requests = await SelfDriveRequest.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: requests.length, data: requests }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch self-drive requests' }, { status: 500 });
    }
}

// PATCH a self-drive request status
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Please provide a request ID' }, { status: 400 });
        }

        await connectMongo();
        const { status } = await req.json();

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
             return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }

        const updatedRequest = await SelfDriveRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedRequest }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to update request' }, { status: 500 });
    }
}
