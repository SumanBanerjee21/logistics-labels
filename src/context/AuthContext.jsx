import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      // Also update the users database
      const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
      users[currentUser.username] = currentUser;
      localStorage.setItem('usersDB', JSON.stringify(users));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    const user = users[username];

    // User found and password matches → login
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }

    // User not found → auto-register as fresh user
    if (!user) {
      const newUser = { username, password, plan: null, pagesPrinted: 0, companyName: '', subscriptionDate: null };
      setCurrentUser(newUser);
      return true;
    }

    // User found but password wrong → stale record, reset and re-register fresh
    // (internal app: no sensitive data, avoids permanent lockout from stale localStorage)
    const freshUser = { username, password, plan: null, pagesPrinted: 0, companyName: '', subscriptionDate: null };
    setCurrentUser(freshUser);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      // Remove this user's saved data so next login starts fresh
      const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
      delete users[currentUser.username];
      localStorage.setItem('usersDB', JSON.stringify(users));
    }
    setCurrentUser(null);
  };

  const updatePlan = (plan) => {
    // When upgrading/renewing, reset the page count if they are starting a new paid month
    setCurrentUser(prev => ({ 
      ...prev, 
      plan,
      subscriptionDate: Date.now(),
      pagesPrinted: plan !== 'free' ? 0 : prev.pagesPrinted // Optional: reset count on renewal
    }));
  };

  const updateCompanyName = (companyName) => {
    setCurrentUser(prev => ({ ...prev, companyName }));
  };

  const incrementPagesPrinted = (count) => {
    setCurrentUser(prev => ({ ...prev, pagesPrinted: prev.pagesPrinted + count }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      updatePlan,
      updateCompanyName,
      incrementPagesPrinted
    }}>
      {children}
    </AuthContext.Provider>
  );
};
