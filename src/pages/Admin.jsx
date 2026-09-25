import React, { useEffect, useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDownload = () => {
    // Create CSV header
    let csvContent = "User ID (Email/Mobile),Company Name,Plan,Pages Printed,Subscription Date\n";

    // Add rows
    users.forEach(user => {
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
          
          {loading ? (
            <p className="text-brand-teal font-semibold animate-pulse mb-4">Loading users...</p>
          ) : error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <p className="text-gray-700 font-bold mb-6 text-xl">Total Users: {users.length}</p>
          )}

          <button
            onClick={handleDownload}
            disabled={loading || users.length === 0}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Download size={20} />
            Download Users to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
