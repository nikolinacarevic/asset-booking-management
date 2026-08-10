import { Button } from './Button';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';

type DeleteModalProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: T | null;
  getItemName: (item: T) => string;
  title?: string;
  description?: string;
};

export function DeleteModal<T>({
  isOpen,
  onClose,
  onConfirm,
  item,
  getItemName,
  title,
  description,
}: Readonly<DeleteModalProps<T>>) {
  const { t } = useTranslation();

  if (!isOpen || !item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel={title ?? t('ui.deleteModal.defaultTitle')}
      title={
        <h2 className="text-xl font-bold text-(--color-ink)">
          {title ?? t('ui.deleteModal.defaultTitle')}
        </h2>
      }
      footer={
        <div className="flex justify-end gap-3">
          <Button
            data-testid="cancel-delete-button"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t('ui.deleteModal.cancel')}
          </Button>

          <Button
            data-testid="confirm-delete-button"
            type="button"
            variant="danger"
            onClick={onConfirm}
          >
            {t('ui.deleteModal.confirmDelete')}
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-(--color-modal-label)">
        {description ??
          t('ui.deleteModal.defaultDescription', {
            name: getItemName(item),
          })}
      </p>
    </Modal>
  );
}
