import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, LogOut } from 'lucide-react';

export default function Setup() {
  const { currentUser, updateCompanyName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');

  if (!currentUser) return <Navigate to="/login" />;
  if (!currentUser.plan) return <Navigate to="/plans" />;
  if (currentUser.companyName) return <Navigate to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      updateCompanyName(name.trim());
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition flex items-center gap-1 text-xs font-bold"
        >
          <LogOut size={16} /> Logout
        </button>
        <div className="flex justify-center mb-6">
          <Building2 size={48} className="text-brand-teal" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Your Company Name</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">This name will be printed on your labels.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition mb-6"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Corp"
            required
          />
          <button
            type="submit"
            className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
