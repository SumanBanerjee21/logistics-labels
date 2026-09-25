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

  const login = (userId, password) => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    const user = users[userId];

    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    return false; // Real login: fail if wrong credentials
  };

  const signup = (companyName, userId, password) => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    if (users[userId]) {
      return false; // User already exists
    }
    const newUser = { userId, username: userId, password, plan: null, pagesPrinted: 0, companyName, subscriptionDate: null };
    users[userId] = newUser;
    localStorage.setItem('usersDB', JSON.stringify(users));
    return true; // Successfully registered, but don't log them in yet
  };

  const generateResetCode = (userId) => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    if (!users[userId]) return false;
    // For demo purposes, we always generate '123456' or could generate random
    const code = '123456'; 
    localStorage.setItem('resetCode_' + userId, code);
    return code;
  };

  const resetPassword = (userId, newPassword) => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    if (users[userId]) {
      users[userId].password = newPassword;
      localStorage.setItem('usersDB', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const logout = () => {
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
      signup,
      generateResetCode,
      resetPassword,
      updatePlan,
      updateCompanyName,
      incrementPagesPrinted
    }}>
      {children}
    </AuthContext.Provider>
  );
};
