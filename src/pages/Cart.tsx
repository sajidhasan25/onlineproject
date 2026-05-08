import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pill, ShieldAlert, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const rxInCart = items.some(item => item.prescriptionRequired);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-8 rounded-2xl border border-slate-200 border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Cart Empty</h1>
        <p className="text-xs text-slate-400 mb-8 max-w-xs">Your shopping cart is currently empty. Browse our medicine catalog to add items.</p>
        <Link
          to="/"
          className="bg-slate-900 text-white px-8 py-3 rounded-lg text-xs font-bold hover:bg-blue-600 transition-all uppercase tracking-wide active:scale-95"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 flex-1">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Checkout Cart</h1>
          <p className="text-xs text-slate-400 font-medium">Verify your items and proceed to secure checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-4 group hover:border-blue-200 transition-all"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Pill className="text-slate-200" size={24} />
                  )}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-blue-600 mb-0.5">{item.category}</div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-2">
                      {item.name}
                      {item.prescriptionRequired && <span className="bg-red-50 text-red-600 text-[8px] font-black px-1 py-0.5 rounded">RX</span>}
                    </h3>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">${item.price} / UNIT</div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="text-xs font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Order Analysis</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="opacity-60">Base Subtotal ({totalItems} items)</span>
                <span className="font-black">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="opacity-60">Standard Shipping</span>
                <span className="text-emerald-400 font-black">FREE</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="opacity-60">GST / Tax Included</span>
                <span className="font-black">$0.00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end mb-8">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Total Payable</div>
                <div className="text-3xl font-black tracking-tight leading-none">${totalPrice.toFixed(2)}</div>
              </div>
              <div className="text-[10px] font-bold text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded uppercase">Savings Applied</div>
            </div>

            {rxInCart && (
              <div className="mb-8 p-3 bg-red-400/10 rounded-lg border border-red-400/20 flex gap-3">
                <ShieldAlert className="text-red-400 shrink-0" size={16} />
                <p className="text-[10px] text-red-200 font-medium leading-relaxed">
                  VALID PRESCRIPTION UPLOAD REQUIRED AT FINAL STEP.
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-[0.98] shadow-lg shadow-blue-900/40"
            >
              Checkout Now <ArrowRight size={14} />
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-3 opacity-30">
              <CreditCard size={14} />
              <div className="text-[8px] font-bold uppercase tracking-widest">TLS 1.3 SECURE ENCRYPTION</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Pharmacist Note</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
              "Please ensure your prescription matches the patient name in your profile for faster verification."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
