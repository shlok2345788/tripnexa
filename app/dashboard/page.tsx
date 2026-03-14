"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
    User,
    MapPin,
    Calendar,
    Clock,
    LogOut,
    ChevronRight,
    Home,
    Route,
    CarFront,
    Sparkles,
    ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const firstName = session?.user?.name?.split(" ")[0] || "Traveler";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useGSAP(() => {
        if (status === "authenticated") {
            const tl = gsap.timeline();

            tl.fromTo(
                ".dash-sidebar",
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
            );

            tl.fromTo(
                ".dash-item",
                { y: 20, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" },
                "-=0.4"
            );

            tl.fromTo(
                ".dash-stat",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "bounce.out" },
                "-=0.4"
            );

            tl.fromTo(
                ".dash-hero",
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
                "-=0.45"
            );
        }
    }, { scope: containerRef, dependencies: [status] });

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen text-white flex flex-col md:flex-row overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_#1f3b72_0%,_#0f172a_30%,_#09090b_75%)]"
        >
            <aside className="dash-sidebar w-full md:w-80 bg-black/35 backdrop-blur-md border-r border-white/10 flex flex-col shrink-0 h-auto md:h-screen">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold font-sans">
                        <span className="text-white">Trip</span><span className="text-yellow-500">Nexa</span>
                    </Link>
                    <Link href="/" className="md:hidden text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                        <Home size={20} />
                    </Link>
                </div>

                <div className="p-8 flex-1">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-yellow-300 rounded-full flex items-center justify-center text-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                            <span className="text-xl font-bold">{session?.user?.name?.charAt(0) || "U"}</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{session?.user?.name}</h2>
                            <p className="text-sm text-gray-400 mt-1">TripNexa Member</p>
                        </div>
                    </div>

                    <nav className="space-y-4">
                        <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors group">
                            <Home size={20} className="group-hover:text-blue-400 transition-colors" /> Home Page
                        </Link>
                        <a href="#profile" className="flex items-center gap-3 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl transition-colors font-medium">
                            <User size={20} /> My Profile
                        </a>
                        <a href="#bookings" className="flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors group">
                            <Clock size={20} className="group-hover:text-blue-400 transition-colors" /> Ride History
                        </a>
                    </nav>
                </div>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full p-3 rounded-xl hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full max-h-screen">
                <section className="dash-hero mb-10 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-emerald-500/15 border border-white/15 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200 bg-cyan-400/10 border border-cyan-200/20 rounded-full px-3 py-1 mb-4">
                                <Sparkles size={14} />
                                Welcome back
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Hi {firstName}, ready for your next trip?</h1>
                            <p className="text-gray-200/90 max-w-2xl">
                                Plan city-to-city rides or book a self-drive car in a few clicks. Everything you need is in one place.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/book-ride"
                                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                Book Intercity Cab <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/self-drive"
                                className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 font-bold px-5 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
                            >
                                Browse Self-Drive <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                    <div className="dash-stat bg-white/8 border border-white/15 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/12 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
                            <Route size={22} />
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Total Rides</p>
                        <h3 className="text-3xl font-bold text-white">0</h3>
                    </div>
                    <div className="dash-stat bg-white/8 border border-white/15 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/12 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-yellow-500/25 text-yellow-300 flex items-center justify-center mb-4">
                            <CarFront size={22} />
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Self-Drive Trips</p>
                        <h3 className="text-3xl font-bold text-white">0</h3>
                    </div>
                    <div className="dash-stat bg-white/8 border border-white/15 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/12 transition-colors sm:col-span-2 lg:col-span-1">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
                            <Calendar size={22} />
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Upcoming Bookings</p>
                        <h3 className="text-3xl font-bold text-white">0</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold mb-4 dash-item">Quick Actions</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link href="/book-ride" className="dash-item bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-500/35 rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                    <MapPin size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                        <MapPin className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Book Intercity Cab</h3>
                                    <p className="text-blue-100/80 mb-6 max-w-[220px]">Travel comfortably across cities with trusted professional drivers.</p>
                                    <span className="flex items-center gap-2 text-sm font-bold bg-white/10 inline-flex px-4 py-2 rounded-full group-hover:bg-white/20 transition-colors">
                                        Start Booking <ChevronRight size={16} />
                                    </span>
                                </div>
                            </Link>

                            <Link href="/self-drive" className="dash-item bg-gradient-to-br from-yellow-500 to-orange-500 border border-yellow-400/40 rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(245,158,11,0.28)] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                    <Calendar size={80} />
                                </div>
                                <div className="relative z-10 text-gray-900">
                                    <div className="w-12 h-12 bg-gray-900/10 rounded-full flex items-center justify-center mb-6">
                                        <Calendar size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Self-Drive Rental</h3>
                                    <p className="text-gray-900/80 mb-6 max-w-[220px]">Pick your favorite car and drive on your own schedule.</p>
                                    <span className="flex items-center gap-2 text-sm font-bold bg-gray-900/10 inline-flex px-4 py-2 rounded-full group-hover:bg-gray-900/20 transition-colors">
                                        Explore Cars <ChevronRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-8 dash-item">
                            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                            <div className="bg-black/30 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} className="text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-200 mb-2">No rides yet</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">Your upcoming and completed rides will appear here after your first booking.</p>
                            </div>
                        </div>
                    </div>

                    <div className="dash-item lg:col-span-1 bg-black/35 border border-white/10 rounded-3xl p-8 h-fit backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <User size={20} className="text-yellow-500" /> Profile Snapshot
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Full Name</label>
                                <p className="text-lg font-medium mt-1 text-white">{session?.user?.name}</p>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Email Address</label>
                                <p className="text-lg font-medium mt-1 text-white">{session?.user?.email}</p>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Travel Preference</label>
                                <p className="text-lg font-medium mt-1 text-cyan-300">Intercity and Self-Drive</p>
                            </div>

                            <Link
                                href="/book-ride"
                                className="inline-flex items-center justify-center w-full mt-6 bg-white/8 hover:bg-white/15 border border-white/15 py-3 rounded-xl transition-colors text-sm font-semibold"
                            >
                                Start New Booking
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
