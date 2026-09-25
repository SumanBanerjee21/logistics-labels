import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-400 py-6 text-sm mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="font-bold text-white mb-1">BANERJEE Services</p>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs font-semibold">
          <Link to="/contact" className="hover:text-brand-teal transition">Contact Us</Link>
          <Link to="/terms" className="hover:text-brand-teal transition">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-brand-teal transition">Privacy Policy</Link>
          <Link to="/refund" className="hover:text-brand-teal transition">Refund & Cancellation</Link>
        </div>
      </div>
    </footer>
  );
}
