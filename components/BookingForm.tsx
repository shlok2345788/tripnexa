"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LocateFixed, ChevronRight, AlertCircle, CalendarClock, MapPin } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function BookingForm() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        pickupLocation: "",
        pickupCity: "Mumbai",
        dropCity: "",
        pickupDate: "",
        pickupTime: "",
        passengerCount: 1,
        notes: "",
        roundTrip: false,
    });

    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [loadingCalc, setLoadingCalc] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Blocked dates logic
    const [blockedDates, setBlockedDates] = useState<{ date: string, reason: string }[]>([]);
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

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
                console.error("Failed to load dates", err);
            }
        };
        fetchBlockedDates();
    }, []);

    useGSAP(() => {
        if (status === "authenticated") {
            gsap.fromTo(
                ".form-element",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, { scope: containerRef, dependencies: [status] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const name = target.name;
        // @ts-ignore
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (name === "pickupDate") {
            const isBlocked = blockedDates.find(d => d.date === value);
            if (isBlocked) {
                setDateError(isBlocked.reason || "This date is fully booked.");
            } else {
                setDateError("");
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Recalculate price if round trip changes and we already have a price
        if (name === "roundTrip" && distanceKm !== null) {
            setPrice(value ? distanceKm * 13 * 2 : distanceKm * 13);
        }

        // Reset price if cities change
        if (name === "pickupCity" || name === "dropCity") {
            setDistanceKm(null);
            setPrice(null);
        }
    };

    const handleGetCurrentLocation = () => {
        setLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                        );
                        const data = await res.json();
                        if (data && data.display_name) {
                            setFormData((prev) => ({
                                ...prev,
                                pickupLocation: data.display_name,
                            }));
                            gsap.fromTo(".location-btn", { scale: 0.8 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
                        }
                    } catch (error) {
                        console.error("Error fetching location:", error);
                        alert("Could not fetch location details.");
                    } finally {
                        setLoadingLocation(false);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Location access denied. Please type your address manually.");
                    setLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setLoadingLocation(false);
        }
    };


    const handleCalculatePrice = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!formData.pickupCity || !formData.dropCity) {
            alert("Please provide both pickup and drop cities to estimate price.");
            return;
        }

        setLoadingCalc(true);
        try {
            const pRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${formData.pickupCity}, India&format=json`);
            const pData = await pRes.json();

            const dRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${formData.dropCity}, India&format=json`);
            const dData = await dRes.json();

            if (pData.length > 0 && dData.length > 0) {
                const pLat = parseFloat(pData[0].lat);
                const pLon = parseFloat(pData[0].lon);
                const dLat = parseFloat(dData[0].lat);
                const dLon = parseFloat(dData[0].lon);

                const straightDist = calculateHaversineDistance(pLat, pLon, dLat, dLon);
                const approxRoadDist = Math.max(Math.round(straightDist * 1.3), 10);

                setDistanceKm(approxRoadDist);
                setPrice(formData.roundTrip ? approxRoadDist * 13 * 2 : approxRoadDist * 13);

                gsap.fromTo(".price-display", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });
            } else {
                alert("Could not find locations. Try being more specific with city names.");
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setLoadingCalc(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (price === null) {
            alert("Please calculate the estimated price before booking.");
            return;
        }
        if (dateError) {
            alert("Cannot book on a blocked date.");
            return;
        }

        gsap.to(".submit-btn", { scale: 0.95, yoyo: true, repeat: 1, duration: 0.1 });
        alert(`Booking Confirmed! Distance: ${distanceKm}km, Total Price: ₹${price}`);
        router.push('/dashboard');
    };

    if (status === "loading" || status === "unauthenticated") {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div></div>;
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans flex items-center justify-center">

            <Link href="/dashboard" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 form-element">
                <ChevronRight className="rotate-180" size={20} /> Back to Dashboard
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-8 bg-[#121212] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="lg:col-span-3 space-y-8 z-10">
                    <div className="form-element border-b border-white/10 pb-6">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Intercity Booking</h2>
                        <p className="text-gray-400">Schedule your premium outstation ride.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-element">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Pickup City</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select name="pickupCity" value={formData.pickupCity} onChange={handleChange} className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white appearance-none">
                                    <option value="Mumbai" className="bg-slate-900">Mumbai</option>
                                    <option value="Thane" className="bg-slate-900">Thane</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Drop Destination</label>
                            <input type="text" name="dropCity" value={formData.dropCity} onChange={handleChange} required placeholder="e.g. Pune, Lonavala" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-gray-600" />
                        </div>
                    </div>

                    <div className="form-element">
                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Detailed Pickup Address</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                required
                                placeholder="Enter apartment, street area..."
                                className="w-full p-4 pr-16 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={handleGetCurrentLocation}
                                disabled={loadingLocation}
                                className="location-btn absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                title="Use Current Location"
                            >
                                <LocateFixed size={20} className={loadingLocation ? "animate-pulse" : ""} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-element">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Date</label>
                            <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required className={`w-full p-4 bg-white/5 border ${dateError ? 'border-red-500' : 'border-white/10'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white appearance-none`} />
                            {dateError && (
                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} /> {dateError}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Time</label>
                            <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white appearance-none" />
                        </div>
                    </div>
                </div>

                {/* Right Summary Panel */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col justify-between form-element z-10">
                    <div>
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><CalendarClock className="text-yellow-500" /> Fare Estimation</h3>

                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors mb-6 group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    name="roundTrip"
                                    checked={formData.roundTrip}
                                    onChange={handleChange}
                                    className="peer appearance-none w-6 h-6 border-2 border-gray-500 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all"
                                />
                                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-white">Round Trip</p>
                                <p className="text-xs text-gray-400">Return to pickup city</p>
                            </div>
                        </label>

                        <button
                            type="button"
                            onClick={handleCalculatePrice}
                            disabled={loadingCalc || !formData.dropCity}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/5"
                        >
                            {loadingCalc ? "Calculating..." : "Calculate Fare"}
                        </button>

                        {price !== null && (
                            <div className="price-display mt-6 p-6 bg-gradient-to-br from-blue-900/40 to-blue-600/20 border border-blue-500/30 rounded-2xl text-center">
                                <p className="text-sm text-blue-200 mb-1">Total Distance: <span className="font-bold">{formData.roundTrip ? distanceKm! * 2 : distanceKm} km</span></p>
                                <p className="text-4xl font-black text-white my-2">₹{price}</p>
                                <p className="text-xs text-blue-300">₹13/km base rate</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={price === null || !!dateError}
                        className="submit-btn w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg p-5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
                    >
                        Confirm Booking <ChevronRight size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
