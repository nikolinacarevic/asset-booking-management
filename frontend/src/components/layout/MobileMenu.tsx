// External packages
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

// Components
import { ApprovalsPendingIndicator } from './ApprovalsPendingIndicator';
import { Button } from '../ui/Button';
import { Logo } from '../icons/Logo';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import {
  MonitorSharp,
  DnsSharp,
  CalendarTodaySharp,
  PeopleSharp,
  LogoutSharp,
  AccountCircleSharp,
  HowToRegSharp,
  EventNoteSharp,
} from '@mui/icons-material';

// Features
import { useAuth } from '../../features/auth/context/AuthContext';
import {
  getFullName,
  isAdmin,
  isEmployee,
  isManager,
} from '../../features/user/utils/users';

export default function MobileMenu() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const links = [
    ...(user && !isEmployee(user)
      ? [
          { to: '/assets', label: t('layout.navbar.assets'), icon: MonitorSharp },
          { to: '/categories', label: t('layout.navbar.categories'), icon: DnsSharp },
        ]
      : []),
    {
      to: '/bookings',
      label: t('layout.navbar.bookings'),
      icon: CalendarTodaySharp,
    },
    {
      to: '/my-bookings',
      label: isAdmin(user)
        ? t('layout.navbar.allBookings')
        : t('layout.navbar.myBookings'),
      icon: EventNoteSharp,
    },
    ...(isAdmin(user)
      ? [{ to: '/users', label: t('layout.navbar.users'), icon: PeopleSharp }]
      : []),
    ...(isManager(user)
      ? [
          {
            to: '/approvals',
            label: t('layout.navbar.approvals'),
            icon: HowToRegSharp,
          },
        ]
      : []),
  ];
  const navigate = useNavigate();
  const handleLogout = () => {
    document.cookie = 'auth=; Max-Age=0; path=/';
    navigate('/login');
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="group relative flex h-10 w-10 cursor-pointer items-center justify-center md:hidden">
          <span className="absolute h-0.5 w-6 -translate-y-2 bg-current transition-all duration-300 ease-in-out group-data-[state=open]:translate-y-0 group-data-[state=open]:rotate-45" />
          <span className="absolute h-0.5 w-6 bg-current opacity-100 transition-all duration-300 ease-in-out group-data-[state=open]:opacity-0" />
          <span className="absolute h-0.5 w-6 translate-y-2 bg-current transition-all duration-300 ease-in-out group-data-[state=open]:translate-y-0 group-data-[state=open]:-rotate-45" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-[fadeOut_200ms] data-[state=open]:animate-[fadeIn_200ms]" />

        <Dialog.Content className="fixed top-0 left-0 z-50 flex h-full w-[min(100vw-4rem,22rem)] flex-col bg-(--color-surface) shadow-lg data-[state=closed]:animate-[slideOut_300ms_ease-in] data-[state=open]:animate-[slideIn_300ms_ease-out]">
          <VisuallyHidden.Root>
            <Dialog.Title>{t('layout.mobileMenu.title')}</Dialog.Title>
            <Dialog.Description>
              {t('layout.mobileMenu.description')}
            </Dialog.Description>
          </VisuallyHidden.Root>

          <div className="flex h-20 w-full shrink-0 items-center justify-center border-b border-(--color-border) px-6">
            <Logo className="h-10 w-auto" />
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-3">
            {links.map(({ to, label, icon: Icon }) => (
              <Dialog.Close asChild key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-3.5 py-3 text-base font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-(--color-bg) text-black shadow-(--shadow-card) dark:bg-bg-dark dark:text-white'
                        : 'text-black hover:bg-(--color-bg)/70 dark:text-white dark:hover:bg-bg-dark/70',
                    ].join(' ')
                  }
                >
                  <Icon className="shrink-0 opacity-80" fontSize="small" />
                  <span className="flex min-w-0 flex-1 items-center">
                    {label}
                    {to === '/approvals' && <ApprovalsPendingIndicator />}
                  </span>
                </NavLink>
              </Dialog.Close>
            ))}
          </nav>
          <div className="flex w-full shrink-0 items-center justify-between px-4 py-3">
            <LanguageSwitcher variant="mobileMenu" />
            <ThemeToggle />
          </div>
          <div className="mt-auto flex w-full shrink-0 flex-col gap-2.5 border-t border-(--color-border) p-3">
            <Dialog.Close asChild>
              <NavLink
                to="/account-info"
                className="flex w-full items-center gap-3 rounded-xl bg-(--color-bg) px-3.5 py-3 text-base font-medium shadow-(--shadow-card) transition-colors dark:bg-bg-dark"
              >
                <AccountCircleSharp className="shrink-0" sx={{ fontSize: 26 }} />
                {user ? (
                  <div className="flex min-w-0 flex-col items-start leading-tight">
                    <div className="truncate">{getFullName(user)}</div>
                    <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {user.role}
                    </div>
                  </div>
                ) : (
                  t('layout.navbar.account')
                )}
              </NavLink>
            </Dialog.Close>

            <Dialog.Close asChild>
              <Button
                onClick={handleLogout}
                className="w-full rounded-xl border-none bg-red-500 hover:bg-red-600"
              >
                <LogoutSharp />
                {t('layout.navbar.logout')}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
