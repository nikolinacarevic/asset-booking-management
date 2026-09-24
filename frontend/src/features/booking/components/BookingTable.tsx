// External packages
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

// Components
import { Table, type TableColumn } from '../../../components/ui/Table';

// Types
import { type AssetDto } from '../../asset/types';

type Props = {
  assets: AssetDto[];
  requiresApproval?: boolean;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

export function BookingTable({
  assets,
  requiresApproval,
  isLoading,
  error,
  className,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: TableColumn<AssetDto>[] = useMemo(
    () => [
      {
        key: 'id',
        header: t('assets.table.id'),
        accessor: 'id',
        cellClassName: 'font-medium',
      },
      {
        key: 'name',
        header: t('assets.table.assetName'),
        accessor: 'name',
      },
      {
        key: 'approval',
        header: t('bookings.table.approval'),
        render: () => {
          if (requiresApproval == null) {
            return '-';
          }

          return (
            <span
              className={[
                'inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium',
                requiresApproval
                  ? 'bg-(--color-status-damaged-bg) text-(--color-status-damaged-text)'
                  : 'bg-(--color-status-active-bg) text-(--color-status-active-text)',
              ].join(' ')}
            >
              {requiresApproval
                ? t('bookings.table.approvalYes')
                : t('bookings.table.approvalNo')}
            </span>
          );
        },
      },
      {
        key: 'book',
        header: (
          <span className="sr-only">{t('bookings.table.bookSr')}</span>
        ),
        headerClassName: 'w-px whitespace-nowrap',
        cellClassName: 'w-px whitespace-nowrap',
        render: (asset) => (
          // Single interactive element (no <button> nested inside <a>),
          // styled to match the solid small Button.
          <Link
            data-testid="book-button"
            to={`/assets/${asset.id}/bookings`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--color-primaryblue) bg-(--color-primaryblue) px-4 py-3 leading-none text-white transition-colors outline-none hover:border-(--color-secondaryblue) hover:bg-(--color-secondaryblue) focus-visible:ring-2 focus-visible:ring-(--color-brand) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg)"
          >
            {t('bookings.table.book')}
          </Link>
        ),
      },
    ],
    [requiresApproval, t]
  );

  return (
    <Table
      data={assets}
      columns={columns}
      getRowKey={(asset) => asset.id}
      className={`w-full ${className}`}
      mobileCards
      onRowClick={(asset) => navigate(`/assets/${asset.id}/bookings`)}
      emptyMessage={
        isLoading
          ? t('bookings.empty.loading')
          : error
            ? error
            : t('bookings.empty.noAssets')
      }
    />
  );
}
