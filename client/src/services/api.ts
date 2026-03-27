import { useState, useEffect } from 'react';

const API_URL = '';

export const api = {
  async get(endpoint: string) {
    const res = await fetch(`${API_URL}/api${endpoint}`);
    return res.json();
  },
  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async delete(endpoint: string) {
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'DELETE',
    });
    return res.json();
  }
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout };
}
