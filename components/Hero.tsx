"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Background reveal
        tl.fromTo(
            ".hero-bg",
            { opacity: 0 },
            { opacity: 1, duration: 1.5, ease: "power2.inOut" }
        );

        // Text reveal
        tl.fromTo(
            ".hero-title-main",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=1"
        );

        tl.fromTo(
            ".hero-title-sub",
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
            "-=0.7"
        );

        tl.fromTo(
            ".hero-desc",
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.5"
        );

        tl.fromTo(
            ".hero-btn",
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" },
            "-=0.5"
        );

        // Car image slide in with a "speed" effect
        tl.fromTo(
            ".hero-car",
            { x: "100%", opacity: 0, skewX: -10 },
            { x: "0%", opacity: 1, skewX: 0, duration: 1.5, ease: "power4.out" },
            "-=1.2"
        );

        // Floating animation for the car
        gsap.to(".hero-car", {
            y: -15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.5
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative min-h-screen flex items-center bg-[#0d0d0d] overflow-hidden pt-16">
            {/* Background glowing effects */}
            <div className="hero-bg absolute inset-0 z-0">
                <div className="absolute top-[20%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-yellow-500/10 blur-[150px]"></div>
                <div className="absolute bottom-[0%] left-[0%] w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[120px]"></div>
                <div className="absolute top-[50%] right-[40%] w-[20rem] h-[20rem] rounded-full bg-green-500/5 blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">

                    {/* Left Content */}
                    <div className="text-left mt-10 lg:mt-0 pt-10 lg:pt-0">
                        <div className="mb-4 inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <span className="text-yellow-500 font-semibold text-sm tracking-wide uppercase">Luxury Feel</span>
                        </div>

                        <h1 className="hero-title-main text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-2 font-sans">
                            Enjoy The Ride
                        </h1>
                        <h2 className="hero-title-sub text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-yellow-500 leading-[1.1] mb-6 font-sans">
                            Rent or Book
                        </h2>

                        <p className="hero-desc text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed mix-blend-screen">
                            Experience premium, comfortable rides between cities or rent a car to drive yourself. Your perfect journey starts here.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <Link href="/book-ride" className="hero-btn bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                Book Ride
                            </Link>
                            <Link href="/self-drive" className="hero-btn bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                Self Drive
                            </Link>
                        </div>

                        {/* Stats / Indicators */}
                        <div className="mt-16 flex gap-8 border-t border-white/10 pt-8 max-w-lg">
                            <div>
                                <h4 className="text-white font-bold text-2xl">50+</h4>
                                <p className="text-gray-500 text-sm">Premium Cars</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-2xl">24/7</h4>
                                <p className="text-gray-500 text-sm">Support</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-2xl">10k+</h4>
                                <p className="text-gray-500 text-sm">Happy Riders</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Car Image */}
                    <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] w-full mt-10 lg:mt-0 flex items-center justify-center lg:justify-end shrink-0 hidden md:flex">
                        <div className="hero-car relative w-[130%] h-[80%] flex items-center justify-center drop-shadow-2xl">
                            <Image
                                src="/ChatGPT Image Mar 13, 2026, 08_56_23 AM.png"
                                alt="Premium car rental"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'center right' }}
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom floating elements overlapping next section as per design */}
            <div className="absolute bottom-[-50px] left-0 w-full flex justify-center z-20 pointer-events-none hidden lg:flex">
                <div className="w-[80%] max-w-5xl h-[100px] bg-white rounded-t-[40px] shadow-2xl"></div>
            </div>
        </div>
    );
}
