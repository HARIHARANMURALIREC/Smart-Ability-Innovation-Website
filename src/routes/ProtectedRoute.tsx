import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

// Protects routes by requiring an authenticated user of the given role.
export default function ProtectedRoute({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={role === 'admin' ? '/admin' : '/student-login'} replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  return <>{children}</>;
}
