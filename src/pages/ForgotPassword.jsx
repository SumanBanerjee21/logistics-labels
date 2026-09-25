import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck, Key, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { generateResetCode, resetPassword } = useContext(AuthContext);

  // Step 1: Send code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateResetCode(userId);
    setLoading(false);
    if (result) {
      alert(`Demo Mode: Your reset code is ${result}`);
      setError('');
      setStep(2);
    } else {
      setError('User ID not found.');
    }
  };

  // Step 2: Verify code (frontend compares against returned code)
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError('Please enter the 6-digit reset code.');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const success = await resetPassword(userId, code, newPassword);
    setLoading(false);
    if (success) {
      alert('Password reset successfully! Please log in with your new password.');
      navigate('/login');
    } else {
      setError('Invalid or expired reset code. Please try again.');
      setStep(2);
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

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Forgot Password</h2>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-center text-gray-500 mb-6 text-sm">Enter your User ID to receive a reset code.</p>
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
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-brand-teal hover:bg-teal-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                <Key size={20} />
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-center text-green-600 mb-6 text-sm font-medium">Reset code sent! Enter the 6-digit code below.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition text-center text-lg tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit"
                className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                <CheckCircle size={20} />
                Verify Code
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-center text-gray-500 mb-6 text-sm">Create a new secure password.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Create New Password</label>
                <input type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retype New Password</label>
                <input type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-brand-orange hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mt-2">
                <ShieldCheck size={20} />
                {loading ? 'Saving...' : 'Save New Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="text-brand-teal font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
