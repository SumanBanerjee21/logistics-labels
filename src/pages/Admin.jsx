import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    
    // Create CSV header
    let csvContent = "User ID (Email/Mobile),Company Name,Plan,Pages Printed,Subscription Date\n";

    // Add rows
    Object.values(users).forEach(user => {
      const dateStr = user.subscriptionDate ? new Date(user.subscriptionDate).toLocaleDateString() : 'N/A';
      const planName = user.plan === '299' ? 'Standard' : user.plan === '999' ? 'Pro' : 'Free';
      const row = `"${user.userId || user.username}","${user.companyName || ''}","${planName}","${user.pagesPrinted}","${dateStr}"`;
      csvContent += row + "\n";
    });

    // Create a Blob and trigger download (Works better for Excel than data URI)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Registered_Users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">Admin Dashboard</h2>
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-brand-teal hover:bg-teal-50 transition" title="Go Back">
            <ArrowLeft size={20} />
          </button>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-8 text-sm">Download your user database in CSV format, which can be directly opened in Microsoft Excel.</p>
          
          <button
            onClick={handleDownload}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Download size={20} />
            Download Users to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
