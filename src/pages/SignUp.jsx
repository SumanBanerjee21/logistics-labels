import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck, Upload } from 'lucide-react';

export default function SignUp() {
  const [companyName, setCompanyName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG or WEBP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      setError('Logo size must be 1 MB or less.');
      e.target.value = '';
      return;
    }

    setError('');

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result);
      setLogoPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic regex for 10 digit mobile OR valid email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);
    const isMobile = /^\d{10}$/.test(userId);

    if (!isEmail && !isMobile) {
      setError(
        'Please enter a valid email or a 10-digit mobile number'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!logo) {
      setError('Please upload your company logo');
      return;
    }

    const success = await signup(
      companyName,
      userId,
      password,
      logo
    );

    if (success) {
      alert('Registration successful! Please log in.');
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
                <h1 className="text-xl font-bold tracking-tight text-brand-dark">
                  BANERJEE
                </h1>
                <p className="text-[10px] uppercase font-bold text-brand-orange tracking-widest">
                  Services
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mb-8 text-sm">
            Register to access the portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>

              <label className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-brand-teal cursor-pointer flex items-center justify-center gap-2 transition">
                <Upload size={20} className="text-brand-teal" />

                <span className="text-sm text-gray-600">
                  {logo ? 'Change Logo' : 'Upload Company Logo'}
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>

              {logoPreview && (
                <div className="mt-3 flex justify-center">
                  <div className="w-24 h-24 border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG or WEBP — maximum 1 MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID (Email or Mobile)
              </label>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create New Password
              </label>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retype New Password
              </label>

              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition mt-2"
            >
              <ShieldCheck size={20} />
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already registered?{' '}
              <Link
                to="/login"
                className="text-brand-teal font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}