import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Truck, Settings, Maximize, CheckCircle, ArrowLeft, LogOut, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [docket, setDocket] = useState('');
  const [location, setLocation] = useState('');
  const [boxes, setBoxes] = useState('');
  const [paperSize, setPaperSize] = useState('3x4');
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const PAPER_SIZES = [
    { value: '2x3',     label: '2" × 3"'      },
    { value: '3x4',     label: '3" × 4"'      },
    { value: '4x4',     label: '4" × 4"'      },
    { value: '4x6',     label: '4" × 6"'      },
    { value: '100x150', label: '100 × 150 mm' },
    { value: 'A6',      label: 'A6 (105×148mm)'},
  ];

  if (!currentUser) return <Navigate to="/login" />;
  if (!currentUser.plan) return <Navigate to="/plans" />;
  if (!currentUser.companyName) return <Navigate to="/setup" />;

  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isExpired = currentUser.subscriptionDate && (Date.now() - currentUser.subscriptionDate > THIRTY_DAYS);
  if (isExpired) return <Navigate to="/plans" />;

  const isFreePlan = currentUser.plan === 'free';
  const isStandardPlan = currentUser.plan === '299';
  
  const limitReached = (isFreePlan && currentUser.pagesPrinted >= 10) || 
                       (isStandardPlan && currentUser.pagesPrinted >= 10000);

  if (limitReached) return <Navigate to="/plans" />;

  const [boxError, setBoxError] = useState('');

  // How many boxes are still allowed under this plan
  const printLimit = isFreePlan ? 10 : isStandardPlan ? 10000 : Infinity;
  const remaining = printLimit - (currentUser.pagesPrinted || 0);

  const handleSave = (e) => {
    e.preventDefault();
    if (!docket || !location || !boxes) return;

    const requestedBoxes = parseInt(boxes, 10);

    if (requestedBoxes > remaining) {
      setBoxError(
        `You can only print ${remaining} more box${remaining === 1 ? '' : 'es'} on your current plan. Please enter ${remaining} or fewer.`
      );
      return;
    }

    setBoxError('');
    navigate('/preview', {
      state: {
        docket,
        location,
        totalBoxes: requestedBoxes,
        paperSize,
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden pb-6">
        {/* Header */}
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Truck size={36} className="text-brand-teal" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-brand-dark leading-tight uppercase">
                {currentUser.companyName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/pricing')} className="p-2 bg-gray-100 rounded-full text-brand-teal hover:bg-teal-50 transition font-bold text-xs uppercase px-4 flex items-center gap-1" title="Pricing List">
              Pricing
            </button>
            <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-brand-teal hover:bg-teal-50 transition" title="Go Back">
              <ArrowLeft size={20} />
            </button>
            <button onClick={handleLogout} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="px-6 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Make box labels.</h2>
          <p className="text-slate-500 text-lg">One docket. Every box accounted for.</p>
          
          {isFreePlan && (
            <div className="mt-4 inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              Free prints: {currentUser.pagesPrinted} / 10
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="px-6">
          <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">New label set</h3>
              <div className="relative flex items-center">
                <Maximize size={14} className="absolute left-2.5 text-brand-orange pointer-events-none" />
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  className="appearance-none pl-7 pr-7 py-1.5 rounded-full bg-white border border-orange-200 text-brand-orange text-sm font-semibold shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-brand-orange transition"
                >
                  {PAPER_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2 text-brand-orange pointer-events-none" />
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Docket number</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition"
                  placeholder="e.g. DKT-2026-0418"
                  value={docket}
                  onChange={(e) => setDocket(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition"
                  placeholder="e.g. Bengaluru Warehouse"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Total boxes
                  {remaining < Infinity && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      ({remaining} remaining)
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={remaining < Infinity ? remaining : undefined}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:border-transparent outline-none transition ${boxError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-brand-orange'}`}
                  placeholder="10"
                  value={boxes}
                  onInvalid={(e) => {
                    if (e.target.validity.rangeOverflow && isFreePlan) {
                      e.target.setCustomValidity(`Value must be less than or equal to ${remaining} for free version`);
                    } else if (e.target.validity.rangeOverflow) {
                      e.target.setCustomValidity(`Value must be less than or equal to ${remaining}`);
                    }
                  }}
                  onInput={(e) => { 
                    e.target.setCustomValidity(''); 
                  }}
                  onChange={(e) => { 
                    setBoxes(e.target.value); 
                    setBoxError(''); 
                  }}
                />
                {boxError && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{boxError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition mt-6 shadow-md shadow-orange-200"
              >
                <CheckCircle size={20} />
                Save label set
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
