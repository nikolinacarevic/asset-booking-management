// external imports
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

// components
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

// utils
import { getFullName } from '../../user/utils/users';

// types
import type { BookingWithRelations } from '../types';

type Props = {
  booking: BookingWithRelations | null;
  onCancel: () => void;
  onConfirm: (bookingId: number) => void;
};

/**
 * Confirmation step for rejecting a request. Rejection cannot be undone, so
 * it gets an explicit, destructive-styled confirm; the safe choice ("Keep
 * pending") comes first and receives initial focus.
 */
export function RejectBookingDialog({
  booking,
  onCancel,
  onConfirm,
}: Readonly<Props>) {
  const { t } = useTranslation();

  if (!booking) return null;

  const bookingId = Number(booking.id);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      size="sm"
      ariaLabel={t('approvals.rejectDialog.title', { id: booking.id })}
      testId="reject-booking-dialog"
      title={
        <h2 className="text-lg font-bold text-(--color-ink)">
          {t('approvals.rejectDialog.title', { id: booking.id })}
        </h2>
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={onCancel}
          >
            {t('approvals.rejectDialog.cancel')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="min-h-11 border-red-700 bg-red-700 font-semibold hover:border-red-800 hover:bg-red-800"
            iconLeft={<CloseIcon fontSize="small" aria-hidden />}
            data-testid={`confirm-reject-booking-${bookingId}`}
            onClick={() => onConfirm(bookingId)}
          >
            {t('approvals.rejectDialog.confirm')}
          </Button>
        </div>
      }
    >
      <p className="text-[0.9375rem] leading-relaxed">
        {t('approvals.rejectDialog.body', {
          name: getFullName(booking.user),
          asset: booking.asset.name,
        })}
      </p>
    </Modal>
  );
}
