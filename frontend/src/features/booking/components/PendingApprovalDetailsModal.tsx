import type { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Button } from '../../../components/ui/Button';
import { IconButton } from '../../../components/ui/IconButton';
import { Modal } from '../../../components/ui/Modal';
import { getFullName } from '../../user/utils/users';
import { formatApprovalSlot } from '../utils/approvalSlot';
import type { BookingWithRelations } from '../types';
import {
  ApprovalActionButtons,
  type ApprovalAction,
} from './ApprovalActionButtons';
import { DateTile } from './ApprovalSlotSummary';

type Props = {
  booking: BookingWithRelations | null;
  onClose: () => void;
  onApprove: (bookingId: number) => void;
  onReject: (bookingId: number) => void;
  processingId?: number | null;
  processingAction?: ApprovalAction | null;
  actionError?: string | null;
};

// Status badge colours come from the shared status tokens.
const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-(--color-status-damaged-bg) text-(--color-status-damaged-text)',
  APPROVED: 'bg-(--color-status-active-bg) text-(--color-status-active-text)',
  REJECTED:
    'bg-(--color-status-inactive-bg) text-(--color-status-inactive-text)',
  COMPLETED:
    'bg-(--color-status-completed-bg) text-(--color-status-completed-text)',
};

function Field({
  label,
  children,
  wide = false,
}: Readonly<{ label: string; children: ReactNode; wide?: boolean }>) {
  return (
    <div className={twMerge('min-w-0', wide && 'sm:col-span-2')}>
      <dt className="text-xs text-(--color-modal-label)">{label}</dt>
      <dd className="mt-0.5 font-medium break-words">{children}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="border-t border-(--color-modal-divider) pt-5">
      <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">{title}</h3>
      {children}
    </section>
  );
}

export function PendingApprovalDetailsModal({
  booking,
  onClose,
  onApprove,
  onReject,
  processingId = null,
  processingAction = null,
  actionError = null,
}: Readonly<Props>) {
  const { t, i18n } = useTranslation();

  if (!booking) return null;

  const statusKey = `bookings.status.${booking.status.toLowerCase()}` as
    | 'bookings.status.pending'
    | 'bookings.status.approved'
    | 'bookings.status.rejected'
    | 'bookings.status.cancelled'
    | 'bookings.status.completed';

  const slot = formatApprovalSlot(
    booking.bookingStart,
    booking.bookingEnd,
    i18n.language
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="md"
      className="max-w-2xl"
      ariaLabel={t('approvals.modal.ariaLabel', { id: booking.id })}
      title={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-xl font-bold text-(--color-ink)">
            {t('approvals.modal.title', { id: booking.id })}
          </h2>
          <span
            className={twMerge(
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
              STATUS_BADGE[booking.status] ??
                'bg-(--color-surface) text-(--color-table-text)'
            )}
          >
            {t(statusKey, { defaultValue: booking.status })}
          </span>
        </div>
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
              className="rounded-lg bg-(--color-status-inactive-bg) px-3 py-2 text-sm font-medium text-(--color-status-inactive-text)"
              role="alert"
            >
              {actionError}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="md"
              className="min-h-11 py-2.5"
              onClick={onClose}
            >
              {t('approvals.modal.cancel')}
            </Button>
            <ApprovalActionButtons
              bookingId={Number(booking.id)}
              onApprove={onApprove}
              onReject={onReject}
              processingId={processingId}
              processingAction={processingAction}
              size="md"
              fullWidth
              className="sm:inline-flex sm:w-auto sm:[&>button]:flex-none"
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* What is being requested, and when: the basis of the decision. */}
        <div className="flex items-start gap-4">
          {slot.valid && <DateTile slot={slot} />}
          <div className="min-w-0">
            <p className="text-lg leading-snug font-semibold text-(--color-ink)">
              {booking.asset.name}
            </p>
            {slot.valid && (
              <>
                <p className="mt-1 text-sm first-letter:uppercase">
                  {slot.dateLabel}
                </p>
                <p className="text-sm font-semibold tabular-nums">
                  {slot.timeLabel}
                </p>
              </>
            )}
          </div>
        </div>

        {booking.notes && (
          <Section title={t('approvals.modal.sections.notes')}>
            <p className="rounded-lg bg-(--color-surface) px-4 py-3 text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
              {booking.notes}
            </p>
          </Section>
        )}

        <Section title={t('approvals.modal.sections.requestedBy')}>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('approvals.modal.fields.name')}>
              {getFullName(booking.user)}
            </Field>
            <Field label={t('approvals.modal.fields.role')}>
              {t(`users.roles.${booking.user.role}`, {
                defaultValue: booking.user.role,
              })}
            </Field>
            <Field label={t('approvals.modal.fields.email')} wide>
              <a
                href={`mailto:${booking.user.email}`}
                className="rounded-sm text-(--color-brand) underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)"
              >
                {booking.user.email}
              </a>
            </Field>
          </dl>
        </Section>

        <Section title={t('approvals.modal.sections.asset')}>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('approvals.modal.fields.category')}>
              {booking.asset.category.name}
            </Field>
            <Field label={t('approvals.modal.fields.location')}>
              {booking.asset.location}
            </Field>
            <Field label={t('approvals.modal.fields.status')}>
              {t(`assets.status.${booking.asset.status}`, {
                defaultValue: booking.asset.status,
              })}
            </Field>
            {booking.asset.description && (
              <Field label={t('approvals.modal.fields.description')} wide>
                {booking.asset.description}
              </Field>
            )}
          </dl>
        </Section>
      </div>
    </Modal>
  );
}
