"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { UploadCloud, CheckCircle, ChevronRight, AlertCircle, Key } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelfDrivePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        pickupLocation: "",
        startDate: "",
        endDate: "",
        carType: "Sedan",
        name: "",
        phone: "",
        email: "",
        licenseNumber: "",
    });

    const [fileName, setFileName] = useState("");

    // Blocked dates state
    const [blockedDates, setBlockedDates] = useState<{ date: string, reason: string }[]>([]);
    const [dateError, setDateError] = useState("");

    // Fetch blocked dates on mount
    useEffect(() => {
        const fetchBlockedDates = async () => {
            try {
                const res = await fetch('/api/admin/blocked-dates');
                const data = await res.json();
                if (data.success) {
                    setBlockedDates(data.data);
                }
            } catch (err) {
                console.error("Failed to load blocked dates", err);
            }
        };
        fetchBlockedDates();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".sd-form-elem",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        // Validation against blocked dates for Start/End bounds
        if (name === "startDate" || name === "endDate") {
            const isBlocked = blockedDates.find(d => d.date === value);
            if (isBlocked) {
                setDateError(isBlocked.reason || "Selected date is fully booked.");
            } else {
                setDateError("");
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError) {
            alert("Cannot book. One of your selected dates is blocked/full.");
            return;
        }

        gsap.to(".submit-btn", { scale: 0.95, yoyo: true, repeat: 1, duration: 0.1 });
        alert("Self Drive Request Submitted! Pending Admin Approval.");
        router.push('/dashboard');
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans flex items-center justify-center relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <Link href="/dashboard" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 sd-form-elem z-20">
                <ChevronRight className="rotate-180" size={20} /> Back to Dashboard
            </Link>

            <div className="max-w-4xl w-full mx-auto relative z-10 pt-16">

                <div className="mb-10 sd-form-elem">
                    <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500">
                            <Key size={28} />
                        </div>
                        Self Drive <span className="text-yellow-500 tracking-tight">Rental</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl text-lg mt-4">
                        Take the wheel. Apply for a premium self-drive rental package for ultimate freedom.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#121212] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 relative">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="sd-form-elem md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Pickup Location</label>
                            <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required placeholder="Where will you pick it up?" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white placeholder:text-gray-600 transition-all" />
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={`w-full p-4 bg-white/5 border ${dateError && !formData.startDate ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white appearance-none transition-all`} />
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={`w-full p-4 bg-white/5 border ${dateError && !formData.endDate ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white appearance-none transition-all`} />
                        </div>

                        {dateError && (
                            <div className="sd-form-elem md:col-span-2 -mt-4">
                                <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16} /> {dateError}</p>
                            </div>
                        )}

                        <div className="sd-form-elem md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Vehicle Type</label>
                            <select name="carType" value={formData.carType} onChange={handleChange} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white appearance-none transition-all">
                                <option value="Sedan" className="bg-[#121212]">Premium Sedan</option>
                                <option value="SUV" className="bg-[#121212]">Spacious SUV</option>
                                <option value="Luxury" className="bg-[#121212]">Luxury Class</option>
                            </select>
                        </div>

                        <div className="sd-form-elem md:col-span-2 mt-4 pt-8 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white mb-2">Verification Details</h3>
                            <p className="text-sm text-gray-500 mb-6">Required to authorize your rental</p>
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition-all" />
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition-all" />
                        </div>

                        <div className="sd-form-elem md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition-all" />
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Driving License No.</label>
                            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder="DL-XXX-XXXXXXX" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white uppercase placeholder:text-gray-700 transition-all" />
                        </div>

                        <div className="sd-form-elem">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">License Image/PDF</label>
                            <div className="relative">
                                <input type="file" id="licenseUpload" accept="image/*,.pdf" onChange={handleFileChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className={`w-full p-4 flex items-center justify-center gap-3 rounded-xl border border-dashed transition-all ${fileName ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"}`}>
                                    {fileName ? <CheckCircle size={20} /> : <UploadCloud size={20} />}
                                    <span className="font-medium truncate">{fileName || "Browse files..."}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sd-form-elem md:col-span-2 mt-8">
                            <button
                                type="submit"
                                disabled={!!dateError}
                                className="submit-btn w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-extrabold text-lg p-5 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Submit Request <ChevronRight size={20} />
                            </button>
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Approval usually takes 10-15 minutes.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
