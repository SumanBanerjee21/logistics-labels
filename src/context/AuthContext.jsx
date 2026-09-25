import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  // Persist user and token in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  }, [currentUser]);

  // Helper: authenticated fetch
  const authFetch = (path, options = {}) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  // ─── SIGNUP ──────────────────────────────────────────────────────────────
  const signup = async (companyName, userId, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, userId, password }),
    });
    return res.ok; // true = success, false = userId already exists
  };

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (userId, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    setCurrentUser(data.user);
    return true;
  };

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  // ─── FORGOT PASSWORD: SEND CODE ───────────────────────────────────────────
  const generateResetCode = async (userId) => {
    const res = await fetch(`${API_URL}/api/auth/forgot/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.code; // For demo: backend returns the code
  };

  // ─── FORGOT PASSWORD: RESET ───────────────────────────────────────────────
  const resetPassword = async (userId, code, newPassword) => {
    const res = await fetch(`${API_URL}/api/auth/forgot/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code, newPassword }),
    });
    return res.ok;
  };

  // ─── UPDATE PLAN (called after successful Razorpay payment) ───────────────
  const updatePlan = async (plan) => {
    const res = await authFetch('/api/auth/update-plan', {
      method: 'PATCH',
      body: JSON.stringify({ plan }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
    }
  };

  // ─── UPDATE COMPANY NAME ──────────────────────────────────────────────────
  // Company name is set at signup; this is kept for Setup page compatibility
  const updateCompanyName = (companyName) => {
    setCurrentUser((prev) => ({ ...prev, companyName }));
  };

  // ─── INCREMENT PAGES PRINTED ──────────────────────────────────────────────
  const incrementPagesPrinted = async (count) => {
    const res = await authFetch('/api/auth/increment-pages', {
      method: 'PATCH',
      body: JSON.stringify({ count }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser((prev) => ({ ...prev, pagesPrinted: data.pagesPrinted }));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      login,
      logout,
      signup,
      generateResetCode,
      resetPassword,
      updatePlan,
      updateCompanyName,
      incrementPagesPrinted,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
