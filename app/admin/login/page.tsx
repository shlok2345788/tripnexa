"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-blue-900 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock size={32} className="text-yellow-400" />
                    </div>
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-white">Admin <span className="text-yellow-500">Portal</span></h1>
                        <p className="text-blue-100 mt-2">Sign in to manage TripNexa</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center border border-red-200">{error}</div>}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@tripnexa.com" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center">
                            {loading ? <span className="animate-pulse">Signing in...</span> : "Sign In"}
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p>Demo Credentials: admin@tripnexa.com / admin123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
