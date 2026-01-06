const API_BASE_URL = 'http://backendBalancer-1649036085.eu-central-1.elb.amazonaws.com:8080';

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
