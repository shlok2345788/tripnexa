"use client";

import { CheckCircle, XCircle, Search, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSelfDrive() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/admin/self-drive');
            const data = await response.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch self-drive requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/self-drive?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                 setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
             console.error('Error updating status:', error);
             alert('An error occurred. Please try again.');
        }
    };

    const filteredRequests = requests.filter(r => 
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dlNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.carType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Self Drive Requests</h1>
                    <p className="text-gray-600">Review and approve self-drive rental applications</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search applications..."
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
                                <th className="p-4">Rental Duration</th>
                                <th className="p-4">Car Type</th>
                                <th className="p-4">License Verification</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan={6} className="p-4 text-center text-gray-500">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900">{req.fullName}</p>
                                            <p className="text-gray-500">{req.phone}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-800">{new Date(req.pickupDate).toLocaleDateString()} <span className="text-gray-400">to</span></p>
                                            <p className="text-gray-800">{new Date(req.dropDate).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">{req.carType}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-800">{req.dlNumber}</p>
                                            <button className="flex items-center gap-1 text-blue-600 hover:underline mt-1 text-xs font-semibold">
                                                <FileText size={14} /> View Document
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end items-center h-full mt-2">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(req._id, 'Approved')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition" title="Approve">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => updateStatus(req._id, 'Rejected')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Reject">
                                                        <XCircle size={20} />
                                                    </button>
                                                </>
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
