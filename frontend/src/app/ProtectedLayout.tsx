import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../features/auth/context/AuthContext';

const ProtectedLayout = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Rendered inside the shell's content region (.app-outlet handles spacing).
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 text-sm text-(--color-modal-label)"
      >
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-brand) motion-reduce:animate-none"
        />
        {t('layout.loading')}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
