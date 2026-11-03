'use client';

import { useState } from 'react';
import Link from 'next/link';
import AllProductsAdmin from '../../../components/AllProductsAdmin';
import AdminOrdersPage from '@/components/Orders'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Bell,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
const router = useRouter();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Manage Products', icon: Package },
    { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    console.log('Logged out');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 flex flex-col md:flex-row w-full overflow-x-hidden">
      
      {/* 1. Mobile Top Navigation Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-white/10 sticky top-0 z-50 w-full">
        <Link href="/" className="text-base font-black text-white uppercase tracking-wider">
          Trendy<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Admin</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-lg bg-white/5 border border-white/10 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. Sidebar Navigation (Responsive Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-full md:h-screen w-72 md:w-64 bg-neutral-900 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Heading */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
            <Link href="/" className="text-xl font-black text-white uppercase tracking-wider">
              Trendy<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Admin</span>
            </Link>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-white border border-white/10 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Profile & Logout Footer */}
          <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Admin User</p>
                <p className="text-[10px] text-gray-400 truncate">admin@trendyworld.com</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 4. Main Panel Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0 space-y-6 overflow-y-auto ">
        
        {/* Top Header / Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-400">TrendyWorld Management System</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <button aria-label="Notifications" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 shrink-0">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Section Contents */}
        {activeTab === 'dashboard' && (
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Dashboard Overview</h2>
            <p className="text-xs text-gray-400">Connect your backend API data here.</p>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Products</h2>
              <button  onClick={() => router.push('/admin/add-product')}
               className="flex  items-center gap-1.5 px-3 py-2 rounded-xl
                bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shrink-0">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <AllProductsAdmin/>
          </div>
        )}

        {activeTab === 'orders' && (
         <AdminOrdersPage/>
        )}

        {activeTab === 'customers' && (
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Customer Base</h2>
            <p className="text-xs text-gray-400">View registered customer accounts here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1">Settings</h2>
            <p className="text-xs text-gray-400">Manage store settings here.</p>
          </div>
        )}

      </main>
    </div>
  );
}