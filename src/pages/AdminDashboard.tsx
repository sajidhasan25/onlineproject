import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Medicine, UserRole } from '../types';
import { Plus, Database, Loader2, CheckCircle, Package, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [medicine, setMedicine] = useState({
    name: '',
    category: 'Painkiller',
    price: 0,
    stock: 100,
    prescriptionRequired: false,
    description: '',
    company: '',
  });

  const categories = ['Painkiller', 'Antibiotic', 'Fever', 'Diabetes', 'Heart', 'Vitamins'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await addDoc(collection(db, 'medicines'), {
        ...medicine,
        createdAt: serverTimestamp(),
      });
      setSuccess('Medicine added successfully!');
      setMedicine({
        name: '',
        category: 'Painkiller',
        price: 0,
        stock: 100,
        prescriptionRequired: false,
        description: '',
        company: '',
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    try {
      const sampleMeds = [
        { name: 'Paracetamol 500mg', category: 'Painkiller', price: 5, stock: 500, prescriptionRequired: false, description: 'Relieves pain and reduces fever.', company: 'HealthCare Inc' },
        { name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 15, stock: 100, prescriptionRequired: true, description: 'Treats bacterial infections.', company: 'BioPharma' },
        { name: 'Insulin Glargine', category: 'Diabetes', price: 45, stock: 50, prescriptionRequired: true, description: 'Long-acting insulin for diabetes control.', company: 'Novo Nord' },
        { name: 'Vitamin C 1000mg', category: 'Vitamins', price: 10, stock: 200, prescriptionRequired: false, description: 'Boosts immune system.', company: 'ViraLife' },
        { name: 'Atorvastatin 20mg', category: 'Heart', price: 25, stock: 80, prescriptionRequired: true, description: 'Lowers cholesterol and prevents heart disease.', company: 'CardioPlus' },
      ];

      for (const med of sampleMeds) {
        await addDoc(collection(db, 'medicines'), {
          ...med,
          createdAt: serverTimestamp(),
        });
      }

      // Also ensure my user is admin for testing
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          role: UserRole.ADMIN,
        }, { merge: true });
      }

      setSuccess('Sample data seeded successfully! (You are now Admin)');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage inventory and platform data</p>
          </div>
          <button
            onClick={seedData}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all font-bold disabled:opacity-50"
          >
            <Database size={20} />
            Seed Sample Data
          </button>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 font-bold border border-emerald-100"
          >
            <CheckCircle size={24} />
            {success}
          </motion.div>
        )}

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Package size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add New Medicine</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Medicine Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border"
                value={medicine.name}
                onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <select
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border appearance-none"
                value={medicine.category}
                onChange={(e) => setMedicine({ ...medicine, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border"
                value={medicine.price}
                onChange={(e) => setMedicine({ ...medicine, price: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border"
                value={medicine.stock}
                onChange={(e) => setMedicine({ ...medicine, stock: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Company / Manufacturer</label>
              <input
                type="text"
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border"
                value={medicine.company}
                onChange={(e) => setMedicine({ ...medicine, company: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 outline-none transition-all border h-24"
                value={medicine.description}
                onChange={(e) => setMedicine({ ...medicine, description: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2 mt-2">
              <input
                type="checkbox"
                id="rxReq"
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={medicine.prescriptionRequired}
                onChange={(e) => setMedicine({ ...medicine, prescriptionRequired: e.target.checked })}
              />
              <label htmlFor="rxReq" className="text-sm font-bold text-gray-700">Prescription Required</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Plus size={20} />
                  Add Medicine to Inventory
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
