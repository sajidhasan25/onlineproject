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
    imageUrl: '',
  });

  const categories = ['Painkiller', 'Antibiotic', 'Fever', 'Diabetes', 'Heart', 'Vitamins', 'Skincare', 'Surgical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await addDoc(collection(db, 'medicines'), {
        ...medicine,
        createdAt: serverTimestamp(),
      });
      setSuccess('LOG: Medicine added to central database successfully.');
      setMedicine({
        name: '',
        category: 'Painkiller',
        price: 0,
        stock: 100,
        prescriptionRequired: false,
        description: '',
        company: '',
        imageUrl: '',
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
        { name: 'Paracetamol 500mg', category: 'Painkiller', price: 5.99, stock: 500, prescriptionRequired: false, description: 'High-efficacy relief for pain and fever.', company: 'Panadol Labs', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2670&auto=format&fit=crop' },
        { name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 15.50, stock: 120, prescriptionRequired: true, description: 'Broad-spectrum bacterial treatment protocol.', company: 'Pfizer Global', imageUrl: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=2670&auto=format&fit=crop' },
        { name: 'Humalog Insulin', category: 'Diabetes', price: 89.99, stock: 45, prescriptionRequired: true, description: 'Fast-acting glucose regulation agent.', company: 'Eli Lilly', imageUrl: 'https://images.unsplash.com/photo-1550572017-ed2002b4fd87?q=80&w=2670&auto=format&fit=crop' },
        { name: 'Vitamin D3+', category: 'Vitamins', price: 22.00, stock: 300, prescriptionRequired: false, description: 'Essential immune-support supplement.', company: 'Solgar', imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=2670&auto=format&fit=crop' },
      ];

      for (const med of sampleMeds) {
        await addDoc(collection(db, 'medicines'), {
          ...med,
          createdAt: serverTimestamp(),
        });
      }

      if (user) {
       await setDoc(doc(db, "users", "PQPBq7ptgFhJ9j0eSJd3VnhX9mK2"), {
   role: "admin"
}, { merge: true });
      }

      setSuccess('SYSTEM: Sample data successfully integrated. Admin permissions enabled.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 flex-1 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Backend Operations</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Platform Management Terminal</p>
          </div>
        </div>
        <button
          onClick={seedData}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50"
        >
          <Database size={16} />
          Initialize Default Stock
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-blue-100"
        >
          <CheckCircle size={18} />
          {success}
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <Package size={16} />
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase">Input New Medicine Protocol</h2>
          </div>
          <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Phase 1: Entry</div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Identification (Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PARACETAMOL EXTRA"
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border"
                  value={medicine.name}
                  onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification (Category)</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border appearance-none"
                    value={medicine.category}
                    onChange={(e) => setMedicine({ ...medicine, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Economic Value (USD)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border"
                  value={medicine.price}
                  onChange={(e) => setMedicine({ ...medicine, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inventory Depth (Stock)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="100"
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border"
                  value={medicine.stock}
                  onChange={(e) => setMedicine({ ...medicine, stock: parseInt(e.target.value) })}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visualization URL (Image)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border"
                  value={medicine.imageUrl}
                  onChange={(e) => setMedicine({ ...medicine, imageUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manufacturer (Company)</label>
                <input
                  type="text"
                  placeholder="e.g. PHARMATECH INDUSTRIES"
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border"
                  value={medicine.company}
                  onChange={(e) => setMedicine({ ...medicine, company: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Brief (Description)</label>
                <textarea
                  placeholder="Enter medical datasheet information..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-lg border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs font-bold text-slate-900 border h-24 resize-none"
                  value={medicine.description}
                  onChange={(e) => setMedicine({ ...medicine, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="rxReq"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={medicine.prescriptionRequired}
                  onChange={(e) => setMedicine({ ...medicine, prescriptionRequired: e.target.checked })}
                />
                <label htmlFor="rxReq" className="text-[10px] font-black text-slate-700 uppercase tracking-widest cursor-pointer">Restricted Access (Prescription Required)</label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Preview</label>
              <div className="aspect-square w-full bg-slate-50 rounded-xl border border-slate-200 border-dashed flex items-center justify-center overflow-hidden">
                {medicine.imageUrl ? (
                  <img src={medicine.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <Package size={32} className="text-slate-200 mx-auto mb-2" />
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Image Preview Area</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                <ArrowLeft size={12} className="rotate-90" />
                Validation Protocol
              </h4>
              <ul className="text-[9px] text-slate-400 font-bold space-y-1 uppercase tracking-tight">
                <li>• Name must be verified</li>
                <li>• Stock cannot be negative</li>
                <li>• Image should be 1:1 aspect</li>
                <li>• System will timestamp on commit</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white h-14 rounded-lg font-bold text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                <>
                  <Plus size={16} />
                  Commit to Inventory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
