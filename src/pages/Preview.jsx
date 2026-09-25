import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Printer, ChevronDown, Monitor } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Preview() {
  const locationState = useLocation().state;
  const navigate = useNavigate();
  const { currentUser, incrementPagesPrinted } = useContext(AuthContext);
  const [paperSize, setPaperSize] = useState(locationState?.paperSize || '3x4');

  if (!currentUser) return <Navigate to="/login" />;
  if (!locationState) return <Navigate to="/" />;
  
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isExpired = currentUser.subscriptionDate && (Date.now() - currentUser.subscriptionDate > THIRTY_DAYS);
  if (isExpired) return <Navigate to="/plans" />;

  const isFreePlan = currentUser.plan === 'free';
  const isStandardPlan = currentUser.plan === '299';
  
  const limitReached = (isFreePlan && currentUser.pagesPrinted >= 10) || 
                       (isStandardPlan && currentUser.pagesPrinted >= 10000);

  if (limitReached) return <Navigate to="/plans" />;

  const { docket, location, totalBoxes } = locationState;

  const handlePrint = () => {
    window.print();
    // After printing, update limit
    incrementPagesPrinted(totalBoxes);
    // Might want to navigate back or just show a message.
  };

  // Generate array for boxes
  const boxes = Array.from({ length: totalBoxes }, (_, i) => i + 1);

  const sizeStyles = {
    '2x3':     { aspect: 'aspect-[2/3]',   print: 'print:w-[2in] print:h-[3in]',       label: '2" × 3"'       },
    '3x4':     { aspect: 'aspect-[3/4]',   print: 'print:w-[3in] print:h-[4in]',       label: '3" × 4"'       },
    '4x4':     { aspect: 'aspect-square',  print: 'print:w-[4in] print:h-[4in]',       label: '4" × 4"'       },
    '4x6':     { aspect: 'aspect-[2/3]',   print: 'print:w-[4in] print:h-[6in]',       label: '4" × 6"'       },
    '100x150': { aspect: 'aspect-[2/3]',   print: 'print:w-[100mm] print:h-[150mm]',   label: '100 × 150 mm'  },
    'A6':      { aspect: 'aspect-[3/4]',   print: 'print:w-[105mm] print:h-[148mm]',   label: 'A6 (105×148mm)'},
  };

  const currentStyle = sizeStyles[paperSize] ?? sizeStyles['3x4'];

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      
      {/* Non-printable UI */}
      <div className="print:hidden">
        <div className="bg-brand-teal text-white p-4 shadow-md sticky top-0 z-10">
          <div className="max-w-md mx-auto flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor size={24} />
              <div className="text-sm font-medium">Printer Connection...</div>
            </div>
          </div>
          
          <div className="max-w-md mx-auto flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>Copies: <span className="font-bold">1</span></span>
              
              <div className="flex items-center gap-1">
                <span>Paper size:</span>
                <select 
                  className="bg-transparent font-bold border-b border-white outline-none cursor-pointer text-white appearance-none pr-4 relative"
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                >
                  <option className="text-slate-800" value="3x4">3" x 4"</option>
                  <option className="text-slate-800" value="4x4">4" x 4"</option>
                  <option className="text-slate-800" value="4x6">4" x 6"</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Print Button */}
        <button 
          onClick={handlePrint}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-yellow-400 hover:bg-yellow-500 text-slate-800 p-4 rounded-full shadow-lg z-20 transition cursor-pointer"
        >
          <Printer size={28} />
        </button>
      </div>

      {/* Printable Area - Centered on screen, but full width on print */}
      <div id="print-section" className="max-w-md mx-auto p-4 space-y-6 print:p-0 print:space-y-0 print:block">
        
        {boxes.map((boxNum) => (
          <div key={boxNum} className={`print-label bg-white shadow-sm border border-gray-200 relative flex flex-col p-6 print:border-none print:shadow-none print:mx-auto ${currentStyle.aspect} ${currentStyle.print}`}>
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-800 leading-tight uppercase">
                    {currentUser.companyName}
                  </div>
               </div>
               <div className="text-[10px] text-gray-400 font-medium">{currentStyle.label}</div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <div className="text-xs text-gray-500 font-bold tracking-widest mb-1">DOCKET NUMBER</div>
                <div className="text-4xl font-extrabold text-slate-800">{docket}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-bold tracking-widest mb-1">LOCATION</div>
                <div className="text-xl font-bold text-slate-700">{location}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-4 flex justify-between items-end mt-4">
              <div className="text-xs font-bold text-gray-400 tracking-widest">BOX</div>
              <div className="text-5xl font-bold text-brand-orange">
                {boxNum}<span className="text-2xl text-gray-400">/{totalBoxes}</span>
              </div>
            </div>
            
            {/* Bottom visual bar */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-300 flex items-center justify-between px-4 print:hidden">
               <div className="text-xs text-white font-bold">{boxNum}/{totalBoxes}</div>
               <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-gray-300"></div>
               </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
