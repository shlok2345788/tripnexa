"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, IndianRupee } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const routes = [
    { id: 1, from: "Mumbai", to: "Pune", distance: "150 km", price: "2,500", time: "3 hrs" },
    { id: 2, from: "Mumbai", to: "Nashik", distance: "165 km", price: "2,800", time: "3.5 hrs" },
    { id: 3, from: "Delhi", to: "Jaipur", distance: "280 km", price: "4,500", time: "5 hrs" },
    { id: 4, from: "Bangalore", to: "Mysore", distance: "145 km", price: "2,200", time: "3 hrs" },
];

export default function PopularRoutes() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".route-card",
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular <span className="text-blue-600">Intercity</span> Routes</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Travel comfortably between major cities with our premium fleet. Reliable, safe, and transparent pricing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {routes.map((route) => (
                        <div key={route.id} className="route-card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow">
                            <div className="h-32 bg-blue-600 flex flex-col justify-center items-center text-white relative overflow-hidden">
                                {/* Decorative Pattern */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                                <h3 className="text-2xl font-bold z-10">{route.from}</h3>
                                <div className="w-1 px-4 my-1 border-dotted border-l-2 border-yellow-400 h-6"></div>
                                <h3 className="text-2xl font-bold z-10">{route.to}</h3>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1"><MapPin size={16} className="text-blue-500" /> {route.distance}</div>
                                    <div className="flex items-center gap-1"><Clock size={16} className="text-yellow-500" /> {route.time}</div>
                                </div>

                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-gray-500">Starting from</span>
                                    <span className="text-2xl font-bold text-gray-900 flex items-center">
                                        <IndianRupee size={20} />{route.price}
                                    </span>
                                </div>

                                <button className="w-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold py-3 rounded-xl transition-colors">
                                    Book This Route
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
