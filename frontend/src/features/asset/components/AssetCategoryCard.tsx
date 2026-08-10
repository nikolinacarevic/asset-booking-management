// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  CATEGORY_ICON_DEFAULT_SRC,
  getCategoryIconSrc,
} from '../../asset-category/utils/categoryIcon';

export type AssetCategoryCardProps = {
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showBackgroundImage?: boolean;
  'data-testid'?: string;
};

export const AssetCategoryCard: React.FC<AssetCategoryCardProps> = ({
  title,
  isSelected = false,
  onClick,
  className,
  showBackgroundImage = true,
  'data-testid': dataTestId,
}) => {
  const { t } = useTranslation();
  const isPlainCard = !showBackgroundImage;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      data-testid={dataTestId ?? `category-card-${title.toLowerCase()}`}
      className={twMerge(
        'group relative min-h-28 cursor-pointer overflow-hidden rounded-2xl text-left transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft) focus-visible:outline-none',
        isSelected
          ? 'bg-white shadow-md ring-2 ring-(--color-ink) ring-offset-2 ring-offset-(--color-bg) dark:bg-(--color-table-surface) dark:ring-(--color-primaryblue-soft) dark:ring-offset-(--color-bg)'
          : 'bg-white shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] hover:-translate-y-0.5 hover:shadow-md hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_75%,transparent)] dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)]',
        className
      )}
    >
      <div className="relative flex h-full min-h-28">
        {showBackgroundImage && (
          <div className="relative w-[48%] shrink-0 overflow-hidden sm:w-1/2">
            <img
              src={getCategoryIconSrc(title)}
              alt=""
              className={twMerge(
                'h-full w-full object-cover transition duration-200',
                isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
              )}
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                img.src = CATEGORY_ICON_DEFAULT_SRC;
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent to-white/40 dark:to-(--color-table-surface)/50" />
          </div>
        )}

        <div
          className={twMerge(
            'relative z-10 flex flex-1 flex-col justify-between gap-3 p-4',
            isPlainCard && 'items-start'
          )}
        >
          <span
            className={twMerge(
              'text-[10px] font-semibold tracking-[0.18em] uppercase',
              isPlainCard
                ? 'text-(--color-ink)/70'
                : 'text-(--color-ink)/60'
            )}
          >
            {t('assets.categoryCard.badge')}
          </span>

          <span
            className={twMerge(
              'block text-base font-bold tracking-tight',
              isSelected
                ? 'text-(--color-ink)'
                : 'text-(--color-ink) dark:text-white'
            )}
          >
            {title}
          </span>
        </div>
      </div>
    </button>
  );
};
