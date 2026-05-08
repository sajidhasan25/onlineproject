import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { Pill, ShoppingCart, User, LogOut, Menu, X, ClipboardList, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, userData, isAdmin, isPharmacist } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Pill className="text-emerald-600 w-8 h-8" />
              <span className="font-bold text-xl tracking-tight text-gray-900">MediQuick</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors">Medicines</Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">About</Link>
            
            {user ? (
              <>
                <Link to="/cart" className="relative group">
                  <ShoppingCart className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
                </Link>
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                      <Shield size={20} />
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
                    <User size={20} />
                    <span className="text-sm font-medium">{userData?.name || 'Profile'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium">Login</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all font-medium">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-900 text-center py-2">Medicines</Link>
              {user ? (
                <>
                  <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-center py-2">Cart</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-center py-2">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-center py-2 text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center py-2">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center bg-emerald-600 text-white py-2 rounded-lg">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
