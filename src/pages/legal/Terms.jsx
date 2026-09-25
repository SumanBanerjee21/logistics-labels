import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-gray p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-teal transition">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Terms & Conditions</h1>
        
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. Agreement to Terms</h2>
          <p>By accessing or using our Logistics Label App, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">2. Subscriptions & Payments</h2>
          <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis depending on the subscription plan you select. All payments are processed securely via Razorpay.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Usage Limits</h2>
          <p>Free plans are strictly limited to 10 page prints. The Standard plan allows up to 10,000 pages per billing cycle. The Pro plan offers unlimited prints. Exceeding these limits requires upgrading your plan.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">4. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Banerjee Services and its licensors.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">5. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes.</p>
        </div>
      </div>
    </div>
  );
}
