import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Car, ChevronLeft, ChevronRight, LogOut, Menu, Settings, User, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Vehicles', href: '/vehicles', icon: Car },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Vehicles',
  '/users': 'Users',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  const initials = useMemo(() => {
    if (!user?.name) {
      return 'FC';
    }

    return user.name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [user?.name]);

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className={`${collapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-[padding] duration-200`}>
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-surface-950/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Button variant="ghost" className="h-9 w-9 p-0 lg:hidden" onClick={() => setMobileOpen(true)} icon={<Menu size={19} />} aria-label="Open menu" />
              <Button
                variant="ghost"
                className="hidden h-9 w-9 p-0 lg:inline-flex"
                onClick={() => setCollapsed((value) => !value)}
                icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                aria-label="Toggle sidebar"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Link to="/dashboard" className="hover:text-slate-300">
                    FleetControl
                  </Link>
                  <span>/</span>
                  <span className="truncate text-slate-300">{pageTitle}</span>
                </div>
                <h1 className="truncate text-lg font-semibold text-white">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-medium text-white">{isLoading ? 'Loading user' : user?.name ?? 'Not signed in'}</p>
                <p className="truncate text-xs text-slate-400">{user?.roles?.[0] ?? 'No role'}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-500 text-sm font-semibold text-surface-950">{initials}</div>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={logout} icon={<LogOut size={17} />}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={onMobileClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-surface-900 transition-all duration-200 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3" onClick={onMobileClose}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-500 text-surface-950">
              <Car size={22} aria-hidden="true" />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-wide text-accent-400">FleetControl</p>
                <p className="truncate text-xs text-slate-400">Fleet operations</p>
              </div>
            ) : null}
          </Link>
          <Button variant="ghost" className="h-9 w-9 p-0 lg:hidden" onClick={onMobileClose} icon={<X size={18} />} aria-label="Close menu" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex min-h-10 items-center gap-3 rounded px-3 py-2 text-sm transition ${
                    isActive ? 'bg-accent-500 text-surface-950' : 'text-slate-300 hover:bg-surface-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <NavLink to="/profile" className="flex min-h-10 items-center gap-3 rounded px-3 py-2 text-sm text-slate-300 hover:bg-surface-800 hover:text-white">
            <User size={18} aria-hidden="true" />
            {!collapsed ? <span>Account</span> : null}
          </NavLink>
        </div>
      </aside>
    </>
  );
}

