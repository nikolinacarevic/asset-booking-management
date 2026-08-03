// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import AccessTimeSharpIcon from '@mui/icons-material/AccessTimeSharp';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedDate: string;
  minHour?: string;
  className?: string;
  ariaLabel?: string;
};

export const hourOptions = Array.from(
  { length: 17 },
  (_, index) => `${String(index + 6).padStart(2, '0')}:00`
);

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const HourSelect: React.FC<Props> = ({
  label,
  value,
  onChange,
  selectedDate,
  minHour,
  className,
  ariaLabel,
}) => {
  const { t } = useTranslation();

  const today = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  const availableHours = hourOptions.filter((hour) => {
    const [hh] = hour.split(':').map(Number);

    if (selectedDate === today && hh < currentHour) {
      return false;
    }

    if (minHour) {
      return toMinutes(hour) > toMinutes(minHour);
    }

    return true;
  });

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-(--color-table-text)/70 uppercase">
          {label}
        </label>
      )}

      <div className="relative">
        <AccessTimeSharpIcon
          className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-(--color-primaryblue) opacity-80 dark:text-[#98c5fb]"
          sx={{ fontSize: 20 }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${ariaLabel ?? label} ${t('ui.dateTimeInput.hourAriaSuffix')}`}
          className={twMerge(
            'h-11 w-full cursor-pointer appearance-none rounded-xl bg-white py-2 pr-3 pl-10 text-sm font-medium shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all outline-none',
            'hover:bg-[rgba(152,197,251,0.08)] hover:ring-[rgba(152,197,251,0.7)]',
            'focus-visible:ring-2 focus-visible:ring-[#98c5fb]',
            'dark:bg-(--color-table-surface) dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]',
            value
              ? 'text-[#000d4d] dark:text-[#98c5fb]'
              : 'text-(--color-table-text)/50'
          )}
        >
          <option value="" disabled hidden>
            {t('ui.dateTimeInput.selectHour')}
          </option>

          {availableHours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
