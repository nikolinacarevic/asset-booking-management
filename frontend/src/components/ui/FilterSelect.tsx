// External packages
import * as React from 'react';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { twMerge } from 'tailwind-merge';

export type FilterSelectOption = {
  value: string | number;
  label: string;
};

type FilterSelectProps = {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  'aria-label': string;
  'data-testid'?: string;
  className?: string;
  placeholder?: string;
};

export function FilterSelect({
  id,
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  className,
  placeholder,
}: Readonly<FilterSelectProps>) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const stringValue = String(value);

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

  const selectedOption = options.find(
    (option) => String(option.value) === stringValue
  );
  const displayLabel = selectedOption?.label ?? placeholder ?? '';

  return (
    <div ref={rootRef} className={twMerge('relative w-full sm:w-40', className)}>
      <button
        type="button"
        id={id}
        data-testid={dataTestId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={twMerge(
          'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all outline-none',
          'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
          'focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft)',
          'dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
          open && 'ring-2 ring-(--color-primaryblue-soft)'
        )}
      >
        <span
          className={twMerge(
            'truncate',
            stringValue
              ? 'text-(--color-ink)'
              : 'text-(--color-ink)/70'
          )}
        >
          {displayLabel}
        </span>
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
          aria-labelledby={id}
          className="absolute z-30 mt-2 max-h-64 w-full min-w-44 overflow-y-auto rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)]"
        >
          {options.map((option) => {
            const optionValue = String(option.value);
            const isSelected = stringValue === optionValue;

            return (
              <li key={optionValue}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(optionValue);
                    setOpen(false);
                  }}
                  className={twMerge(
                    'flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_18%,transparent)] text-(--color-ink)'
                      : 'text-(--color-ink)/70 hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)] dark:text-(--color-ink)/70 dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
