import { useTranslation } from 'react-i18next';

import { useAuth } from '../../features/auth/context/AuthContext';
import { usePendingBookings } from '../../features/booking/hooks/usePendingBookings';
import { isManager } from '../../features/user/utils/users';

export function ApprovalsPendingIndicator() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const canFetch = !isLoading && user != null && isManager(user);
  const { bookings } = usePendingBookings(user, canFetch);

  if (!canFetch || bookings.length === 0) {
    return null;
  }

  return (
    <span
      className="ml-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-red-500"
      aria-label={t('layout.navbar.pendingApprovals', { count: bookings.length })}
    />
  );
}
