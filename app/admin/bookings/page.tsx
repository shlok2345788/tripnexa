"use client";

import { CheckCircle, XCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/admin/bookings');
            const data = await response.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/bookings?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ride Bookings</h1>
                    <p className="text-gray-600">Manage all intercity ride requests</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 uppercase text-sm font-semibold border-b">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Route & Time</th>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading bookings...</td></tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr><td colSpan={5} className="p-4 text-center text-gray-500">No bookings found.</td></tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900">{booking.fullName}</p>
                                            <p className="text-gray-500">{booking.phone}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900">{booking.pickupLocation} <span className="text-blue-500 mx-1">→</span> {booking.dropLocation}</p>
                                            <p className="text-gray-500">{new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}</p>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">{booking.vehicleType}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition" title="Confirm">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => updateStatus(booking._id, 'Cancelled')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Cancel">
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
                                            )}
                                             {booking.status === 'Confirmed' && (
                                                 <button onClick={() => updateStatus(booking._id, 'Completed')} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition font-medium text-xs">
                                                     Mark Completed
                                                 </button>
                                             )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
