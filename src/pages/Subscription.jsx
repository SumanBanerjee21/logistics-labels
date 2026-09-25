import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, QrCode, Check, AlertCircle } from 'lucide-react';

export default function Subscription() {
  const { currentUser, updatePlan } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('299');

  const handleSubscribe = () => {
    updatePlan(selectedPlan);
    alert('Payment verified! Subscription activated.');
    navigate('/');
  };

  const isSubscribed = currentUser?.plan && currentUser?.plan !== 'free';

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full">
          <Check size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Subscribed!</h2>
          <p className="text-gray-500 mb-6">You have an active subscription.</p>
          <button onClick={() => navigate('/')} className="bg-brand-teal text-white px-6 py-2 rounded-lg w-full font-bold">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        <div className="bg-slate-800 p-6 text-white text-center">
          {currentUser?.pagesPrinted >= 10 && (
            <div className="flex items-center justify-center gap-2 text-orange-400 mb-4 bg-slate-900/50 py-2 rounded-lg text-sm font-semibold">
              <AlertCircle size={18} /> Free limit (10 pages) reached
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2">Choose a Plan</h1>
          <p className="text-slate-400 text-sm">Continue printing without limits</p>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Plan 1 */}
          <div 
            onClick={() => setSelectedPlan('299')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${selectedPlan === '299' ? 'border-brand-teal bg-teal-50/50' : 'border-gray-200 hover:border-teal-200'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Standard Plan</h3>
              <div className="text-brand-teal font-extrabold text-xl">₹299<span className="text-xs text-gray-500 font-normal">/mo</span></div>
            </div>
            <p className="text-sm text-gray-500">Up to <span className="font-bold text-slate-700">10,000</span> pages print</p>
          </div>

          {/* Plan 2 */}
          <div 
            onClick={() => setSelectedPlan('999')}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${selectedPlan === '999' ? 'border-brand-teal bg-teal-50/50' : 'border-gray-200 hover:border-teal-200'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Pro Plan</h3>
              <div className="text-brand-teal font-extrabold text-xl">₹999<span className="text-xs text-gray-500 font-normal">/mo</span></div>
            </div>
            <p className="text-sm text-gray-500">Up to <span className="font-bold text-slate-700">50,000</span> pages print</p>
          </div>

          <div className="my-8 border-t border-gray-200 pt-6">
            <h3 className="font-bold text-center text-slate-800 mb-4">Pay via UPI QR</h3>
            <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center border border-gray-100">
               <img src="/qr.png" alt="UPI QR Code" className="w-48 h-48 object-contain rounded-lg mb-4" />
               <p className="text-sm text-gray-500 mb-2">Scan with any UPI app</p>
               <p className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">indsumanttt2002@oksbi</p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className="w-full bg-brand-teal hover:bg-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
          >
            <QrCode size={20} />
            I have made the payment
          </button>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">Card and other options will be available via Razorpay soon.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
