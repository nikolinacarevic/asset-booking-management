// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp';

// Components
import { LayoutColumn } from '../components/layout/Layout';
import { PageTitle, PageTitleDivider } from '../components/ui/PageTitle';
import { FiltersBar } from '../features/booking/components/FilterBar';
import { AssetCategoryGrid } from '../features/asset/components/AssetCategoryGrid';
import { BookingTable } from '../features/booking/components/BookingTable';
import { ParkingMap } from '../features/booking/components/ParkingMap';
import { OfficeMap } from '../features/booking/components/OfficeMap';
import { useBookingData } from '../features/booking/hooks/useBookingData';

// Types
import type { Filters } from '../features/booking/types';

const defaultFilters: Filters = {
  search: '',
  fromDate: '',
  toDate: '',
  fromHour: '',
  toHour: '',
  selectedWeekdays: [],
};

export default function Bookings() {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<Filters>(defaultFilters);

  const {
    assets,
    categories,
    selectedCategory,
    bookings,
    selectCategoryByName,
    loading,
    refetchBookings,
  } = useBookingData({ filters });

  const variant = (selectedCategory?.bookingPeriod ?? 'HOUR') as 'HOUR' | 'DAY';

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <LayoutColumn
      span={12}
      mdSpan={9}
      mdOffset={3}
      className="flex flex-col pt-35"
    >
      <AssetCategoryGrid
        categories={categories.map((c) => c.name)}
        selectedCategory={selectedCategory?.name ?? ''}
        onSelectCategory={selectCategoryByName}
      />

      <div className="mt-12 flex w-full items-center justify-between gap-4">
        <PageTitle>{selectedCategory?.name ?? ''}</PageTitle>

        <div className="flex items-center gap-3">
          {selectedCategory?.name === 'Parking' && (
            <ParkingMap
              bookings={bookings}
              assets={assets}
              filters={filters}
              refetchBookings={refetchBookings}
              setFilters={setFilters}
            />
          )}
          {selectedCategory?.name === 'Meeting room' && <OfficeMap />}
          <button
            type="button"
            data-testid="reset-filters-button"
            onClick={handleResetFilters}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm font-medium text-(--color-ink) shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_12%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)] focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft) focus-visible:outline-none dark:bg-(--color-table-surface) dark:text-(--color-ink) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]"
          >
            <RestartAltSharpIcon sx={{ fontSize: 18 }} />
            <span>{t('bookings.resetFilters')}</span>
          </button>
        </div>
      </div>

      <PageTitleDivider className="mt-6" />
      <FiltersBar filters={filters} setFilters={setFilters} variant={variant} />

      {loading ? (
        <div className="mt-6">{t('bookings.loading')}</div>
      ) : (
        <BookingTable
          assets={assets}
          requiresApproval={selectedCategory?.approval}
          className="mt-6"
        />
      )}
    </LayoutColumn>
  );
}
