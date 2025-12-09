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
  <div style={{
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Login</h2>

    <input
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px'
      }}
    />

    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px'
      }}
    />

    <button
      onClick={handleLogin}
      style={{
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      Login
    </button>

    {error && (
      <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
        {error}
      </p>
    )}
  </div>
);

}
