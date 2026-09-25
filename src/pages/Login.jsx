import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck } from 'lucide-react';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(userId, password);
    if (success) {
      navigate('/plans');
    } else {
      setError('Invalid User ID or Password');
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
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Secure Login</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Enter your credentials to access the portal</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-teal hover:underline font-semibold">Forgot password?</Link>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck size={20} />
              Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <Link to="/signup" className="text-brand-teal font-semibold hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
