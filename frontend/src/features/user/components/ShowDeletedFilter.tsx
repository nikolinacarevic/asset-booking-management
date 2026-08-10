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
        'relative inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-2xl bg-white px-4 text-sm font-medium text-(--color-ink) shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all',
        'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
        'focus-within:ring-2 focus-within:ring-(--color-primaryblue-soft)',
        'dark:bg-(--color-table-surface) dark:text-(--color-ink) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
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
        className="grid h-4 w-4 place-items-center rounded-full bg-white shadow ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_55%,transparent)] transition-colors peer-checked:bg-(--color-primaryblue) peer-checked:ring-(--color-primaryblue) peer-checked:[&>svg]:opacity-100 dark:bg-gray-950 dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_35%,transparent)]"
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
