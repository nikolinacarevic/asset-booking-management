import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  testId?: string;
  max?: string;
  min?: string;
  ariaLabel?: string;
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

type DateFieldProps = Props & {
  enforceMinToday?: boolean;
};

function DateField({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
  testId,
  max,
  min,
  ariaLabel,
  enforceMinToday = false,
}: Readonly<DateFieldProps>) {
  const { t } = useTranslation();
  const dateRef = React.useRef<HTMLInputElement>(null);

  const resolvedMin = enforceMinToday
    ? (min ?? new Date().toISOString().split('T')[0])
    : min;

  const openDatePicker = () => {
    if (dateRef.current?.showPicker) {
      dateRef.current.showPicker();
    } else {
      dateRef.current?.focus();
    }
  };

  const clearDate = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange('');
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold tracking-wide text-(--color-table-text)/70 uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={twMerge(
            'group flex h-11 w-full items-center gap-2.5 rounded-xl bg-white px-3.5 text-sm shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all',
            'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--color-primaryblue-soft)',
            'dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
            value
              ? 'text-(--color-ink)'
              : 'text-(--color-table-text)/50'
          )}
        >
          <CalendarMonthSharpIcon
            className="pointer-events-none shrink-0 text-(--color-brand) opacity-80"
            sx={{ fontSize: 20 }}
          />
          <span className="pointer-events-none min-w-0 flex-1 truncate font-medium">
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          {value && <span className="w-6 shrink-0" aria-hidden="true" />}
        </div>

        <input
          ref={dateRef}
          id={id}
          type="date"
          data-testid={testId}
          value={value}
          min={resolvedMin}
          max={max}
          aria-label={ariaLabel ?? (label || placeholder)}
          onChange={(e) => onChange(e.target.value)}
          onClick={openDatePicker}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        {value && (
          <button
            type="button"
            onClick={clearDate}
            aria-label={t('ui.filters.clearDate')}
            className="absolute top-1/2 right-2 z-20 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-(--color-table-text)/50 transition-colors hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] hover:text-(--color-brand)"
          >
            <CloseSharpIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}

export const DateInput: React.FC<Props> = (props) => (
  <DateField {...props} enforceMinToday />
);

export const DateInputNoMin: React.FC<Props> = (props) => (
  <DateField {...props} enforceMinToday={false} />
);
