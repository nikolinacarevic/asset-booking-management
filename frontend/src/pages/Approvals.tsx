// external imports
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// components
import { LayoutColumn } from '../components/layout/Layout';
import { PageTitle, PageTitleDivider } from '../components/ui/PageTitle';
import { SearchInput } from '../components/ui/SearchBar';
import { Toast } from '../components/ui/Toast';
import { PendingApprovalsTable } from '../features/booking/components/PendingApprovalsTable';
import type { ApprovalAction } from '../features/booking/components/ApprovalActionButtons';
import { sortBySoonestStart } from '../features/booking/utils/approvalSlot';

// hooks
import { useBookingApproval } from '../features/booking/hooks/useBookingApproval';
import {
  usePendingBookings,
  invalidatePendingBookings,
} from '../features/booking/hooks/usePendingBookings';
import { useAuth } from '../features/auth/context/AuthContext';
import { filterPendingBookingsBySearch } from '../features/booking/utils/approvalFilter';
import { canAccessApprovals } from '../features/user/utils/users';

// Approvals page
export default function Approvals() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const { user, isLoading } = useAuth();
  const canFetch = !isLoading && user != null && canAccessApprovals(user);
  const { bookings, loading, error, refetch } = usePendingBookings(
    user,
    canFetch
  );
  const [search, setSearch] = useState('');

  // `loading` starts false and only flips once the fetch begins, so remember
  // that a fetch has actually started before treating an empty list as final
  // (otherwise a deep link like /approvals/42 is dropped before data arrives).
  const [hasFetched, setHasFetched] = useState(false);
  if (loading && !hasFetched) {
    setHasFetched(true);
  }

  // filtered bookings for the approvals page, soonest first so the requests
  // that need a decision first sit on top
  const filteredBookings = useMemo(
    () => sortBySoonestStart(filterPendingBookingsBySearch(bookings, search)),
    [bookings, search]
  );

  const selectedBooking = useMemo(
    () =>
      bookingId
        ? (bookings.find((booking) => String(booking.id) === bookingId) ?? null)
        : null,
    [bookings, bookingId]
  );

  useEffect(() => {
    if (bookingId && hasFetched && !loading && !isLoading && !selectedBooking) {
      navigate('/approvals', { replace: true });
    }
  }, [bookingId, hasFetched, loading, isLoading, selectedBooking, navigate]);

  // Which decision is in flight: drives the button spinner and the toast.
  const [lastAction, setLastAction] = useState<{
    id: number;
    type: ApprovalAction;
  } | null>(null);
  const lastActionRef = useRef(lastAction);

  const handleApprovalSuccess = useCallback(() => {
    const action = lastActionRef.current;
    if (action) {
      Toast.success(
        action.type === 'approve'
          ? t('approvals.toast.approved', { id: action.id })
          : t('approvals.toast.rejected', { id: action.id })
      );
    }
    invalidatePendingBookings();
    if (bookingId) {
      navigate('/approvals', { replace: true });
    }
  }, [bookingId, navigate, t]);

  const { approve, reject, processingId, actionError, clearActionError } =
    useBookingApproval(handleApprovalSuccess);

  const runAction = useCallback(
    (type: ApprovalAction, id: number) => {
      const action = { id, type };
      lastActionRef.current = action;
      setLastAction(action);
      void (type === 'approve' ? approve(id) : reject(id));
    },
    [approve, reject]
  );

  const processingAction =
    processingId != null && lastAction?.id === processingId
      ? lastAction.type
      : null;

  const handleOpenBooking = useCallback(
    (id: number | string) => {
      navigate(`/approvals/${id}`);
    },
    [navigate]
  );

  const handleCloseBooking = useCallback(() => {
    navigate('/approvals');
  }, [navigate]);

  if (!isLoading && !canAccessApprovals(user)) {
    return <Navigate to="/bookings" replace />;
  }

  const showSummary = bookings.length > 0 && !error;

  return (
    <LayoutColumn
      span={12}
      mdSpan={9}
      mdOffset={3}
      className="flex flex-col pb-10"
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <PageTitle>{t('approvals.title')}</PageTitle>
            {showSummary && (
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.summary', { count: bookings.length })}
              </p>
            )}
          </div>

          {/* search sits with the heading of the list it filters */}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('approvals.search.placeholder')}
            className="w-full md:w-80"
          />
        </div>

        <PageTitleDivider className="-mt-2" />

        {/* Errors from list actions (the details modal shows its own). */}
        {actionError && !selectedBooking && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg bg-(--color-status-inactive-bg) px-4 py-3 text-sm font-medium text-(--color-status-inactive-text)"
          >
            <span>{actionError}</span>
            {clearActionError && (
              <button
                type="button"
                onClick={clearActionError}
                className="shrink-0 cursor-pointer rounded-sm underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                {t('approvals.states.dismiss')}
              </button>
            )}
          </div>
        )}

        <PendingApprovalsTable
          bookings={filteredBookings}
          isLoading={loading || isLoading}
          error={error || null}
          selectedBooking={selectedBooking}
          onOpenBooking={handleOpenBooking}
          onCloseBooking={handleCloseBooking}
          onApprove={(id) => runAction('approve', id)}
          onReject={(id) => runAction('reject', id)}
          processingId={processingId}
          processingAction={processingAction}
          actionError={actionError || null}
          totalCount={bookings.length}
          searchQuery={search}
          onClearSearch={() => setSearch('')}
          onRetry={() => void refetch?.()}
        />
      </div>
    </LayoutColumn>
  );
}
