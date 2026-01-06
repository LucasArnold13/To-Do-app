const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export { API_BASE_URL };

export async function requestRaw(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response;
}

export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await requestRaw(endpoint, options);

  // DELETE returns 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Für Middleware - prüft nur ob Session valid ist
export async function validateSession(sessionToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `jwt=${sessionToken}`
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
