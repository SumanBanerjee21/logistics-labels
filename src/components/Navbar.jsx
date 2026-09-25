import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  // Only show Navbar on public pages (Login, Signup, Pricing, Legal pages)
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/pricing', '/contact', '/terms', '/privacy', '/refund'];
  
  if (!publicRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-6 w-full">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2">
          <Truck size={28} className="text-brand-teal" />
          <div>
            <h1 className="text-lg font-bold text-brand-dark leading-tight">BANERJEE</h1>
            <p className="text-[9px] uppercase font-bold text-brand-orange tracking-widest">Services</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            to="/pricing" 
            className={`font-semibold transition text-sm uppercase tracking-wide ${location.pathname === '/pricing' ? 'text-brand-teal' : 'text-gray-600 hover:text-brand-teal'}`}
          >
            Pricing
          </Link>
          <Link 
            to="/login" 
            className={`font-semibold transition text-sm uppercase tracking-wide ${location.pathname === '/login' || location.pathname === '/signup' ? 'text-brand-teal' : 'text-gray-600 hover:text-brand-teal'}`}
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
