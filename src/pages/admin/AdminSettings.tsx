import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, LogOut, ShieldCheck, Mail, User as UserIcon, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/admin/DashboardHeader';
import Avatar from '@/components/ui/Avatar';
import { useLocalStorage } from '@/hooks';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-gradient-to-r from-brand-600 to-accent-600' : 'bg-slate-300 dark:bg-slate-700'}`}
      aria-pressed={on}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();
  const navigate = useNavigate();
  const [notifOn, setNotifOn] = useLocalStorage('sh_notifications_enabled', true);

  if (!user || user.role !== 'admin') return <Navigate to="/admin-login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotifToggle = (v: boolean) => {
    setNotifOn(v);
    success(v ? 'Notifications enabled' : 'Notifications disabled');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader
        title="Settings"
        subtitle="Manage your admin preferences"
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Settings' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
        {/* Admin profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="mb-5 font-display text-base font-bold text-slate-900 dark:text-white">Admin Profile</h3>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar name={user.name} size="xl" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><UserIcon className="h-4 w-4 text-slate-400" /> {user.name}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><Mail className="h-4 w-4 text-slate-400" /> {user.email}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><ShieldCheck className="h-4 w-4 text-slate-400" /> Administrator</div>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card divide-y divide-slate-200/60 p-2 dark:divide-slate-800/60">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-brand-600 dark:text-brand-300" /> : <Sun className="h-5 w-5 text-brand-600 dark:text-brand-300" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Theme</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
              </div>
            </div>
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button onClick={() => setTheme('light')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${theme === 'light' ? 'bg-white text-brand-600 shadow dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500'}`}>
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
              <button onClick={() => setTheme('dark')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${theme === 'dark' ? 'bg-white text-brand-600 shadow dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500'}`}>
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
                <Bell className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive in-app activity alerts</p>
              </div>
            </div>
            <Toggle on={notifOn} onChange={handleNotifToggle} />
          </div>
        </motion.div>

        {/* Status summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-6">
          <h3 className="mb-4 font-display text-base font-bold text-slate-900 dark:text-white">System Status</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Local storage synced</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Frontend-only mode active</span>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="glass-card flex w-full items-center justify-center gap-2 p-4 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" /> Logout from Admin
        </motion.button>
        </div>
      </div>
    </div>
  );
}
