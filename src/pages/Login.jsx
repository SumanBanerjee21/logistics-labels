import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/plans');
    } else {
      setError('Invalid credentials');
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck size={20} />
              Login or Register
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">New users will be registered automatically</p>
          </form>
        </div>
      </div>
    </div>
  );
}
