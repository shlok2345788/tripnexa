import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { SelfDriveRequest } from '@/models/SelfDriveRequest';
import { Car } from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await connectMongo();

        // Get total counts
        const totalBookings = await Booking.countDocuments();
        const pendingSelfDrive = await SelfDriveRequest.countDocuments({ status: 'Pending' });
        const requestCount = await SelfDriveRequest.countDocuments();
        const totalCars = await Car.countDocuments();

        // Get recent activity
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentRequests = await SelfDriveRequest.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // TODO: Calculate actual revenue across completed/paid bookings. For now, we mock.
        const mockRevenue = "₹1.5L"

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalBookings,
                    selfDriveRequests: requestCount,
                    pendingSelfDrive,
                    totalCars,
                    revenue: mockRevenue
                },
                recentBookings,
                recentRequests
            }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
