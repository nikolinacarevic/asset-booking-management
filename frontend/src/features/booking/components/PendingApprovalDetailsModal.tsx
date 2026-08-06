import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { Modal } from '../../../components/ui/Modal';
import { getFullName } from '../../user/utils/users';
import { formatBookingTime } from '../utils/bookingLogic';
import type { BookingWithRelations } from '../types';
import { ApprovalActionButtons } from './ApprovalActionButtons';

type Props = {
  booking: BookingWithRelations | null;
  onClose: () => void;
  onApprove: (bookingId: number) => void;
  onReject: (bookingId: number) => void;
  processingId?: number | null;
  actionError?: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  APPROVED: '#22c55e',
  PENDING: '#f59e0b',
  REJECTED: '#ef4444',
  CANCELLED: '#6b7280',
};

const sectionClassName =
  'rounded-xl border border-(--color-border) bg-(--color-surface)/50 p-3 sm:p-4';

const sectionTitleClassName =
  'mb-2 text-[10px] font-semibold tracking-[0.18em] text-(--color-modal-label) uppercase';

export function PendingApprovalDetailsModal({
  booking,
  onClose,
  onApprove,
  onReject,
  processingId = null,
  actionError = null,
}: Readonly<Props>) {
  const { t } = useTranslation();

  if (!booking) return null;

  const statusKey = `bookings.status.${booking.status.toLowerCase()}` as
    | 'bookings.status.pending'
    | 'bookings.status.approved'
    | 'bookings.status.rejected'
    | 'bookings.status.cancelled'
    | 'bookings.status.completed';

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="md"
      className="max-w-2xl"
      ariaLabel={t('approvals.modal.ariaLabel', { id: booking.id })}
      title={
        <h2 className="text-xl font-bold text-[#000d4d] dark:text-[#4d8ad4]">
          {t('approvals.modal.title', { id: booking.id })}
        </h2>
      }
      headerRight={
        <IconButton
          onClick={onClose}
          aria-label={t('approvals.modal.closeAria')}
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
            <Button variant="outline" size="md" onClick={onClose}>
              {t('approvals.modal.cancel')}
            </Button>
            <ApprovalActionButtons
              bookingId={Number(booking.id)}
              onApprove={onApprove}
              onReject={onReject}
              processingId={processingId}
              size="md"
              showLabels
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className={sectionClassName}>
          <h3 className={sectionTitleClassName}>
            {t('approvals.modal.sections.user')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.name')}
              </p>
              <p className="font-medium">{getFullName(booking.user)}</p>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.role')}
              </p>
              <p className="font-medium">{booking.user.role}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.email')}
              </p>
              <p className="font-medium">{booking.user.email}</p>
            </div>
          </div>
        </div>

        <div className={sectionClassName}>
          <h3 className={sectionTitleClassName}>
            {t('approvals.modal.sections.asset')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.name')}
              </p>
              <p className="font-medium">{booking.asset.name}</p>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.status')}
              </p>
              <p className="font-medium">{booking.asset.status}</p>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.category')}
              </p>
              <p className="font-medium">{booking.asset.category.name}</p>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.location')}
              </p>
              <p className="font-medium">{booking.asset.location}</p>
            </div>
            {booking.asset.description && (
              <div className="col-span-2">
                <p className="text-sm text-(--color-modal-label)">
                  {t('approvals.modal.fields.description')}
                </p>
                <p className="font-medium">{booking.asset.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className={sectionClassName}>
          <h3 className={sectionTitleClassName}>
            {t('approvals.modal.sections.booking')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.status')}
              </p>
              <span
                className="inline-flex rounded-lg px-2.5 py-1 text-sm font-medium text-white"
                style={{
                  backgroundColor: STATUS_COLORS[booking.status] ?? '#6b7280',
                }}
              >
                {t(statusKey, { defaultValue: booking.status })}
              </span>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.bookingId')}
              </p>
              <p className="font-medium">#{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-(--color-modal-label)">
                {t('approvals.modal.fields.time')}
              </p>
              <p className="font-medium">
                {formatBookingTime(booking.bookingStart, booking.bookingEnd)}
              </p>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className={sectionClassName}>
            <h3 className={sectionTitleClassName}>
              {t('approvals.modal.sections.notes')}
            </h3>
            <p className="whitespace-pre-wrap">{booking.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
