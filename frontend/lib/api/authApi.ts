import { requestRaw } from './apiClient';

export const authApi = {
  async login(username: string, password: string): Promise<Response> {
    return requestRaw('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(username: string, password: string): Promise<Response> {
    return requestRaw('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getMe(): Promise<String> {
    const response = await requestRaw('/auth/me', {
      method: 'GET',
    });
    return response.text(); ;
  },

  async validateSession(sessionToken: string): Promise<boolean> {
    try {
      const response = await requestRaw('/auth/me', {
        method: 'GET',
        headers: {
          'Cookie': `jwt=${sessionToken}`
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    await requestRaw('/auth/logout', {
      method: 'POST',
    });
  },
};
