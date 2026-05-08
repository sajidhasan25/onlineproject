import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Using realtime listener for status updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock size={16} />;
      case OrderStatus.PROCESSING: return <Package size={16} />;
      case OrderStatus.SHIPPED: return <Truck size={16} />;
      case OrderStatus.DELIVERED: return <CheckCircle size={16} />;
      case OrderStatus.CANCELLED: return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return "bg-amber-50 text-amber-600 border-amber-100";
      case OrderStatus.PROCESSING: return "bg-blue-50 text-blue-600 border-blue-100";
      case OrderStatus.SHIPPED: return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case OrderStatus.DELIVERED: return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case OrderStatus.CANCELLED: return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
        <Package className="mx-auto text-gray-200 mb-4" size={40} />
        <p className="text-gray-500 font-medium">No orders yet. Your health journey starts here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <Hash size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                  <span className="text-sm font-mono text-gray-600">#{order.id.substring(0, 8)}</span>
                </div>
                <p className="text-lg font-black text-gray-900">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all uppercase tracking-wider",
                getStatusColor(order.status)
              )}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
              <div className="p-2 text-gray-300 group-hover:text-emerald-600 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Placed {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
            <span className="flex items-center gap-1">
              <Truck size={10} />
              {order.deliveryAddress.substring(0, 20)}...
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrderHistory;
