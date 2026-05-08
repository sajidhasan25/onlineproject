import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Sidebar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Search } from 'lucide-react';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
              {/* Header */}
              <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                <div className="relative w-full max-w-md hidden sm:block">
                  <input 
                    type="text" 
                    placeholder="Search medicine, generic name, symptoms..." 
                    className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    System Online
                  </div>
                </div>
              </header>

              {/* Main Area */}
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>

              {/* Bottom Mini Footer */}
              <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-4 md:px-8 text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-auto">
                <div className="flex gap-4 md:gap-6">
                  <span>Licensed Pharmacy #88219-B</span>
                  <span className="hidden sm:inline">Privacy Policy</span>
                </div>
                <div className="text-slate-500 italic hidden sm:block">
                  Emergency: +1 800-PHARMA-HELP
                </div>
              </footer>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
