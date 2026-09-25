import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck } from 'lucide-react';

export default function SignUp() {
  const [companyName, setCompanyName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic regex for 10 digit mobile OR valid email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);
    const isMobile = /^\d{10}$/.test(userId);
    
    if (!isEmail && !isMobile) {
      setError("Please enter a valid email or a 10-digit mobile number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const success = await signup(companyName, userId, password);
    if (success) {
      alert("Registration successful! Please log in.");
      navigate('/login');
    } else {
      setError('User ID already exists. Please log in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Truck size={32} className="text-brand-teal" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-brand-dark">BANERJEE</h1>
                <p className="text-[10px] uppercase font-bold text-brand-orange tracking-widest">Services</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Register to access the portal</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Ltd."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID (Email or Mobile)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="name@example.com or 9876543210"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Create New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retype New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mt-2"
            >
              <ShieldCheck size={20} />
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already registered? <Link to="/login" className="text-brand-teal font-semibold hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
