import React from 'react';
import { Download } from 'lucide-react';

export default function Admin() {
  const handleDownload = () => {
    const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
    
    // Create CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Username,Password,Plan,PagesPrinted,CompanyName\n";

    // Add rows
    Object.values(users).forEach(user => {
      const row = `${user.username},${user.password},${user.plan || 'none'},${user.pagesPrinted},"${user.companyName || ''}"`;
      csvContent += row + "\n";
    });

    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-gray-500 mb-8">Download your user database (Excel/CSV)</p>
        
        <button
          onClick={handleDownload}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Download size={20} />
          Download Users to Excel
        </button>
      </div>
    </div>
  );
}
