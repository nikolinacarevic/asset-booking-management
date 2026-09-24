import { useTranslation } from 'react-i18next';

import { useAuth } from '../../features/auth/context/AuthContext';
import { usePendingBookings } from '../../features/booking/hooks/usePendingBookings';
import { canAccessApprovals } from '../../features/user/utils/users';

const MAX_DISPLAY_COUNT = 9;

export function ApprovalsPendingIndicator() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const canFetch = !isLoading && user != null && canAccessApprovals(user);
  const { bookings } = usePendingBookings(user, canFetch);

  if (!canFetch || bookings.length === 0) {
    return null;
  }

  const count = bookings.length;
  const label =
    count > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : String(count);

  return (
    // role="img" gives the badge an accessible name (a plain span cannot carry
    // aria-label reliably), so the link reads "Approvals, 4 pending ...".
    <span
      role="img"
      className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-(--color-shell-accent) px-1.5 text-xs leading-none font-bold text-(--color-shell) tabular-nums"
      aria-label={t('layout.navbar.pendingApprovals', { count })}
    >
      {label}
    </span>
  );
}
