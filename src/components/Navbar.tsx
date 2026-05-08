import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { Pill, ShoppingCart, User, LogOut, Menu, X, Shield, LayoutDashboard, Database, Info, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const { user, userData, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Medicines', path: '/', icon: LayoutDashboard },
    { label: 'My Profile', path: '/profile', icon: User, protected: true },
    { label: 'Cart', path: '/cart', icon: ShoppingCart, protected: true },
    { label: 'About Us', path: '/about', icon: Info },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: Shield, protected: true });
  }

  const NavLink = (props: any) => {
    const { item } = props;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive 
            ? "bg-blue-50 text-blue-700 font-bold" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[60] bg-white p-2 rounded-lg shadow-md border border-slate-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            <Pill size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">MediQuick</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-2 tracking-wider mt-4">Main Menu</div>
          {navItems.map((item) => (
            (!item.protected || user) && <NavLink key={item.path} item={item} />
          ))}

          {!user && (
            <div className="pt-4 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-2 tracking-wider">Account</div>
              <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="flex items-center gap-3 px-3 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
                Register
              </Link>
            </div>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-100 mb-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <div className="text-xs opacity-60 mb-1">Pharmacist Support</div>
            <div className="text-sm font-semibold mb-3">Live Consultation</div>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide transition-all active:scale-95">
              Start Chat
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
