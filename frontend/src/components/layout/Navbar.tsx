// External packages
import { useEffect, useState } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import MonitorSharpIcon from '@mui/icons-material/MonitorSharp';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import DnsSharpIcon from '@mui/icons-material/DnsSharp';
import AssessmentSharpIcon from '@mui/icons-material/AssessmentSharp';
import HowToRegSharpIcon from '@mui/icons-material/HowToRegSharp';
import EventNoteSharpIcon from '@mui/icons-material/EventNoteSharp';
import { AccountCircleSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Components
import { ApprovalsPendingIndicator } from './ApprovalsPendingIndicator';
import { LayoutColumn } from './Layout';

// Types
import type { UserDto } from '../../features/user/types';

// API
import { useAuth } from '../../features/auth/context/AuthContext';
import { getUserById } from '../../features/user/api/users';
import { getFullName, isAdmin, isEmployee, canAccessApprovals } from '../../features/user/utils/users';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pathname } = useLocation();

  const [userDto, setUserDto] = useState<UserDto | undefined>();

  useEffect(() => {
    if (!user) return;

    getUserById(user.id).then(setUserDto).catch(console.error);
  }, [user]);

  const isAssetBookingRoute =
    matchPath('/assets/:assetId/bookings', pathname) != null;

  const isItemActive = (to: string, isActive: boolean) => {
    if (to === '/bookings') {
      return isActive || isAssetBookingRoute;
    }
    return isActive;
  };

  const navItems = [
    ...(user && !isEmployee(user)
      ? [
          { to: '/assets', label: t('layout.navbar.assets'), icon: MonitorSharpIcon },
          {
            to: '/categories',
            label: t('layout.navbar.categories'),
            icon: DnsSharpIcon,
          },
        ]
      : []),
    {
      to: '/bookings',
      label: t('layout.navbar.bookings'),
      icon: CalendarTodaySharpIcon,
    },
    {
      to: '/my-bookings',
      label: isAdmin(user)
        ? t('layout.navbar.allBookings')
        : t('layout.navbar.myBookings'),
      icon: EventNoteSharpIcon,
    },
    ...(isAdmin(user)
      ? [
          {
            to: '/users',
            label: t('layout.navbar.users'),
            icon: PeopleSharpIcon,
          },
        ]
      : []),
    {
      to: '/report',
      label: t('layout.navbar.report'),
      icon: AssessmentSharpIcon,
    },
    ...(canAccessApprovals(user)
      ? [
          {
            to: '/approvals',
            label: t('layout.navbar.approvals'),
            icon: HowToRegSharpIcon,
          },
        ]
      : []),
  ];
  //TODO hover, new tab
  const linkBase =
    'mx-3 flex w-[calc(100%-1.5rem)] cursor-pointer items-center gap-3 rounded-r-lg border-l-4 px-3.5 py-3 text-base leading-snug tracking-normal transition-colors duration-150 md:text-lg lg:text-xl';

  const activeStyle =
    'border-(--color-primaryblue) bg-(--color-bg) text-black dark:bg-bg-dark dark:text-white';

  const inactiveStyle =
    'border-transparent text-black hover:bg-(--color-surface-hover) dark:text-white';

  const getLinkClass = (isActive: boolean) =>
    `${linkBase} ${isActive ? activeStyle : inactiveStyle}`;

  return (
    <LayoutColumn
      mdSpan={3}
      className="text-text-light fixed left-0 z-20 hidden h-screen min-h-screen w-full flex-col border-r border-(--color-border) bg-(--color-surface) pt-20 pb-6 shadow-md md:flex md:w-50 md:max-w-75 dark:text-white dark:shadow-black/20"
    >
      <nav className="flex h-full w-full flex-col overflow-y-auto overscroll-contain px-0 pt-8">
        <div className="flex w-full shrink-0 flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/assets'}
              className={({ isActive }) =>
                getLinkClass(isItemActive(to, isActive))
              }
            >
              <Icon className="shrink-0 opacity-80" fontSize="small" />
              <span className="flex min-w-0 flex-1 items-center font-medium">
                {label}
                {to === '/approvals' && <ApprovalsPendingIndicator />}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto flex w-full shrink-0 flex-col gap-2 border-t border-(--color-border) pt-4">
          <NavLink
            to="/account-info"
            className={({ isActive }) => getLinkClass(isActive)}
          >
            <AccountCircleSharp className="shrink-0 opacity-80" sx={{ fontSize: 24 }} />
            {user ? (
              <div className="flex min-w-0 flex-col leading-tight">
                <div className="truncate font-medium tracking-normal">
                  {getFullName(user)}
                </div>
                <div className="text-xs tracking-normal text-gray-500 dark:text-gray-400">
                  {userDto?.role}
                </div>
              </div>
            ) : (
              <span className="font-medium">{t('layout.navbar.account')}</span>
            )}
          </NavLink>
          <NavLink to="/login" className={getLinkClass(false)}>
            <LogoutSharpIcon className="shrink-0 opacity-80" fontSize="small" />
            <span className="font-medium">{t('layout.navbar.logout')}</span>
          </NavLink>
        </div>
      </nav>
    </LayoutColumn>
  );
};
