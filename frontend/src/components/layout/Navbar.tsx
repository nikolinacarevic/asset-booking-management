// External packages
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { AccountMenu } from './AccountMenu';
import { Brand } from './Brand';
import { SidebarNav } from './SidebarNav';

// Types
import type { UserDto } from '../../features/user/types';

// API
import { useAuth } from '../../features/auth/context/AuthContext';
import { getUserById } from '../../features/user/api/users';

/**
 * Desktop navigation rail (lg and up). Owns the full viewport height so the
 * content region gets the whole width next to it; below lg the same
 * navigation lives in the MobileMenu drawer.
 */
export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userDto, setUserDto] = useState<UserDto | undefined>();

  useEffect(() => {
    if (!user) return;

    getUserById(user.id).then(setUserDto).catch(console.error);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-(--shell-rail-width) shrink-0 flex-col border-r border-(--color-shell-border) bg-(--color-shell) text-(--color-shell-text) lg:flex">
      <div className="flex h-18 shrink-0 items-center px-6">
        <Brand tone="shell" />
      </div>

      <SidebarNav className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2 pb-6" />

      <div className="shrink-0 border-t border-(--color-shell-border) p-3">
        {user ? (
          <AccountMenu
            user={user}
            role={userDto?.role ?? user.role}
            onLogout={() => void handleLogout()}
          />
        ) : (
          <span className="block px-3 py-2 text-sm text-(--color-shell-muted)">
            {t('layout.navbar.account')}
          </span>
        )}
      </div>
    </aside>
  );
};
