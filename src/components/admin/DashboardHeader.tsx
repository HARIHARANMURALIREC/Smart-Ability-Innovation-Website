import type { ReactNode } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import NotificationPanel from '@/components/NotificationPanel';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}

export default function DashboardHeader({ title, subtitle, breadcrumbs, actions }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-black/90">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <div className="mb-2">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <NotificationPanel />
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 py-1 pl-1 pr-3 dark:border-slate-700 dark:bg-slate-800/60 sm:flex">
              <Avatar name={user?.name ?? 'User'} size="sm" />
              <div className="min-w-0 text-left">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-[10px] capitalize text-slate-500 dark:text-slate-400">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
