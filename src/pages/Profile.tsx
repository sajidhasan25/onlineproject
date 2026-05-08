import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Calendar, ShieldCheck, MapPin, Phone, Package, Star, Settings } from 'lucide-react';
import OrderHistory from '../components/OrderHistory';
import { cn } from '../lib/utils';

const Profile = () => {
  const { userData, user } = useAuth();

  if (!userData) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg shadow-slate-200">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Patient Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Manage your medical profile and order history</p>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
          <Settings size={14} />
          Account Settings
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-8">
          {/* Main Identity Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-black border border-blue-100">
                {userData.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{userData.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {userData.role}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    Verified Patient
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-2"><Mail size={14} /> Email Address</span>
                <span className="text-slate-900">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-2"><Phone size={14} /> Contact Number</span>
                <span className="text-slate-900">{userData.phoneNumber || 'Not Set'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-2"><Calendar size={14} /> Member Since</span>
                <span className="text-slate-900">
                  {userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : '2024'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Permanent Address</h3>
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-80 mb-6">
              {userData.address || 'No shipping address provided yet. Please update your settings for faster checkouts.'}
            </p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded uppercase tracking-widest border border-white/5 transition-all">
              Update Address
            </button>
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Package size={16} />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Orders</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Real-time Tracker
            </div>
          </div>

          <OrderHistory />

          <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Need a medical report?</h3>
            <p className="text-[11px] text-slate-400 mb-6 mx-auto max-w-xs">Download your full prescription and order history for medical or insurance purposes.</p>
            <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase tracking-widest transition-all">
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
