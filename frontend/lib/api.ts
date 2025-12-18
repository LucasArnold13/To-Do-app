const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(username: string, password: string) {
    console.log("API_URL:", API_URL);
    const res = await fetch(`http://backend.internal.local:8080/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // damit Cookies (JWT) gespeichert werden
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return res.json(); // optional: user info oder token, falls dein Backend es zurückgibt
}