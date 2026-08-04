import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import RestartAltSharpIcon from '@mui/icons-material/RestartAltSharp';

import { DateInputNoMin } from '../../booking/components/DateInput';
import { FilterSelect } from '../../../components/ui/FilterSelect';

import { useUsersData } from '../../user/hooks/useUsersData';
import { useAssetsData } from '../../asset/hooks/useAssetsData';

import type { Filter } from '../types';

type Props = {
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
  onReset: () => void;
  className?: string;
  setSelectedUserName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAssetName: React.Dispatch<React.SetStateAction<string>>;
};

export default function FiltersBar({
  filters,
  setFilters,
  onReset,
  className,
  setSelectedUserName,
  setSelectedAssetName,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const update = (partial: Partial<Filter>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const { users, loading: usersLoading } = useUsersData();
  const { assets, loading: assetsLoading } = useAssetsData();

  const userOptions = React.useMemo(
    () => [
      { value: '', label: t('report.filters.allUsers') },
      ...users.map((user) => ({
        value: user.id,
        label: `${user.name} ${user.surname}`,
      })),
    ],
    [t, users]
  );

  const assetOptions = React.useMemo(
    () => [
      { value: '', label: t('report.filters.allAssets') },
      ...assets.map((asset) => ({
        value: asset.id,
        label: asset.name,
      })),
    ],
    [assets, t]
  );

  return (
    <div className={twMerge('flex w-full flex-col gap-3', className)}>
      <div className="flex w-full flex-wrap items-center gap-3">
        <DateInputNoMin
          id="fromDate"
          label=""
          placeholder={t('report.filters.fromDate')}
          value={filters.fromDate}
          onChange={(v) => update({ fromDate: v })}
          max={filters.toDate || undefined}
          className="w-full sm:w-44"
        />

        <DateInputNoMin
          id="toDate"
          label=""
          placeholder={t('report.filters.toDate')}
          value={filters.toDate}
          onChange={(v) => update({ toDate: v })}
          min={filters.fromDate || undefined}
          className="w-full sm:w-44"
        />

        <button
          type="button"
          data-testid="reset-filters-button"
          onClick={onReset}
          className="ml-auto inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm font-medium text-[#000d4d] shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all hover:cursor-pointer hover:bg-[rgba(152,197,251,0.12)] hover:ring-[rgba(152,197,251,0.7)] focus-visible:ring-2 focus-visible:ring-[#98c5fb] focus-visible:outline-none dark:bg-(--color-table-surface) dark:text-[#98c5fb] dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]"
        >
          <RestartAltSharpIcon sx={{ fontSize: 18 }} />
          <span>{t('bookings.resetFilters')}</span>
        </button>
      </div>

      <div className="flex w-full flex-wrap items-center gap-3">
        <FilterSelect
          id="report-user-filter"
          data-testid="report-user-filter"
          aria-label={t('report.filters.user')}
          value={filters.userId ?? ''}
          onChange={(value) => {
            const selected = userOptions.find(
              (option) => String(option.value) === value
            );
            update({ userId: value === '' ? null : Number(value) });
            setSelectedUserName(value === '' ? '' : (selected?.label ?? ''));
          }}
          options={userOptions}
          className="sm:w-44"
          placeholder={usersLoading ? t('report.filters.loadingUsers') : undefined}
        />

        <FilterSelect
          id="report-asset-filter"
          data-testid="report-asset-filter"
          aria-label={t('report.filters.asset')}
          value={filters.assetId ?? ''}
          onChange={(value) => {
            const selected = assetOptions.find(
              (option) => String(option.value) === value
            );
            update({ assetId: value === '' ? null : Number(value) });
            setSelectedAssetName(value === '' ? '' : (selected?.label ?? ''));
          }}
          options={assetOptions}
          className="sm:w-44"
          placeholder={assetsLoading ? t('report.filters.loadingAssets') : undefined}
        />
      </div>
    </div>
  );
}
