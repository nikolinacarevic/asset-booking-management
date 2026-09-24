// external imports
import type { MouseEvent } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

// components
import { Button } from '../../../components/ui/Button';

export type ApprovalAction = 'approve' | 'reject';

// props of the component
type Props = {
  bookingId: number;
  onApprove: (bookingId: number) => void;
  onReject: (bookingId: number) => void;
  processingId?: number | null;
  /** Which action is in flight for `processingId`, to show progress on it. */
  processingAction?: ApprovalAction | null;
  className?: string;
  size?: 'sm' | 'md';
  /** Stretch both buttons to share the row (card layouts on small screens). */
  fullWidth?: boolean;
};

/** Sized like the MUI icon it replaces so the button width stays put. */
function Spinner({ size }: Readonly<{ size: 'sm' | 'md' }>) {
  return (
    <span
      aria-hidden
      className={twMerge(
        'inline-flex shrink-0 items-center justify-center',
        size === 'sm' ? 'size-5' : 'size-6'
      )}
    >
      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
    </span>
  );
}

/**
 * Idle and in-flight labels share one grid cell, so the button keeps the
 * width of the longer one and the row doesn't shift while a request runs.
 * The hidden label is `invisible`, which also keeps it out of the name.
 */
function StableLabel({
  idle,
  busy,
  isBusy,
}: Readonly<{ idle: string; busy: string; isBusy: boolean }>) {
  return (
    <span className="grid">
      <span
        className={twMerge('col-start-1 row-start-1', isBusy && 'invisible')}
      >
        {idle}
      </span>
      <span
        className={twMerge('col-start-1 row-start-1', !isBusy && 'invisible')}
      >
        {busy}
      </span>
    </span>
  );
}

// approval action buttons component
export function ApprovalActionButtons({
  bookingId,
  onApprove,
  onReject,
  processingId = null,
  processingAction = null,
  className,
  size = 'md',
  fullWidth = false,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const isProcessing = processingId === bookingId;
  const isDisabled = processingId != null;

  const iconSize = size === 'sm' ? 'small' : 'medium';
  const approving = isProcessing && processingAction === 'approve';
  const rejecting = isProcessing && processingAction === 'reject';

  // prevent row click / parent handlers when using approve/reject actions
  const handleApprove = (event: MouseEvent) => {
    event.stopPropagation();
    onApprove(bookingId);
  };

  const handleReject = (event: MouseEvent) => {
    event.stopPropagation();
    onReject(bookingId);
  };

  const sizeClassName =
    size === 'sm'
      ? 'min-h-9 gap-1.5 px-3.5 py-1.5 text-sm'
      : 'min-h-11 gap-2 px-5 py-2.5 text-[0.9375rem]';

  // Always labelled: approving/rejecting is a consequential decision, so the
  // actions must be explicit and visually distinct. Approve is the solid
  // primary and sits last; Reject is a quieter destructive button (red label
  // and icon on a tinted outline) so a list of requests doesn't turn into a
  // wall of red. Reject is confirmed in a dialog before it runs.
  return (
    <div
      className={twMerge(
        'inline-flex flex-wrap items-center gap-2',
        fullWidth && 'flex w-full flex-nowrap [&>button]:flex-1',
        className
      )}
      aria-busy={isProcessing || undefined}
    >
      <Button
        data-testid={`reject-booking-${bookingId}`}
        type="button"
        size={size}
        variant="outline"
        disabled={isDisabled}
        // While in flight the visible label changes, so let it name the button.
        aria-label={
          rejecting
            ? undefined
            : t('approvals.actions.rejectAria', { id: bookingId })
        }
        iconLeft={
          rejecting ? (
            <Spinner size={size} />
          ) : (
            <CloseIcon fontSize={iconSize} aria-hidden />
          )
        }
        className={twMerge(
          'border-(--color-reject-border) bg-transparent font-semibold text-(--color-reject) hover:border-(--color-reject) hover:bg-(--color-reject-soft) hover:text-(--color-reject-hover) dark:border-(--color-reject-border) dark:bg-transparent dark:text-(--color-reject) dark:hover:border-(--color-reject) dark:hover:bg-(--color-reject-soft) dark:hover:text-(--color-reject-hover)',
          sizeClassName,
          rejecting && 'opacity-100'
        )}
        onClick={handleReject}
      >
        <StableLabel
          idle={t('approvals.actions.rejectLabel')}
          busy={t('approvals.actions.rejecting')}
          isBusy={rejecting}
        />
      </Button>
      <Button
        data-testid={`approve-booking-${bookingId}`}
        type="button"
        size={size}
        variant="solid"
        disabled={isDisabled}
        aria-label={
          approving
            ? undefined
            : t('approvals.actions.approveAria', { id: bookingId })
        }
        iconLeft={
          approving ? (
            <Spinner size={size} />
          ) : (
            <CheckIcon fontSize={iconSize} aria-hidden />
          )
        }
        className={twMerge(
          'border-(--color-approve) bg-(--color-approve) font-semibold text-(--color-approve-text) shadow-xs hover:border-(--color-approve-hover) hover:bg-(--color-approve-hover)',
          sizeClassName,
          approving && 'opacity-100'
        )}
        onClick={handleApprove}
      >
        <StableLabel
          idle={t('approvals.actions.approveLabel')}
          busy={t('approvals.actions.approving')}
          isBusy={approving}
        />
      </Button>
      {isProcessing && (
        <span role="status" className="sr-only">
          {t('approvals.actions.processing')}
        </span>
      )}
    </div>
  );
}
