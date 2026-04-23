'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  PieChart, 
  Settings, 
  LogOut,
  Wallet,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio', href: '/portfolio', icon: PieChart },
    { label: 'Transactions', href: '/transactions', icon: ArrowUpRight },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Financial Advisor', href: '/advisor', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 bg-zinc-50/50 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-zinc-950 p-1.5 rounded-lg">
            <Wallet className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Finance.</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-white border border-border text-zinc-950 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
