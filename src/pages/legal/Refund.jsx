import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Refund() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-gray p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-teal transition">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Refund & Cancellation Policy</h1>
        
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. Cancellations</h2>
          <p>You may cancel your subscription at any time. Cancellation will take effect at the end of the current paid billing period. You will continue to have access to the service until the end of your billing period.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">2. Refunds</h2>
          <p>We offer a 7-day money-back guarantee for new subscriptions. If you are not satisfied with the service, you can request a full refund within 7 days of your initial purchase by contacting our support team.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Exceptions</h2>
          <p>Refunds will not be provided after the 7-day period has passed, or for subscription renewals. If you have exceeded the usage limits of your plan before requesting a refund, the refund request may be denied at our discretion.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">4. Processing Time</h2>
          <p>Approved refunds will be processed within 5-7 business days and credited back to the original method of payment via Razorpay.</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">5. Contact for Refunds</h2>
          <p>To request a refund or cancellation, please email us at indsumanttt2002@gmail.com with your User ID and transaction details.</p>
        </div>
      </div>
    </div>
  );
}
