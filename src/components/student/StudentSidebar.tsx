import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Lightbulb,
  Upload,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Logo from '@/components/ui/Logo';

const NAV = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/problems', label: 'Problem Statements', icon: Lightbulb },
  { to: '/student/submission', label: 'PDF Submission', icon: Upload },
  { to: '/student/team', label: 'My Team', icon: Users },
  { to: '/student/documents', label: 'Documents', icon: FileText },
];

export default function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const expanded = hovered;

  const sidebarInner = (opts: { expanded: boolean; showClose?: boolean }) => (
    <>
      <div
        className={`flex h-16 items-center border-b border-slate-200/60 px-3 dark:border-slate-800/60 ${
          opts.expanded ? 'gap-2' : 'justify-center'
        }`}
      >
        <Link
          to="/student/dashboard"
          className={`flex min-w-0 items-center gap-2 ${opts.expanded ? '' : 'justify-center'}`}
          title="Smart Ability"
        >
          <Logo size={34} className="relative -top-0.5 shrink-0" />
          {opts.expanded && (
            <span className="whitespace-nowrap font-display text-sm font-bold leading-none text-slate-900 dark:text-white">
              Smart<span className="gradient-text">Ability</span>
            </span>
          )}
        </Link>
        {opts.showClose && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              } ${opts.expanded ? '' : 'justify-center'}`
            }
            title={item.label}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {opts.expanded && <span className="truncate whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200/60 p-3 dark:border-slate-800/60">
        <div
          className={`mb-2 flex items-center gap-3 rounded-xl bg-slate-100/60 p-2 dark:bg-slate-800/60 ${
            opts.expanded ? '' : 'justify-center'
          }`}
        >
          <Avatar name={user?.name ?? 'Student'} size="sm" />
          {opts.expanded && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.isLeader ? 'Team Leader' : 'Team Member'}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 ${
            opts.expanded ? '' : 'justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {opts.expanded && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-black/90 lg:hidden">
        <Link to="/student/dashboard" className="flex items-center gap-2">
          <Logo size={34} />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop: expands in-flow so content is never covered */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-slate-200/60 bg-white/70 backdrop-blur-xl transition-[width] duration-300 ease-out dark:border-slate-800/60 dark:bg-black lg:flex ${
          expanded ? 'w-64' : 'w-20'
        }`}
      >
        {sidebarInner({ expanded })}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/60 bg-white shadow-glass-lg dark:border-slate-800/60 dark:bg-black lg:hidden"
            >
              {sidebarInner({ expanded: true, showClose: true })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
