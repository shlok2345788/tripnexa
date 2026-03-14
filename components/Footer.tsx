"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    const hiddenRoutes = ['/dashboard', '/book-ride', '/self-drive'];
    if (hiddenRoutes.includes(pathname)) {
        return null; // Hide footer on app-like pages
    }

    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Trip<span className="text-yellow-500">Nexa</span></h3>
                    <p className="text-gray-400">Premium intercity travel and self-drive car rentals across India.</p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-500">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="/self-drive" className="hover:text-white transition">Self Drive</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-500">Contact Us</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li>📞 +91 98765 43210</li>
                        <li>✉️ support@tripnexa.in</li>
                        <li>🏢 Mumbai, Maharashtra</li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-500 border-t border-gray-800 pt-8">
                &copy; {new Date().getFullYear()} TripNexa. All rights reserved.
            </div>
        </footer>
    );
}
