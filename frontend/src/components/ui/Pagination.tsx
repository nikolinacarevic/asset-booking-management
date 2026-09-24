import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

export type PaginationItem = number | 'ellipsis';

type Props = {
  page: number;
  totalPages: number;
  items: PaginationItem[];
  onPageChange: (page: number) => void;
  ariaLabel?: string;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  items,
  onPageChange,
  ariaLabel,
  className,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav
      className={twMerge('mt-5 flex w-full items-center justify-center', className)}
      aria-label={ariaLabel ?? t('ui.pagination.ariaLabel')}
    >
      <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-(--color-table-text) sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!canPrev}
          className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-3 py-1 transition-colors outline-none hover:bg-(--color-table-row-hover) focus-visible:ring-2 focus-visible:ring-(--color-brand) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">‹</span>
          <span>{t('ui.pagination.previous')}</span>
        </button>

        <div className="flex items-center gap-1">
          {items.map((item, idx) => {
            if (item === 'ellipsis') {
              const prev = items[idx - 1];
              const next = items[idx + 1];
              return (
                <span
                  key={`ellipsis-${String(prev)}-${String(next)}`}
                  className="text-(--color-table-text) select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isActive = item === page;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)',
                  isActive
                    ? 'border-(--color-brand) bg-(--color-table-row-hover) font-semibold text-(--color-brand)'
                    : 'border-transparent hover:bg-(--color-table-row-hover)',
                ].join(' ')}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!canNext}
          className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-3 py-1 transition-colors outline-none hover:bg-(--color-table-row-hover) focus-visible:ring-2 focus-visible:ring-(--color-brand) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t('ui.pagination.next')}</span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </nav>
  );
}
