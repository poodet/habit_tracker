"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.login({ email, password });
            const token = res.data?.access_token || res.data?.accessToken || res.data?.token;
            if (token) {
                localStorage.setItem('accessToken', token);
                setIsLoggedIn(true);
                router.push('/calendar');
            } else {
                setError('No access token returned from server');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-2xl w-full items-center justify-center font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-8">Customizable Calendar Application</h1>
                <p className="text-center text-xl mb-4">Welcome to your personalized event tracking system</p>

                {isLoggedIn ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-green-700">You are logged in.</p>
                        <Link
                            href="/calendar"
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                        >
                            Open Calendar 📅
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4">Log in</h2>
                        {error && <p className="text-red-600 mb-2">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? 'Logging in…' : 'Log in'}
                            </button>
                            <Link href="/register" className="text-sm text-gray-600 hover:underline">
                                Create account
                            </Link>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📊 Custom Objects</h2>
                        <p>Define your own object types with custom attributes</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📅 Calendar Events</h2>
                        <p>Track events and link them to your custom objects</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">📈 Statistics</h2>
                        <p>Visualize your data with charts and analytics</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
