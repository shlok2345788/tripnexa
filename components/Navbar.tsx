"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, User as UserIcon } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        gsap.fromTo(
            ".navbar",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );
    }, []);

    const hiddenRoutes = ['/dashboard', '/book-ride', '/self-drive'];
    if (hiddenRoutes.includes(pathname)) {
        return null;
    }

    return (
        <nav className="navbar fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-900">
                            Trip<span className="text-yellow-500">Nexa</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>

                        {session ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                                    <UserIcon size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="bg-red-50 text-red-600 px-5 py-2 rounded-full hover:bg-red-100 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</Link>
                        <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">About</Link>
                        <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Contact</Link>

                        {session ? (
                            <>
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 w-full text-center">Dashboard</Link>
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full">Logout</button>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </nav>
    );
}
