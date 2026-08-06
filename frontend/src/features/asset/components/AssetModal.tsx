// External packages
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

// Components
import { IconButton } from '../../../components/ui/IconButton';
import { Modal } from '../../../components/ui/Modal';
import type { AssetDto } from '../types';
import { AssetStatusBadge } from './AssetStatusBadge';

export type AssetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetDto | null;
};

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !asset) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      testId="asset-view-modal"
      backdropTestId="asset-view-modal-backdrop"
      ariaLabel={t('assets.modals.view.aria')}
      title={
        <h2 className="text-xl font-bold text-[#000d4d] dark:text-[#4d8ad4]">
          {asset.name}
        </h2>
      }
      headerRight={
        <IconButton
          data-testid="asset-details-close-button"
          onClick={onClose}
          aria-label={t('assets.modals.close')}
        >
          <CloseIcon className="pointer-events-none" />
        </IconButton>
      }
    >
      <div className="flex flex-col gap-5">
        <AssetStatusBadge status={asset.status} />
        <div>
          <p
            data-testid="asset-category"
            className="text-sm text-(--color-modal-label)"
          >
            {t('assets.modals.view.category')}
          </p>
          <p className="font-medium text-(--color-text)">
            {asset.categoryName ?? '?'}
          </p>
        </div>
        <div>
          <p
            data-testid="asset-name"
            className="text-sm text-(--color-modal-label)"
          >
            {t('assets.modals.fields.name')}
          </p>
          <p className="font-medium text-(--color-text)">{asset.name}</p>
        </div>
        <div>
          <p className="text-sm text-(--color-modal-label)">
            {t('assets.modals.fields.location')}
          </p>
          <p
            data-testid="asset-description"
            className="text-sm text-(--color-text)"
          >
            {asset.location ?? '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-(--color-modal-label)">
            {t('assets.modals.fields.description')}
          </p>
          <p
            data-testid="asset-description"
            className="text-sm text-(--color-text)"
          >
            {asset.description ?? '-'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
