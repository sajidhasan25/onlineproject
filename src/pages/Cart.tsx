import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pill, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const rxInCart = items.some(item => item.prescriptionRequired);

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-emerald-600 mb-6 border border-emerald-50">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 font-medium">Looking for some medicines?</p>
        <Link
          to="/"
          className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          Explore Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shopping Cart ({totalItems})</h1>
              <Link to="/" className="text-emerald-600 font-bold text-sm hover:underline">Add more items</Link>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-8 group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Pill className="text-gray-300" size={32} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <span className="font-black text-emerald-600 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                      <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">{item.category}</span>
                      <span className="text-sm text-gray-400 font-medium">${item.price}/unit</span>
                      {item.prescriptionRequired && (
                        <span className="text-[10px] bg-red-50 text-red-600 font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Rx Required</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping Fee</span>
                  <span className="uppercase text-emerald-600 text-sm font-black tracking-widest">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight">${totalPrice.toFixed(2)}</span>
              </div>

              {rxInCart && (
                <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <ShieldAlert className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Some items in your cart require a valid prescription. You will need to upload it during checkout.
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 group"
              >
                Proceed to Checkout
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center mt-6 text-gray-400 text-xs font-medium">
                Secure 256-bit SSL encrypted payment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
