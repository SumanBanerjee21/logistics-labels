import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem('authToken')
  );


  // ─── PERSIST USER AND TOKEN ───────────────────────────────────────────────
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  }, [currentUser]);


  // ─── AUTHENTICATED FETCH ──────────────────────────────────────────────────
  const authFetch = (path, options = {}) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',

        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),

        ...(options.headers || {}),
      },
    });


  // ─── SIGNUP ───────────────────────────────────────────────────────────────
  // logo is optional at the API level because the Setup page
  // will also be able to upload/change it.
  const signup = async (
    companyName,
    userId,
    password,
    logo = null
  ) => {
    const res = await fetch(
      `${API_URL}/api/auth/signup`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          companyName,
          userId,
          password,
          logo
        }),
      }
    );

    return res.ok;
  };


  // ─── LOGIN ────────────────────────────────────────────────────────────────
  const login = async (
    userId,
    password
  ) => {
    const res = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId,
          password
        }),
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    localStorage.setItem(
      'authToken',
      data.token
    );

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
  const generateResetCode = async (
    userId
  ) => {
    const res = await fetch(
      `${API_URL}/api/auth/forgot/send-code`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId
        }),
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    // Current application uses demo mode,
    // so the backend returns the generated code.
    return data.code;
  };


  // ─── FORGOT PASSWORD: RESET ───────────────────────────────────────────────
  const resetPassword = async (
    userId,
    code,
    newPassword
  ) => {
    const res = await fetch(
      `${API_URL}/api/auth/forgot/reset`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId,
          code,
          newPassword
        }),
      }
    );

    return res.ok;
  };


  // ─── UPDATE PLAN ──────────────────────────────────────────────────────────
  // Called after successful Razorpay payment.
  const updatePlan = async (plan) => {
    const res = await authFetch(
      '/api/auth/update-plan',
      {
        method: 'PATCH',

        body: JSON.stringify({
          plan
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();

      setCurrentUser(data.user);
    }
  };


  // ─── UPDATE COMPANY NAME ──────────────────────────────────────────────────
  // Kept for Setup page compatibility.
  const updateCompanyName = (companyName) => {
    setCurrentUser((prev) => ({
      ...prev,
      companyName
    }));
  };


  // ─── UPDATE COMPANY LOGO ──────────────────────────────────────────────────
  const updateLogo = async (logo) => {
    if (!logo) {
      return false;
    }

    const res = await authFetch(
      '/api/auth/logo',
      {
        method: 'PATCH',

        body: JSON.stringify({
          logo
        }),
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    setCurrentUser(data.user);

    return true;
  };


  // ─── REMOVE COMPANY LOGO ──────────────────────────────────────────────────
  const removeLogo = async () => {
    const res = await authFetch(
      '/api/auth/logo/remove',
      {
        method: 'PATCH'
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    setCurrentUser(data.user);

    return true;
  };


  // ─── INCREMENT PAGES PRINTED ──────────────────────────────────────────────
  const incrementPagesPrinted = async (
    count
  ) => {
    const res = await authFetch(
      '/api/auth/increment-pages',
      {
        method: 'PATCH',

        body: JSON.stringify({
          count
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();

      setCurrentUser((prev) => ({
        ...prev,
        pagesPrinted: data.pagesPrinted
      }));
    }
  };


  // ─── CONTEXT ──────────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,

        login,
        logout,
        signup,

        generateResetCode,
        resetPassword,

        updatePlan,
        updateCompanyName,

        updateLogo,
        removeLogo,

        incrementPagesPrinted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};