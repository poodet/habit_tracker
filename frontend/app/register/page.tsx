"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.register({ email, password, firstName, lastName });
            const token = res.data?.access_token || res.data?.accessToken || res.data?.token;
            if (token) {
                localStorage.setItem('accessToken', token);
                router.push('/calendar');
            } else {
                setError('No access token returned from server');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-8">
            <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold mb-4">Create account</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <div className="mb-3">
                    <label className="block text-sm mb-1">First name</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-3">
                    <label className="block text-sm mb-1">Last name</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-3">
                    <label className="block text-sm mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                        {loading ? 'Creating…' : 'Create account'}
                    </button>
                </div>
            </form>
        </main>
    );
}
