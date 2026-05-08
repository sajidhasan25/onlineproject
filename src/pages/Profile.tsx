import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Calendar, ShieldCheck, MapPin, Phone, Package } from 'lucide-react';
import OrderHistory from '../components/OrderHistory';

const Profile = () => {
  const { userData, user } = useAuth();

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-50 pb-8 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold border-4 border-white shadow-lg">
              {userData.name?.charAt(0) || 'U'}
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{userData.name}</h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {userData.role}
                </span>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Account Details</h2>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                <ShieldCheck className="text-emerald-500" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account ID</p>
                  <p className="text-sm font-medium text-gray-700 font-mono">{user?.uid.substring(0, 10)}...</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                <Calendar className="text-emerald-500" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Joined On</p>
                  <p className="text-sm font-medium text-gray-700">
                    {userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Contact Information</h2>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                <Phone className="text-emerald-500" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-gray-700">{userData.phoneNumber || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                <MapPin className="text-emerald-500" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Default Address</p>
                  <p className="text-sm font-medium text-gray-700">{userData.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Orders</h2>
            <div className="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest">Live Updates</div>
          </div>

          <OrderHistory />
        </div>

        <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
              <p className="text-emerald-100 opacity-80">Our pharmacists are available 24/7 for consultations.</p>
            </div>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg active:scale-95">
              Contact Support
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
