"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".about-text",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }
            );

            gsap.fromTo(
                ".about-image",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out", delay: 0.3 }
            );

            gsap.fromTo(
                ".feature-item",
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: ".features-section",
                        start: "top 80%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-24 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="about-text lg:w-1/2 mx-auto">
                        <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">Our Story</h2>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        About <span className="text-blue-600">TripNexa</span>
                        </h1>
                    <p className="about-text text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We are redefining intercity travel and self-drive car rentals in India. Our mission is to provide safe, comfortable, and affordable transportation for everyone.
                    </p>
                </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="about-image relative h-[400px] lg:h-[500px] w-full bg-blue-100 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-white">
                        <div className="text-6xl">🚗</div>
                        {/* Placeholder for real image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-overlay"></div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="about-text text-3xl font-bold text-gray-800 mb-4">Intercity Ride Services</h2>
                            <p className="about-text text-gray-600 text-lg">
                                Whether you&apos;re traveling for business or leisure, our chauffeur-driven intercity cabs offer unmatched comfort and reliability. With verified drivers and well-maintained vehicles, your journey is always in safe hands.
                            </p>
                        </div>

                        <div>
                            <h2 className="about-text text-3xl font-bold text-gray-800 mb-4">Self-Drive Rental Option</h2>
                            <p className="about-text text-gray-600 text-lg">
                                Prefer to take the wheel? Choose from our wide range of premium sedans, SUVs, and luxury cars. Enjoy unlimited freedom, complete privacy, and the thrill of the open road with our hassle-free self-drive rentals.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section bg-blue-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px]"></div>

                    <h2 className="text-3xl font-bold mb-12 text-center relative z-10">Why We Stand Out</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="feature-item p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-yellow-500 mb-2">Safety & Reliability</h3>
                            <p className="text-blue-100">Every vehicle undergoes a 50-point safety check before hitting the road. GPS tracking enabled.</p>
                        </div>
                        <div className="feature-item p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <div className="text-4xl mb-4">🎧</div>
                            <h3 className="text-xl font-bold text-yellow-500 mb-2">24/7 Support</h3>
                            <p className="text-blue-100">Our dedicated customer support team is available round-the-clock to assist you with any queries.</p>
                        </div>
                        <div className="feature-item p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-bold text-yellow-500 mb-2">Transparent Pricing</h3>
                            <p className="text-blue-100">No hidden charges or surge pricing tricks. What you see is exactly what you pay.</p>
                        </div>
                    </div>
                </div>

                {/* Founder Section */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership</h2>
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
                            SM
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Siddhesh Maratha</h3>
                        <p className="text-blue-600 font-medium mb-4">Founder & Owner, TripNexa</p>
                        <blockquote className="italic text-gray-600 mb-6">
                            &ldquo;Our vision at TripNexa is to transform the way India travels between cities. We prioritize safety, comfort, and affordability for every single journey.&rdquo;
                        </blockquote>
                        <div className="inline-flex items-center justify-center gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-200">
                            <span className="text-gray-500 text-sm">Direct Contact:</span>
                            <a href="tel:9530986992" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">
                                +91 9530986992
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
