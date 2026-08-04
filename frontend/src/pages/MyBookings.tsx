// external imports
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import { LayoutColumn } from '../components/layout/Layout';
import { PageTitle, PageTitleDivider } from '../components/ui/PageTitle';
import { Pagination } from '../components/ui/Pagination';
import { SearchInput } from '../components/ui/SearchBar';
import { DateInputNoMin } from '../features/booking/components/DateInput';
import { BookingAssetFilter } from '../features/booking/components/BookingAssetFilter';
import { BookingStatusFilter } from '../features/booking/components/BookingStatusFilter';
import { MyBookingsTable } from '../features/booking/components/MyBookingsTable';

// hooks
import { useBookingCancellation } from '../features/booking/hooks/useBookingCancellation';
import { useMyBookings } from '../features/booking/hooks/useMyBookings';
import { useAuth } from '../features/auth/context/AuthContext';
import { usePagination } from '../features/user/hooks/usePagination';

// utils
import {
  filterBookingsByAsset,
  filterBookingsByDateRange,
  filterBookingsByStatus,
  filterPendingBookingsBySearch,
} from '../features/booking/utils/approvalFilter';
import type { BookingStatus } from '../features/booking/types';
import { isAdmin } from '../features/user/utils/users';

export default function MyBookings() {
  const { t } = useTranslation();
  const { user, isLoading: isUserLoading } = useAuth();
  const { bookings, loading, error, refetch } = useMyBookings(
    user,
    !isUserLoading && user != null
  );
  const { cancel, isCancelling, cancelError, clearCancelError } =
    useBookingCancellation(refetch);
  const isUserAdmin = isAdmin(user);
  const [search, setSearch] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const assetOptions = useMemo(() => {
    const assets = new Map<number, string>();

    for (const booking of bookings) {
      assets.set(booking.asset.id, booking.asset.name);
    }

    return Array.from(assets.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const assetId = selectedAssetId ? Number(selectedAssetId) : null;
    const byAsset = filterBookingsByAsset(bookings, assetId);
    const byStatus = isUserAdmin
      ? filterBookingsByStatus(byAsset, selectedStatus)
      : byAsset;
    const byDate = filterBookingsByDateRange(byStatus, fromDate, toDate);

    return filterPendingBookingsBySearch(byDate, search);
  }, [bookings, fromDate, isUserAdmin, search, selectedAssetId, selectedStatus, toDate]);

  const pagination = usePagination(filteredBookings, 10);

  useEffect(() => {
    pagination.setPage(1);
  }, [fromDate, isUserAdmin, search, selectedAssetId, selectedStatus, toDate]);

  return (
    <LayoutColumn
      span={12}
      mdSpan={9}
      mdOffset={3}
      className="flex min-h-screen flex-col pt-35 pb-10"
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <PageTitle>
            {isAdmin(user) ? t('myBookings.titleAdmin') : t('myBookings.title')}
          </PageTitle>
        </div>
        <PageTitleDivider />

        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-wrap items-center gap-3">
            <DateInputNoMin
              id="my-bookings-from-date"
              label=""
              placeholder={t('myBookings.filter.fromDate')}
              value={fromDate}
              onChange={setFromDate}
              max={toDate || undefined}
              className="w-full sm:w-44"
              testId="my-bookings-from-date"
            />
            <DateInputNoMin
              id="my-bookings-to-date"
              label=""
              placeholder={t('myBookings.filter.toDate')}
              value={toDate}
              onChange={setToDate}
              min={fromDate || undefined}
              className="w-full sm:w-44"
              testId="my-bookings-to-date"
            />

            <SearchInput
              data-testid="search-input"
              value={search}
              onChange={setSearch}
              placeholder={t('myBookings.search.placeholder')}
              className="ml-auto w-full sm:w-52"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-3">
            <BookingAssetFilter
              value={selectedAssetId}
              onChange={setSelectedAssetId}
              options={assetOptions}
            />

            {isUserAdmin && (
              <BookingStatusFilter
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
            )}
          </div>
        </div>

        <MyBookingsTable
          bookings={pagination.paged}
          isLoading={loading || isUserLoading}
          error={error}
          onCancelBooking={cancel}
          isCancelling={isCancelling}
          cancelError={cancelError}
          onClearCancelError={clearCancelError}
        />

        {filteredBookings.length > 0 && !loading && !error && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            items={pagination.items}
            onPageChange={pagination.setPage}
          />
        )}
      </div>
    </LayoutColumn>
  );
}
