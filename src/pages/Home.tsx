import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Medicine } from '../types';
import { useCart } from '../context/CartContext';
import { Search, Filter, ShoppingBag, Info, AlertCircle, Pill, TrendingUp, Users, Package, Clock, Star, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Home = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Painkiller', 'Antibiotic', 'Fever', 'Diabetes', 'Heart', 'Vitamins'];

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'medicines'));
        const meds: Medicine[] = [];
        querySnapshot.forEach((doc) => {
          meds.push({ id: doc.id, ...doc.data() } as Medicine);
        });
        setMedicines(meds);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || med.category === category;
    return matchesSearch && matchesCategory;
  });

  const metrics = [
    { label: 'Daily Orders', value: '1,482', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Patients', value: '12k+', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Medicine Stock', value: '85,000+', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Average Delivery', value: '24m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{metric.label}</div>
              <div className="text-xl font-bold text-slate-900">{metric.value}</div>
            </div>
            <div className={cn("p-2 rounded-lg", metric.bg, metric.color)}>
              <metric.icon size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">Medicine Inventory</h2>
                <p className="text-xs text-slate-500 font-medium">Browse and search for verified pharmaceutical products</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="hidden sm:flex bg-white border border-slate-200 rounded-lg p-1">
                {['Grid', 'List'].map(mode => (
                  <button key={mode} className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", mode === 'Grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600')}>
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Selection */}
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                  category === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Medicine List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-xl p-4 h-48 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMedicines.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-400 transition-all group flex flex-col sm:flex-row gap-4 relative"
                >
                  <div className="w-full sm:w-24 h-24 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                    {med.imageUrl ? (
                      <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-300" referrerPolicy="no-referrer" />
                    ) : (
                      <Pill size={32} className="text-slate-200" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">{med.category}</div>
                      {med.prescriptionRequired && (
                        <div className="bg-red-50 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-100">RX REQUIRED</div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{med.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-1">{med.description || 'Verified pharmaceutical product'}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold">UNIT PRICE</span>
                        <span className="text-lg font-black text-slate-900">${med.price}</span>
                      </div>
                      <button
                        onClick={() => addToCart(med)}
                        disabled={med.stock <= 0}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          med.stock > 0
                            ? "bg-slate-900 text-white hover:bg-blue-600 active:scale-95"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                      >
                        <ShoppingBag size={14} />
                        ADD
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Info size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Empty Stock</h3>
              <p className="text-xs text-slate-400">No medicines found for selected filters.</p>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Trending Medicines Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Trending Now</h3>
              </div>
              <div className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">VIEW ALL</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold tracking-tighter">
                    <th className="px-4 py-2">Medicine</th>
                    <th className="px-4 py-2">Sales</th>
                    <th className="px-4 py-2 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {medicines.slice(0, 5).map((med, i) => (
                    <tr key={med.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800 group-hover:text-blue-600">{med.name}</div>
                        <div className="text-[10px] text-slate-400">{med.category}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">{Math.floor(Math.random() * 500) + 100}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">+{Math.floor(Math.random() * 20) + 5}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-4">
                <Star size={20} className="text-white fill-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 leading-tight">MediQuick Premium Membership</h3>
              <p className="text-xs text-blue-100 mb-6 opacity-80 leading-relaxed">Get unlimited free home deliveries and 15% instant discount on all orders.</p>
              <button className="w-full py-3 bg-white text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition-all uppercase tracking-wide">
                Join Now • $9.99/mo
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          </div>

          {/* Latest News / Tips */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Health Awareness</h3>
            </div>
            {[
              "Why seasonal flu vaccines are important this year.",
              "Top 5 habits for better heart health.",
              "Understanding your blood sugar levels.",
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded bg-slate-50 flex-none flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">0{i+1}</div>
                <div className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 leading-tight pt-1">{tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
