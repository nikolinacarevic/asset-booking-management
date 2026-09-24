// External packages
import { matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MonitorSharpIcon from '@mui/icons-material/MonitorSharp';
import CalendarTodaySharpIcon from '@mui/icons-material/CalendarTodaySharp';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import DnsSharpIcon from '@mui/icons-material/DnsSharp';
import AssessmentSharpIcon from '@mui/icons-material/AssessmentSharp';
import HowToRegSharpIcon from '@mui/icons-material/HowToRegSharp';
import EventNoteSharpIcon from '@mui/icons-material/EventNoteSharp';

// Features
import { useAuth } from '../../features/auth/context/AuthContext';
import {
  isAdmin,
  isEmployee,
  canAccessApprovals,
} from '../../features/user/utils/users';

export type NavItem = {
  to: string;
  label: string;
  icon: typeof MonitorSharpIcon;
  /** Match the path exactly (so /assets does not light up on /assets/:id/bookings). */
  end?: boolean;
  showPendingCount?: boolean;
};

export type NavGroup = {
  id: 'main' | 'manage';
  label?: string;
  items: NavItem[];
};

/**
 * Single source of truth for the app navigation, shared by the desktop rail
 * and the mobile drawer so the two can never drift apart.
 */
export function useNavGroups(): NavGroup[] {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return [];

  const main: NavItem[] = [
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
    {
      to: '/report',
      label: t('layout.navbar.report'),
      icon: AssessmentSharpIcon,
    },
  ];

  const manage: NavItem[] = [
    ...(canAccessApprovals(user)
      ? [
          {
            to: '/approvals',
            label: t('layout.navbar.approvals'),
            icon: HowToRegSharpIcon,
            showPendingCount: true,
          },
        ]
      : []),
    ...(isEmployee(user)
      ? []
      : [
          {
            to: '/assets',
            label: t('layout.navbar.assets'),
            icon: MonitorSharpIcon,
            end: true,
          },
          {
            to: '/categories',
            label: t('layout.navbar.categories'),
            icon: DnsSharpIcon,
          },
        ]),
    ...(isAdmin(user)
      ? [
          {
            to: '/users',
            label: t('layout.navbar.users'),
            icon: PeopleSharpIcon,
          },
        ]
      : []),
  ];

  return [
    { id: 'main', items: main },
    ...(manage.length > 0
      ? [
          {
            id: 'manage' as const,
            label: t('layout.navbar.manage'),
            items: manage,
          },
        ]
      : []),
  ];
}

/** Active-state rules for nav items, including the asset-bookings special case. */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  // /assets/:assetId/bookings is part of the booking flow, not asset admin.
  if (item.to === '/bookings') {
    return (
      matchPath({ path: '/bookings', end: false }, pathname) != null ||
      matchPath('/assets/:assetId/bookings', pathname) != null
    );
  }

  return matchPath({ path: item.to, end: item.end ?? false }, pathname) != null;
}
