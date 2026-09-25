import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-gray p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-teal transition">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We are here to help you. If you have any questions, concerns, or need support regarding our Logistics Label App or subscription plans, please feel free to reach out to us.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-50 text-brand-teal rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Email Us</h3>
              <p className="text-gray-600">indsumanttt2002@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-50 text-brand-teal rounded-lg">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Call Us</h3>
              <p className="text-gray-600">+91 98321 28998</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-50 text-brand-teal rounded-lg">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Address</h3>
              <p className="text-gray-600">Banerjee Services<br/>West Bengal, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
