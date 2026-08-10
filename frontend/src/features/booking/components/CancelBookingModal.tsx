// external imports
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

// components
import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { Modal } from '../../../components/ui/Modal';
import { BookingStatusBadge } from './BookingStatusBadge';

// utils
import { formatBookingTime } from '../utils/bookingLogic';

// types
import type { BookingWithRelations } from '../types';

type Props = {
  booking: BookingWithRelations | null;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  actionError?: string | null;
};

export function CancelBookingModal({
  booking,
  onClose,
  onConfirm,
  isProcessing = false,
  actionError = null,
}: Props) {
  const { t } = useTranslation();

  if (!booking) return null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="sm"
      className="max-w-lg"
      ariaLabel={t('myBookings.cancelModal.ariaLabel', { id: booking.id })}
      title={
        <h2 className="text-xl font-bold text-(--color-ink)">
          {t('myBookings.cancelModal.title')}
        </h2>
      }
      headerRight={
        <IconButton
          onClick={onClose}
          aria-label={t('myBookings.cancelModal.closeAria')}
        >
          <CloseIcon className="pointer-events-none" />
        </IconButton>
      }
      footer={
        <div className="flex flex-col gap-4">
          {actionError && (
            <p
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {actionError}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              data-testid="keep-booking-button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isProcessing}
            >
              {t('myBookings.cancelModal.keepBooking')}
            </Button>
            <Button
              data-testid="confirm-cancel-booking-button"
              variant="danger"
              size="md"
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing
                ? t('myBookings.cancelModal.processing')
                : t('myBookings.cancelModal.confirmCancel')}
            </Button>
          </div>
        </div>
      }
    >
      <p className="mb-5 text-sm leading-relaxed text-(--color-modal-label)">
        {t('myBookings.cancelModal.description')}
      </p>

      <div className="space-y-3 rounded-xl border border-(--color-border) bg-(--color-surface)/50 p-4">
        <div>
          <p className="text-sm text-(--color-modal-label)">
            {t('myBookings.cancelModal.fields.asset')}
          </p>
          <p className="font-medium">{booking.asset.name}</p>
        </div>

        <div>
          <p className="text-sm text-(--color-modal-label)">
            {t('myBookings.cancelModal.fields.time')}
          </p>
          <p className="font-medium">
            {formatBookingTime(booking.bookingStart, booking.bookingEnd)}
          </p>
        </div>

        <div>
          <p className="text-sm text-(--color-modal-label)">
            {t('myBookings.cancelModal.fields.status')}
          </p>
          <BookingStatusBadge status={booking.status} />
        </div>

        {booking.notes && (
          <div>
            <p className="text-sm text-(--color-modal-label)">
              {t('myBookings.cancelModal.fields.notes')}
            </p>
            <p className="whitespace-pre-wrap">{booking.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
