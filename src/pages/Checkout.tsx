import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, PaymentMethod } from '../types';
import { CreditCard, Truck, Upload, Loader2, CheckCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState(userData?.address || '');
  const [phone, setPhone] = useState(userData?.phoneNumber || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [prescription, setPrescription] = useState<File | null>(null);

  const rxInCart = items.some(item => item.prescriptionRequired);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let prescriptionUrl = '';
      if (prescription) {
        const storageRef = ref(storage, `prescriptions/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, prescription);
        prescriptionUrl = await getDownloadURL(storageRef);
      }

      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        totalPrice,
        status: OrderStatus.PENDING,
        paymentMethod,
        deliveryAddress: address,
        phoneNumber: phone,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add order items
      for (const item of items) {
        await addDoc(collection(db, `orders/${orderRef.id}/items`), {
          medicineId: item.id,
          medicineName: item.name,
          quantity: item.quantity,
          priceAtTime: item.price,
        });
      }

      // If prescription uploaded, link it to the order
      if (prescriptionUrl) {
        await addDoc(collection(db, 'prescriptions'), {
          userId: user.uid,
          orderId: orderRef.id,
          imageUrl: prescriptionUrl,
          status: 'pending',
          createdAt: serverTimestamp(),
        });
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/profile'), 3000);
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border border-emerald-50"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-inner">
            <CheckCircle size={56} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your order has been successfully placed and is being processed. Redirecting to your profile...
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Complete Your Order</h1>
        
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            {/* Delivery Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <Truck className="text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Delivery Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Shipping Address</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 focus:ring-0 outline-none transition-all text-gray-900 border h-32"
                    placeholder="Street name, Building, Apartment number..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-emerald-600 focus:ring-0 outline-none transition-all text-gray-900 border"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            {/* Prescription Upload */}
            {rxInCart && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                  <Upload className="text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-800">Prescription Required</h2>
                </div>
                
                <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                  You have items that require a prescription. Please upload a clear photo or PDF of your doctor's recommendation.
                </p>

                <div className="relative group">
                  <input
                    type="file"
                    required={rxInCart}
                    accept="image/*,.pdf"
                    onChange={(e) => setPrescription(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-10 border-2 border-dashed border-emerald-100 rounded-[2rem] bg-emerald-50/30 flex flex-col items-center justify-center transition-all group-hover:bg-emerald-50 group-hover:border-emerald-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                      <Upload size={32} />
                    </div>
                    {prescription ? (
                      <p className="text-emerald-700 font-bold">{prescription.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-900 font-bold mb-1">Click to upload</p>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-black">SVG, PNG, JPG or PDF</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <CreditCard className="text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: PaymentMethod.COD, name: 'Cash on Delivery', desc: 'Pay when your meds arrive' },
                  { id: PaymentMethod.MOBILE, name: 'Mobile Banking', desc: 'bKash, Nagad or Upay' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={cn(
                      "p-6 rounded-3xl border-2 text-left transition-all relative group",
                      paymentMethod === method.id
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 mb-4 flex items-center justify-center",
                      paymentMethod === method.id ? "border-emerald-600" : "border-gray-300"
                    )}>
                      {paymentMethod === method.id && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{method.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={20} className="text-emerald-600" />
                Your Package
              </h2>
              
              <div className="max-h-60 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Pill size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8 border-t border-emerald-50 pt-8">
                <span className="text-gray-900 font-bold">Total to Pay</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 grayscale opacity-50">
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
                <div className="w-12 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
