// External packages
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';

// Components
import { Avatar } from './AccountMenu';
import { Brand } from './Brand';
import { PreferenceControls } from './PreferenceControls';
import { SidebarNav, shellFocusRing } from './SidebarNav';

// Features
import { useAuth } from '../../features/auth/context/AuthContext';
import { getFullName } from '../../features/user/utils/users';

/** Matches the breakpoint where the desktop rail (Navbar) takes over. */
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Menu button + slide-in drawer used below the lg breakpoint. Mirrors the
 * desktop rail (same nav groups), and hosts account + preferences inline.
 */
export default function MobileMenu() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // The drawer remembers the route it was opened on, so any route change
  // (nav links, deep links like /approvals/:id, logout) closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  // Close when resizing to desktop — the trigger is hidden there but the
  // Dialog portal would stay open.
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpenedOn(null);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/login');
  };

  const roleLabel = user?.role
    ? t(`users.roles.${user.role}`, { defaultValue: user.role })
    : '';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t('layout.mobileMenu.open')}
          className="-ml-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-(--color-ink) transition-colors outline-none hover:bg-(--color-surface-hover) focus-visible:ring-2 focus-visible:ring-(--color-brand) lg:hidden"
        >
          <MenuIcon aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-(--color-modal-overlay) data-[state=closed]:animate-[fadeOut_200ms] data-[state=open]:animate-[fadeIn_200ms] motion-reduce:animate-none" />

        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,20rem)] flex-col bg-(--color-shell) text-(--color-shell-text) shadow-(--shadow-modal) outline-none data-[state=closed]:animate-[slideOut_250ms_ease-in] data-[state=open]:animate-[slideIn_250ms_ease-out] motion-reduce:animate-none"
        >
          <Dialog.Title className="sr-only">
            {t('layout.mobileMenu.title')}
          </Dialog.Title>

          <div className="flex h-16 shrink-0 items-center justify-between gap-3 pr-3 pl-5">
            <Brand tone="shell" onNavigate={close} />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t('layout.mobileMenu.close')}
                className={twMerge(
                  'inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-(--color-shell-muted) transition-colors hover:bg-(--color-shell-hover) hover:text-(--color-shell-text)',
                  shellFocusRing
                )}
              >
                <CloseIcon aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <SidebarNav className="pt-2 pb-6" onNavigate={close} />

            <div className="mt-auto flex flex-col gap-4 border-t border-(--color-shell-border) p-4">
              <Link
                to="/account-info"
                onClick={close}
                className={twMerge(
                  'flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-(--color-shell-hover)',
                  shellFocusRing
                )}
              >
                {user && <Avatar user={user} />}
                {user ? (
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-semibold text-(--color-shell-text)">
                      {getFullName(user)}
                    </span>
                    <span className="truncate text-xs text-(--color-shell-muted)">
                      {roleLabel}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm font-semibold">
                    {t('layout.navbar.account')}
                  </span>
                )}
              </Link>

              <PreferenceControls tone="shell" className="px-2" />

              <button
                type="button"
                onClick={() => void handleLogout()}
                className={twMerge(
                  'flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--color-shell-border) text-sm font-semibold text-(--color-shell-text) transition-colors hover:bg-(--color-shell-hover)',
                  shellFocusRing
                )}
              >
                <LogoutSharpIcon aria-hidden fontSize="small" />
                {t('layout.navbar.logout')}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
