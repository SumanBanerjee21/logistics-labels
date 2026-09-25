import React, { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { QrCode, Check, ArrowLeft, LogOut } from 'lucide-react';

export default function Plans() {
  const { currentUser, updatePlan, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  if (!currentUser) return <Navigate to="/login" />;
  
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isExpired = currentUser.subscriptionDate && (Date.now() - currentUser.subscriptionDate > THIRTY_DAYS);
  const isFreePlan = currentUser.plan === 'free';
  const isStandardPlan = currentUser.plan === '299';
  
  const limitReached = (isFreePlan && currentUser.pagesPrinted >= 10) || 
                       (isStandardPlan && currentUser.pagesPrinted >= 10000);

  // If user has a valid plan, isn't expired, hasn't reached limit, and has setup name -> go to dashboard
  if (currentUser.plan && currentUser.companyName && !isExpired && !limitReached) {
    return <Navigate to="/" />;
  }

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    if (plan === 'free') {
      updatePlan('free');
      navigate('/setup');
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = () => {
    updatePlan(selectedPlan);
    alert('Payment verified! Proceeding to setup.');
    navigate('/setup');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (showPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full relative">
          <button 
            onClick={() => setShowPayment(false)}
            className="absolute top-4 left-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <h2 className="text-xl font-bold mb-4 mt-2">Pay via UPI QR</h2>
          <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center border border-gray-100 mb-6">
             <img src="/qr.png" alt="UPI QR Code" className="w-48 h-48 object-contain rounded-lg mb-4" />
             <p className="text-sm text-gray-500 mb-2">Scan with any UPI app</p>
             <p className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">indsumanttt2002@oksbi</p>
          </div>
          <button onClick={handlePaymentComplete} className="bg-brand-teal text-white px-6 py-3 rounded-lg w-full font-bold flex items-center justify-center gap-2">
            <Check size={20} /> I have made the payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      {/* Logout button - fixed top right, outside the card */}
      <button 
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 bg-white rounded-full shadow transition"
      >
        <LogOut size={15} /> Logout
      </button>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6">
        
        {(isExpired || limitReached) && (
          <div className="bg-orange-100 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {isExpired ? "Your plan has expired after 1 month. Please renew to continue." : "You have reached your plan's print limit. Please upgrade or renew."}
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {currentUser.plan ? "Renew or Upgrade Plan" : "Choose a Plan"}
        </h1>
        
        <div className="space-y-4">
          {/* Free Plan (Hidden if upgrading/renewing) */}
          {!currentUser.plan && (
            <div 
              onClick={() => handleSelectPlan('free')}
              className="border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">Free Trial</h3>
                <div className="text-slate-600 font-extrabold">₹0</div>
              </div>
              <p className="text-sm text-gray-500">One-time use for <span className="font-bold text-slate-700">10 pages</span></p>
            </div>
          )}

          {/* Plan 1 */}
          {(!limitReached || isExpired) && (
            <div 
              onClick={() => handleSelectPlan('299')}
              className="border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">Standard</h3>
                <div className="text-brand-teal font-extrabold text-xl">₹299</div>
              </div>
              <p className="text-sm text-gray-500">Up to <span className="font-bold text-slate-700">10,000</span> pages print &bull; Renew after 1 month</p>
            </div>
          )}

          {/* Plan 2 */}
          <div 
            onClick={() => handleSelectPlan('999')}
            className="border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg">Pro</h3>
              <div className="text-brand-teal font-extrabold text-xl">₹999</div>
            </div>
            <p className="text-sm text-gray-500">Use <span className="font-bold text-slate-700">unlimited</span> pages &bull; Renew after 1 month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
