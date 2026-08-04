import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type ShowDeletedFilterProps = {
  checked: boolean;
  onToggle: () => void;
  className?: string;
  labelKey?: string;
};

export function ShowDeletedFilter({
  checked,
  onToggle,
  className,
  labelKey = 'users.filters.showDeleted',
}: ShowDeletedFilterProps) {
  const { t } = useTranslation();

  return (
    <label
      data-testid="toggle-deleted"
      className={twMerge(
        'relative inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-2xl bg-white px-4 text-sm font-medium text-[#000d4d] shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all',
        'hover:bg-[rgba(152,197,251,0.08)] hover:ring-[rgba(152,197,251,0.7)]',
        'focus-within:ring-2 focus-within:ring-[#98c5fb]',
        'dark:bg-(--color-table-surface) dark:text-[#98c5fb] dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]',
        className
      )}
    >
      <input
        data-testid="toggle-deleted-assets"
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full bg-white shadow ring-1 ring-[rgba(152,197,251,0.55)] transition-colors peer-checked:bg-(--color-primaryblue) peer-checked:ring-(--color-primaryblue) peer-checked:[&>svg]:opacity-100 dark:bg-gray-950 dark:ring-[rgba(152,197,251,0.35)]"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-3 w-3 text-white opacity-0 transition-opacity"
          aria-hidden="true"
        >
          <path
            d="M16.667 5.833 8.333 14.167 3.333 9.167"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {t(labelKey as any)}
    </label>
  );
}
