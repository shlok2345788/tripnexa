"use client";

import { useSession } from "next-auth/react";
import { Users, Car, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-6xl mx-auto flex justify-center items-center h-64"><p>Loading dashboard data...</p></div>;
    }

    const statCards = [
        { title: "Total Bookings", value: stats?.stats?.totalBookings || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Self Drive Requests", value: stats?.stats?.selfDriveRequests || 0, icon: Users, color: "text-yellow-600", bg: "bg-yellow-100" },
        { title: "Cars in Fleet", value: stats?.stats?.totalCars || 0, icon: Car, color: "text-green-600", bg: "bg-green-100" },
        { title: "Revenue (Monthly)", value: stats?.stats?.revenue || "₹0", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {session?.user?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-2xl ${stat.bg}`}>
                            <stat.icon className={stat.color} size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Ride Bookings</h2>
                    <div className="space-y-4">
                        {stats?.recentBookings?.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent bookings found.</p>
                        ) : (
                            stats?.recentBookings?.map((booking: any) => (
                                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="font-semibold text-gray-900">{booking.pickupLocation} to {booking.dropLocation}</p>
                                        <p className="text-sm text-gray-500">{new Date(booking.pickupDate).toLocaleDateString()} • {booking.vehicleType}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Self-Drive Requests</h2>
                    <div className="space-y-4">
                         {stats?.recentRequests?.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent requests found.</p>
                        ) : (
                            stats?.recentRequests?.map((req: any) => (
                            <div key={req._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="font-semibold text-gray-900">{req.fullName}</p>
                                    <p className="text-sm text-gray-500">{req.carType} • {new Date(req.pickupDate).toLocaleDateString()} to {new Date(req.dropDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        ))
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}
