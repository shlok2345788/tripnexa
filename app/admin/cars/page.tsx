"use client";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminCars() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/admin/cars');
            const data = await response.json();
            if (data.success) {
                setCars(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        
        try {
            const response = await fetch(`/api/admin/cars?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setCars(cars.filter(c => c._id !== id));
            } else {
                alert('Failed to delete car');
            }
        } catch (error) {
             console.error('Error deleting car:', error);
             alert('An error occurred. Please try again.');
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Fleet</h1>
                    <p className="text-gray-600">Add, edit, or remove cars from your fleet</p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition flex items-center gap-2">
                    <Plus size={20} /> Add New Car
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading cars...</div>
            ) : cars.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No cars in fleet found. Adding cars module to be completed.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div key={car._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden text-gray-400">
                                {car.type === 'Sedan' ? '🚗' : car.type === 'SUV' ? '🚙' : '🏎️'} Car Image
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                                    <span className={`px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-800`}>{car.type}</span>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">₹{car.pricePerKm}</span> per km</p>
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">₹{car.pricePerDay}</span> per day</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {car.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Car" onClick={() => alert('Edit form generic implementation')}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Car" onClick={() => handleDelete(car._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
