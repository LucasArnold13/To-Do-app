'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router
import { login } from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            console.log('Login erfolgreich:', data);

            // Redirect zum Dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Willkommen zurück</h1>
                        <p className="text-gray-600">Melde dich bei deinem Account an</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm text-center">
                            Test-Account: <strong>testuser</strong> / <strong>password123</strong>
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Benutzername
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Dein Benutzername"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Dein Passwort"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                            Anmelden
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Noch kein Account?{' '}
                            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Jetzt registrieren
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
