"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, CalendarOff, AlertCircle } from "lucide-react";

interface BlockedDate {
    _id: string;
    date: string;
    reason: string;
}

export default function AdminBlockedDatesPage() {
    const [dates, setDates] = useState<BlockedDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDate, setNewDate] = useState("");
    const [reason, setReason] = useState("Booking Full");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchDates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blocked-dates');
            const data = await res.json();
            if (data.success) {
                setDates(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch blocked dates", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDates();
    }, []);

    const handleAddDate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newDate) {
            setError("Please select a date.");
            return;
        }

        try {
            const res = await fetch('/api/admin/blocked-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: newDate, reason })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(`Successfully blocked ${newDate}`);
                setNewDate("");
                setReason("Booking Full");
                fetchDates(); // Refresh list
            } else {
                setError(data.error || "Failed to block date");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const handleDelete = async (id: string, dateStr: string) => {
        if (!confirm(`Are you sure you want to unblock ${dateStr}?`)) return;

        try {
            const res = await fetch(`/api/admin/blocked-dates?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                fetchDates(); // Refresh
            } else {
                alert(data.error || "Failed to delete");
            }
        } catch (err) {
            alert("Error deleting date");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Blocked Dates</h1>
                    <p className="text-gray-500 mt-1">Prevent users from booking cars on specific dates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form to add new blocked date */}
                <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-blue-600" /> Add Blocked Date
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleAddDate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Visible to users)</label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g. Booking Full"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium p-3 rounded-xl transition"
                        >
                            Block Date
                        </button>
                    </form>
                </div>

                {/* List of blocked dates */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Currently Blocked Dates</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : dates.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <CalendarOff size={48} className="text-gray-300 mb-4" />
                            <p>No blocked dates found.</p>
                            <p className="text-sm mt-1">Users can currently book on any date.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {dates.map((item) => (
                                <div key={item._id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex flex-col items-center justify-center font-bold leading-tight">
                                            <span className="text-xs uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg">{new Date(item.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className="text-sm text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{item.reason}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id, item.date)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Unblock date"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
