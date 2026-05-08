import React from 'react';
import { Pill, ShieldCheck, Truck, Clock, Heart, Award, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const About = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <Globe size={12} />
            Our Global Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Standardizing <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Healthcare</span> Accessibility.
          </h1>
          <p className="text-sm text-slate-500 max-w-xl font-medium leading-relaxed mb-8">
            MediQuick operates at the intersection of logistics and healthcare. We leverage high-density distribution networks to ensure pharmaceutical essentials reach patients in record time.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {[
              { label: 'Founded', value: '2021' },
              { label: 'Daily Shipments', value: '15k+' },
              { label: 'Pharmacists', value: '450' },
              { label: 'Rating', value: '4.9/5' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{stat.label}</div>
                <div className="text-xl font-black text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: 'Safe & Verified', desc: 'Every medicine undergoes rigorous 3-step verification.' },
          { icon: Truck, title: 'Network Logistics', desc: 'High-density urban distribution for 24-minute deliveries.' },
          { icon: Zap, title: 'Real-time Stack', desc: 'Instant pharmacist chat and live prescription validation.' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-4 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <item.icon size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Revolutionizing the Patient Experience.</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            We are building the infrastructure for the next generation of healthcare delivery. Join us on our journey to serve 10M+ patients by 2026.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            Careers
          </button>
          <button className="flex-1 md:flex-none h-12 px-8 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition-all border border-white/10">
            Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
