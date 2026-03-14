"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".stagger-item",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        gsap.to(".submit-icon", { x: 10, yoyo: true, repeat: 1, duration: 0.2 });
        alert("Message sent successfully!");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div ref={containerRef} className="pt-24 pb-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 stagger-item">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Get In Touch</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have a question about a booking or a self-drive rental? Drop us a message below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Contact Info Panel */}
                    <div className="lg:col-span-1 bg-blue-900 p-10 text-white relative overflow-hidden stagger-item">
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-600 rounded-full blur-[60px]"></div>

                        <h2 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h2>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-800 p-3 rounded-xl"><Phone className="text-yellow-500" /></div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 text-sm">Business Phone</h3>
                                    <p className="text-lg">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-800 p-3 rounded-xl"><Mail className="text-yellow-500" /></div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Email Us At</h3>
                                    <p className="text-lg">support@tripnexa.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-800 p-3 rounded-xl"><MapPin className="text-yellow-500" /></div>
                                <div>
                                    <h3 className="font-semibold text-gray-300 text-sm">Office Location</h3>
                                    <p className="text-lg">123 Tech Park, Andheri East,<br />Mumbai, Maharashtra 400069</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger-item">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                                </div>
                            </div>

                            <div className="stagger-item">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                            </div>

                            <div className="stagger-item">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"></textarea>
                            </div>

                            <div className="stagger-item pt-2">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30">
                                    Send Message <Send size={18} className="submit-icon" />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Google Maps Embed */}
                <div className="mt-16 rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[400px] stagger-item">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3769.645933647249!2d72.83388731490219!3d19.123182987060595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d90e067ba9%3A0x16265e5e01b38202!2sAndheri%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625567891234!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
