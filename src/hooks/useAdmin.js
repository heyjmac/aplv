import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('aplv_token'));

  // Verify stored token on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.ok) setIsAdmin(true); else _logout(); })
      .catch(() => _logout());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _logout = () => {
    localStorage.removeItem('aplv_token');
    setToken(null);
    setIsAdmin(false);
    if (window.google) window.google.accounts.id.disableAutoSelect();
  };

  const login = () => {
    if (!window.google || !CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          const res = await fetch(`${API}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
          });
          if (!res.ok) return;
          const { token: jwt } = await res.json();
          localStorage.setItem('aplv_token', jwt);
          setToken(jwt);
          setIsAdmin(true);
        } catch { /* network error — silently ignore */ }
      },
    });
    window.google.accounts.id.prompt();
  };

  return { isAdmin, token, login, logout: _logout };
}
