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
          'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all outline-none',
          'hover:bg-[rgba(152,197,251,0.08)] hover:ring-[rgba(152,197,251,0.7)]',
          'focus-visible:ring-2 focus-visible:ring-[#98c5fb]',
          'dark:bg-(--color-table-surface) dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]',
          open && 'ring-2 ring-[#98c5fb]'
        )}
      >
        {value ? (
          <BookingStatusBadge status={value} />
        ) : (
          <span className="truncate text-[#000d4d]/70 dark:text-[#98c5fb]/70">
            {t('myBookings.filter.allStatuses')}
          </span>
        )}
        <KeyboardArrowDownSharpIcon
          className={twMerge(
            'shrink-0 text-(--color-primaryblue) opacity-80 transition-transform dark:text-[#98c5fb]',
            open && 'rotate-180'
          )}
          sx={{ fontSize: 20 }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="my-bookings-status-filter"
          className="absolute z-30 mt-2 w-full min-w-44 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[rgba(152,197,251,0.45)] dark:bg-(--color-table-surface) dark:ring-[rgba(152,197,251,0.25)]"
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
                  ? 'bg-[rgba(152,197,251,0.18)] text-[#000d4d] dark:text-[#98c5fb]'
                  : 'text-[#000d4d]/70 hover:bg-[rgba(152,197,251,0.1)] dark:text-[#98c5fb]/70 dark:hover:bg-[rgba(152,197,251,0.1)]'
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
                    ? 'bg-[rgba(152,197,251,0.18)]'
                    : 'hover:bg-[rgba(152,197,251,0.1)]'
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
