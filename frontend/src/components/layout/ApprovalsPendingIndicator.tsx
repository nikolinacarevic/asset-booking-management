import { useTranslation } from 'react-i18next';

import { useAuth } from '../../features/auth/context/AuthContext';
import { usePendingBookings } from '../../features/booking/hooks/usePendingBookings';
import { isManager } from '../../features/user/utils/users';

const MAX_DISPLAY_COUNT = 9;

export function ApprovalsPendingIndicator() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const canFetch = !isLoading && user != null && isManager(user);
  const { bookings } = usePendingBookings(user, canFetch);

  if (!canFetch || bookings.length === 0) {
    return null;
  }

  const count = bookings.length;
  const label =
    count > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : String(count);

  return (
    <span
      className="ml-2 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-semibold tracking-normal text-white"
      aria-label={t('layout.navbar.pendingApprovals', { count })}
    >
      {label}
    </span>
  );
}
