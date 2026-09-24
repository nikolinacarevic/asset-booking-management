// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
// Components
import { AssetCategoryCard } from './AssetCategoryCard';

export type AssetCategoryGridProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  allCategory?: {
    label: string;
    value: string;
  };
};

export const AssetCategoryGrid: React.FC<AssetCategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  allCategory,
}) => {
  const { t } = useTranslation();

  return (
    // Mobile: a compact, horizontally scrollable strip so the selector doesn't
    // push the page content below the fold. sm+: the regular grid.
    <div
      role="group"
      aria-label={t('assets.categoryCard.badge')}
      className="-mx-4 flex w-auto snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 sm:mx-0 sm:grid sm:w-full sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&>*]:w-44 [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-auto"
    >
      {allCategory && (
        <AssetCategoryCard
          title={allCategory.label}
          isSelected={selectedCategory === allCategory.value}
          onClick={() => onSelectCategory(allCategory.value)}
          showBackgroundImage={false}
          data-testid="asset-category-card-all"
        />
      )}
      {categories.map((category) => (
        <AssetCategoryCard
          key={category}
          title={category}
          isSelected={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
          data-testid={`category-card-${category.toLowerCase()}`}
        />
      ))}
    </div>
  );
};
