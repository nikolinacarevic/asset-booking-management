// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { twMerge } from 'tailwind-merge';

// Components
import { BookingStatusBadge } from './BookingStatusBadge';

// Types
import { bookingStatuses, type BookingStatus } from '../types';

type BookingStatusFilterProps = {
  value: BookingStatus | '';
  onChange: (value: BookingStatus | '') => void;
  className?: string;
};

export function BookingStatusFilter({
  value,
  onChange,
  className,
}: Readonly<BookingStatusFilterProps>) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={twMerge('relative w-full sm:w-40', className)}>
      <button
        type="button"
        id="my-bookings-status-filter"
        data-testid="my-booking-status-filter"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('myBookings.filter.status')}
        onClick={() => setOpen((prev) => !prev)}
        className={twMerge(
          'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all outline-none',
          'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
          'focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft)',
          'dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
          open && 'ring-2 ring-(--color-primaryblue-soft)'
        )}
      >
        {value ? (
          <BookingStatusBadge status={value} />
        ) : (
          <span className="truncate text-(--color-ink)/70">
            {t('myBookings.filter.allStatuses')}
          </span>
        )}
        <KeyboardArrowDownSharpIcon
          className={twMerge(
            'shrink-0 text-(--color-brand) opacity-80 transition-transform',
            open && 'rotate-180'
          )}
          sx={{ fontSize: 20 }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="my-bookings-status-filter"
          className="absolute z-30 mt-2 w-full min-w-44 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)]"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              data-testid="booking-status-option-all"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className={twMerge(
                'flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                !value
                  ? 'bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_18%,transparent)] text-(--color-ink)'
                  : 'text-(--color-ink)/70 hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)] dark:text-(--color-ink)/70 dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
              )}
            >
              {t('myBookings.filter.allStatuses')}
            </button>
          </li>

          {bookingStatuses.map((status) => (
            <li key={status}>
              <button
                type="button"
                role="option"
                aria-selected={value === status}
                data-testid={`booking-status-option-${status.toLowerCase()}`}
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={twMerge(
                  'flex w-full cursor-pointer items-center rounded-xl px-2.5 py-1.5 transition-colors',
                  value === status
                    ? 'bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_18%,transparent)]'
                    : 'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
                )}
              >
                <BookingStatusBadge status={status} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
