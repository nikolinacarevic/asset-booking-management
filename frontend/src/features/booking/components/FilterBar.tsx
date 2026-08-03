// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

// Components
import { SearchInput } from '../../../components/ui/SearchBar';
import { DateInput } from './DateInput';
import { HourSelect } from './HourSelect';

// Types
import type { Filters } from '../types';

type Variant = 'DAY' | 'HOUR' | 'DAYS';

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showSearch?: boolean;
  variant: Variant;
  bookingLimit?: Date;
  setVisibleMonth?: React.Dispatch<React.SetStateAction<Date>>;
  className?: string;
};

export function FiltersBar({
  filters,
  setFilters,
  showSearch = true,
  variant,
  bookingLimit,
  setVisibleMonth,
  className,
}: Readonly<Props>) {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (filters.fromDate) {
      setVisibleMonth?.(new Date(`${filters.fromDate}T00:00:00`));
    }
  }, [filters.fromDate, setVisibleMonth]);

  const maxDate = bookingLimit
    ? bookingLimit.toLocaleDateString('sv-SE')
    : undefined;

  const update = (partial: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };

      if ('fromDate' in partial && !partial.toDate) {
        next.selectedWeekdays = [];
      }

      if ('fromDate' in partial && next.fromDate > next.toDate) {
        next.toDate = next.fromDate;
      }

      if ('toDate' in partial && next.toDate < next.fromDate) {
        next.fromDate = next.toDate;
        next.selectedWeekdays = [];
      }

      if ('toDate' in partial && !next.fromDate) {
        next.fromDate = next.toDate;
        next.selectedWeekdays = [];
      }

      if (next.fromHour && next.toHour && next.toHour <= next.fromHour) {
        next.toHour = '';
      }

      return next;
    });
  };

  return (
    <div
      className={twMerge(
        'mt-6 flex w-full flex-wrap items-center gap-3',
        className
      )}
    >
      {variant === 'HOUR' ? (
        <>
          <DateInput
            id="date"
            label=""
            placeholder={t('ui.filters.selectDate')}
            value={filters.fromDate}
            onChange={(v) =>
              update({
                fromDate: v,
                toDate: v,
              })
            }
            max={maxDate}
            className="w-44"
          />
          <div className="flex w-72 gap-3">
            <HourSelect
              label=""
              value={filters.fromHour}
              onChange={(v) => update({ fromHour: v })}
              selectedDate={filters.fromDate}
              className="w-1/2"
              ariaLabel={t('ui.filters.fromTime')}
            />

            <HourSelect
              label=""
              value={filters.toHour}
              onChange={(v) => update({ toHour: v })}
              selectedDate={filters.fromDate}
              minHour={filters.fromHour}
              className="w-1/2"
              ariaLabel={t('ui.filters.toTime')}
            />
          </div>
        </>
      ) : variant === 'DAY' ? (
        <DateInput
          id="date"
          label=""
          placeholder={t('ui.filters.selectDate')}
          value={filters.fromDate}
          onChange={(v) => update({ fromDate: v })}
          max={maxDate}
          className="w-44"
        />
      ) : (
        <>
          <DateInput
            id="date"
            label=""
            placeholder={t('ui.filters.fromDate')}
            value={filters.fromDate}
            testId="from-date-input"
            onChange={(v) => update({ fromDate: v })}
            max={maxDate}
            className="w-44"
          />
          <DateInput
            id="date"
            label=""
            placeholder={t('ui.filters.toDate')}
            value={filters.toDate}
            testId="to-date-input"
            onChange={(v) => update({ toDate: v })}
            max={maxDate}
            className="w-44"
          />
        </>
      )}

      {showSearch && (
        <SearchInput
          value={filters.search}
          onChange={(v) => update({ search: v })}
          placeholder={t('ui.search.assetsPlaceholder')}
          className="ml-auto w-full max-w-60 sm:w-60"
        />
      )}
    </div>
  );
}
