import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-gray p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-teal transition">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when registering for an account, including your Email or Mobile Number, Company Name, and encrypted password.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">2. How We Use Your Information</h2>
          <p>We use the information we collect to operate and maintain our Logistics Label App, process your subscription payments, and manage your usage limits.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Payment Information</h2>
          <p>We do not store your credit card details or UPI information. All payment processing is handled securely by Razorpay. Please refer to Razorpay's privacy policy for more details on how they handle payment data.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. Passwords are securely hashed and never stored in plain text.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at indsumanttt2002@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
