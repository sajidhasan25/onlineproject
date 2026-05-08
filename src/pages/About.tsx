import React from 'react';
import { Pill, ShieldCheck, Truck, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-emerald-600 text-white mb-8 shadow-xl shadow-emerald-200"
          >
            <Pill size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">Your Trusted <span className="text-emerald-600">Digital</span> Pharmacist.</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            MediQuick is on a mission to make healthcare accessible, affordable, and honest for everyone. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: 'Safe & Verified', desc: 'Every medicine in our inventory undergoes rigorous quality checks by professional pharmacists.', color: 'emerald' },
            { icon: Truck, title: 'Same Day Delivery', desc: 'Order before noon and get your doses delivered the same day in major cities.', color: 'blue' },
            { icon: Clock, title: '24/7 Support', desc: 'Our licensed pharmacists are always online to answer your medical queries.', color: 'purple' },
            { icon: Heart, title: 'Patient First', desc: 'We prioritize your health over profits. Subscription models for regular meds coming soon.', color: 'red' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[3rem] p-10 hover:bg-white hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-${item.color}-600`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 rounded-[4rem] bg-emerald-950 p-12 md:p-24 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">Revolutionizing how you stay healthy.</h2>
            <p className="text-emerald-100 opacity-60 text-lg mb-10 leading-relaxed font-medium">
              We started during the pandemic when accessibility was limited. Today, we are the fastest growing online pharmacy with over 1M+ active users.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-900/50">
                Join our Team
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10">
                Our Story
              </button>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
