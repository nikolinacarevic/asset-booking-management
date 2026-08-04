// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { twMerge } from 'tailwind-merge';

type AssetOption = {
  id: number;
  name: string;
};

type BookingAssetFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: AssetOption[];
  className?: string;
};

export function BookingAssetFilter({
  value,
  onChange,
  options,
  className,
}: Readonly<BookingAssetFilterProps>) {
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

  const selectedAsset = options.find((asset) => String(asset.id) === value);

  return (
    <div ref={rootRef} className={twMerge('relative w-full sm:w-40', className)}>
      <button
        type="button"
        id="my-bookings-asset-filter"
        data-testid="my-booking-asset-filter"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('myBookings.filter.asset')}
        onClick={() => setOpen((prev) => !prev)}
        className={twMerge(
          'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all outline-none',
          'hover:bg-[rgba(152,197,251,0.08)] hover:ring-[rgba(152,197,251,0.7)]',
          'focus-visible:ring-2 focus-visible:ring-[#98c5fb]',
          'dark:bg-(--color-table-surface) dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]',
          open && 'ring-2 ring-[#98c5fb]'
        )}
      >
        <span
          className={twMerge(
            'truncate',
            selectedAsset
              ? 'text-[#000d4d] dark:text-[#98c5fb]'
              : 'text-[#000d4d]/70 dark:text-[#98c5fb]/70'
          )}
        >
          {selectedAsset?.name ?? t('myBookings.filter.allAssets')}
        </span>
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
          aria-labelledby="my-bookings-asset-filter"
          className="absolute z-30 mt-2 max-h-64 w-full min-w-44 overflow-y-auto rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[rgba(152,197,251,0.45)] dark:bg-(--color-table-surface) dark:ring-[rgba(152,197,251,0.25)]"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              data-testid="booking-asset-option-all"
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
              {t('myBookings.filter.allAssets')}
            </button>
          </li>

          {options.map((asset) => {
            const optionValue = String(asset.id);
            const isSelected = value === optionValue;

            return (
              <li key={asset.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-testid={`booking-asset-option-${asset.id}`}
                  onClick={() => {
                    onChange(optionValue);
                    setOpen(false);
                  }}
                  className={twMerge(
                    'flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-[rgba(152,197,251,0.18)] text-[#000d4d] dark:text-[#98c5fb]'
                      : 'text-[#000d4d] hover:bg-[rgba(152,197,251,0.1)] dark:text-[#98c5fb] dark:hover:bg-[rgba(152,197,251,0.1)]'
                  )}
                >
                  {asset.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
