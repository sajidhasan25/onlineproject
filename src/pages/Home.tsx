import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Medicine } from '../types';
import { useCart } from '../context/CartContext';
import { Search, Filter, ShoppingBag, Info, AlertCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-12 md:py-20 mb-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Your Health, Our Priority</h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Order medicines online and get them delivered to your doorstep. Safe, fast, and reliable service.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines, health products..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 shadow-xl focus:ring-2 focus:ring-emerald-400 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={18} className="text-emerald-600" />
                <h2 className="font-semibold text-gray-900">Categories</h2>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      category === cat
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Medicine Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-100">
                    <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedicines.map((med, index) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50">
                      {med.imageUrl ? (
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Pill size={48} />
                        </div>
                      )}
                      {med.prescriptionRequired && (
                        <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <AlertCircle size={10} />
                          PRESCRIPTION REQ
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">
                        {med.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1 block">{med.category}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{med.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{med.description || 'Generic healthcare product'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-xs text-gray-400 block">Price</span>
                        <span className="text-lg font-bold text-gray-900">${med.price}</span>
                      </div>
                      <button
                        onClick={() => addToCart(med)}
                        disabled={med.stock <= 0}
                        className={cn(
                          "p-3 rounded-xl transition-all shadow-sm",
                          med.stock > 0
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Info size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Medicines Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We couldn't find any medicines matching your search. Try different keywords or categories.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
