import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Preview from './pages/Preview';
import Subscription from './pages/Subscription';

import Plans from './pages/Plans';
import Setup from './pages/Setup';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
