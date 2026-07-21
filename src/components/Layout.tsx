import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardPlus,
  Package,
  Users,
  Calculator,
  Download,
  Menu,
  X,
  Hammer,
  Bell,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/orders/new', label: 'أوردر جديد', icon: ClipboardPlus },
  { to: '/orders', label: 'الأوردرات', icon: Package },
  { to: '/clients', label: 'العملاء', icon: Users },
  { to: '/costs', label: 'التكاليف', icon: Calculator },
  { to: '/export', label: 'تصدير', icon: Download },
];

const pageTitles: Record<string, string> = {
  '/': 'لوحة التحكم',
  '/orders/new': 'أوردر جديد',
  '/orders': 'الأوردرات',
  '/clients': 'العملاء',
  '/costs': 'التكاليف والأسعار',
  '/export': 'تصدير البيانات',
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-safety-bright to-safety-dim shadow-[0_2px_0_#B45309,0_4px_14px_rgba(245,158,11,0.35)]">
        <Hammer className="h-5 w-5 text-steel-950" strokeWidth={2.5} />
        <span className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-steel-950 ring-2 ring-safety" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-xl font-extrabold tracking-wide text-white">
            PRISM<span className="text-safety">OPS</span>
          </div>
          <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.18em] text-steel-400">
            ورشة · تصنيع · حديد
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(path)
    )?.[1] || 'PRISMOPS';

  const isClientDetail = location.pathname.startsWith('/clients/');

  return (
    <div className="flex min-h-screen bg-steel-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col border-l border-steel-700 bg-steel-900/95 backdrop-blur-sm lg:flex">
        <div className="border-b border-steel-700 px-5 py-5">
          <Logo />
        </div>

        <div className="hazard-stripe h-1.5 w-full opacity-80" />

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <div className="mb-2 px-3 font-mono text-[10px] font-bold tracking-[0.2em] text-steel-500">
            القائمة الرئيسية
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn('nav-item', isActive && 'active')}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-steel-700 p-4">
          <div className="rounded-xl border border-steel-700 bg-steel-850 p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-xs font-semibold text-steel-300">الورشة متصلة</span>
            </div>
            <div className="font-mono text-[11px] text-steel-500">وردية صباحية · 08:00</div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-steel-500">
            <Settings className="h-4 w-4" />
            <span className="text-xs">الإصدار 1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col border-l border-steel-700 bg-steel-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-steel-700 px-4 py-4">
              <Logo />
              <button className="btn btn-ghost btn-icon" onClick={() => setOpen(false)} aria-label="إغلاق">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="hazard-stripe h-1.5 w-full" />
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn('nav-item', isActive && 'active')}
                >
                  <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-h-screen w-full flex-col lg:pr-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-steel-700 bg-steel-950/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="btn btn-secondary btn-icon lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="القائمة"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="lg:hidden">
                <Logo compact />
              </div>
              <div className="hidden lg:block">
                <h1 className="font-display text-lg font-bold text-white">
                  {isClientDetail ? 'تفاصيل العميل' : title}
                </h1>
                <p className="font-mono text-[11px] text-steel-500">نظام إدارة ورشة التصنيع</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-secondary btn-icon relative" aria-label="التنبيهات">
                <Bell className="h-5 w-5 text-safety" />
                <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger font-mono text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              <div className="hidden items-center gap-2 rounded-xl border border-steel-700 bg-steel-850 px-3 py-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-safety/20 font-display text-sm font-bold text-safety">
                  أ
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-steel-100">م. أحمد حسن</div>
                  <div className="font-mono text-[10px] text-steel-500">مدير الورشة</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hazard-stripe h-1 w-full opacity-60" />
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-steel-700 bg-steel-900/95 backdrop-blur-md lg:hidden">
          <div className="grid grid-cols-5 gap-0.5 px-1 py-1.5">
            {navItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-semibold transition',
                    isActive ? 'bg-safety/15 text-safety-bright' : 'text-steel-400'
                  )
                }
              >
                <item.icon className="h-5 w-5" strokeWidth={2.2} />
                <span className="truncate">{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
