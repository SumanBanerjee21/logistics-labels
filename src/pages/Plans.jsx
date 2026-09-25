import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Check, ArrowLeft, LogOut } from 'lucide-react';
import { API_URL } from '../config';

export default function Plans() {
  const { currentUser, token, updatePlan, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!currentUser) return <Navigate to="/login" />;
  
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isExpired = currentUser.subscriptionDate && (Date.now() - new Date(currentUser.subscriptionDate).getTime() > THIRTY_DAYS);
  const isFreePlan = currentUser.plan === 'free';
  const isStandardPlan = currentUser.plan === '299';
  
  const limitReached = (isFreePlan && currentUser.pagesPrinted >= 10) || 
                       (isStandardPlan && currentUser.pagesPrinted >= 10000);

  if (currentUser.plan && currentUser.companyName && !isExpired && !limitReached) {
    return <Navigate to="/" />;
  }

  const handleSelectPlan = async (plan) => {
    setError('');
    if (plan === 'free') {
      await updatePlan('free');
      navigate('/setup');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'BANERJEE Services',
        description: `Subscription for ${plan === '299' ? 'Standard' : 'Pro'} Plan`,
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              await updatePlan(plan); // Ensure context is updated
              alert('Payment successful! Proceeding to setup.');
              navigate('/setup');
            } else {
              setError('Payment verification failed.');
            }
          } catch (err) {
            setError('Error verifying payment.');
          }
        },
        prefill: {
          name: currentUser.companyName,
          email: currentUser.userId.includes('@') ? currentUser.userId : 'test@example.com',
          contact: !currentUser.userId.includes('@') ? currentUser.userId : '9999999999'
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  { method: 'upi' }
                ]
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' }
                ]
              }
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        theme: {
          color: '#0d9488' // brand-teal
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="fixed top-4 right-4 p-3 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition z-50 flex items-center gap-2 font-semibold"
        title="Logout"
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Logout</span>
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {currentUser.plan ? "Renew or Upgrade Plan" : "Choose a Plan"}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Free Plan */}
          {!currentUser.plan && (
            <div 
              onClick={() => !isProcessing && handleSelectPlan('free')}
              className={`border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">Free Trial</h3>
                <div className="text-slate-600 font-extrabold">₹0</div>
              </div>
              <p className="text-sm text-gray-500">One-time use for <span className="font-bold text-slate-700">10 pages</span></p>
            </div>
          )}

          {/* Plan 1 */}
          <div 
            onClick={() => !isProcessing && handleSelectPlan('299')}
            className={`border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg">Standard</h3>
              <div className="text-brand-teal font-extrabold text-xl">₹299</div>
            </div>
            <p className="text-sm text-gray-500">Up to <span className="font-bold text-slate-700">10,000</span> pages print &bull; Renew after 1 month</p>
          </div>

          {/* Plan 2 */}
          <div 
            onClick={() => !isProcessing && handleSelectPlan('999')}
            className={`border-2 rounded-xl p-4 cursor-pointer border-gray-200 hover:border-brand-teal transition ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg">Pro</h3>
              <div className="text-brand-teal font-extrabold text-xl">₹999</div>
            </div>
            <p className="text-sm text-gray-500">Use <span className="font-bold text-slate-700">unlimited</span> pages &bull; Renew after 1 month</p>
          </div>
        </div>

        {isProcessing && (
          <p className="mt-4 text-center text-brand-teal font-semibold animate-pulse">
            Processing payment...
          </p>
        )}
      </div>
    </div>
  );
}
