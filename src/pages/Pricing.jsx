import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Logistics Label Printing Service</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A professional web-based application for generating and printing logistics shipping labels.
          Upload your shipment data and print thermal labels instantly — from anywhere.
        </p>
      </div>

      {/* Services Section */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold text-slate-800 text-center mb-10">What We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">📦</div>
            <h4 className="font-bold text-slate-800 mb-2">Label Generation</h4>
            <p className="text-gray-500 text-sm">Generate professional shipping labels with docket numbers, locations, and box counts automatically.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">🖨️</div>
            <h4 className="font-bold text-slate-800 mb-2">Thermal Print Support</h4>
            <p className="text-gray-500 text-sm">Support for multiple thermal label sizes: 2x3, 3x4, 4x4, 4x6, 100x150mm, and A6.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="font-bold text-slate-800 mb-2">Excel Integration</h4>
            <p className="text-gray-500 text-sm">Import shipment data directly from Excel files. Process bulk shipments in seconds.</p>
          </div>
        </div>

        {/* Pricing */}
        <h3 className="text-2xl font-bold text-slate-800 text-center mb-10">Subscription Plans & Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Free */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100">
            <h4 className="text-xl font-bold text-slate-800 mb-1">Free Trial</h4>
            <p className="text-gray-500 text-sm mb-4">Try before you subscribe</p>
            <div className="text-4xl font-extrabold text-slate-800 mb-6">₹0</div>
            <ul className="space-y-3 text-sm text-gray-600">
              {['Up to 10 label prints', 'All label sizes supported', 'Excel file import', 'One-time use only'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-brand-teal flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="mt-8 block text-center bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold py-3 rounded-lg transition">
              Get Started Free
            </Link>
          </div>

          {/* Standard */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-teal relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-teal text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
            <h4 className="text-xl font-bold text-slate-800 mb-1">Standard</h4>
            <p className="text-gray-500 text-sm mb-4">For small businesses</p>
            <div className="text-4xl font-extrabold text-brand-teal mb-1">₹299</div>
            <p className="text-gray-400 text-xs mb-6">per month</p>
            <ul className="space-y-3 text-sm text-gray-600">
              {['Up to 10,000 label prints/month', 'All label sizes supported', 'Excel file import', 'Priority support', 'Valid for 30 days'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-brand-teal flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="mt-8 block text-center bg-brand-teal hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition">
              Subscribe Now
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-orange">
            <h4 className="text-xl font-bold text-slate-800 mb-1">Pro</h4>
            <p className="text-gray-500 text-sm mb-4">For large enterprises</p>
            <div className="text-4xl font-extrabold text-brand-orange mb-1">₹999</div>
            <p className="text-gray-400 text-xs mb-6">per month</p>
            <ul className="space-y-3 text-sm text-gray-600">
              {['Unlimited label prints/month', 'All label sizes supported', 'Excel file import', 'Priority support', 'Valid for 30 days', 'Dedicated account manager'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-brand-orange flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="mt-8 block text-center bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition">
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
