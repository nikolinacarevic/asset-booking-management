// external packages
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// components
import { Table, type TableColumn } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import {
  ApprovalActionButtons,
  type ApprovalAction,
} from './ApprovalActionButtons';
import { PendingApprovalDetailsModal } from './PendingApprovalDetailsModal';
import { RejectBookingDialog } from './RejectBookingDialog';
import { SlotSummary } from './ApprovalSlotSummary';

// hooks
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// utils
import { formatApprovalSlot } from '../utils/approvalSlot';
import { getFullName } from '../../user/utils/users';

// types
import type { BookingWithRelations } from '../types';

// props of the component
type Props = {
  bookings: BookingWithRelations[];
  isLoading?: boolean;
  error?: string | null;
  selectedBooking: BookingWithRelations | null;
  onOpenBooking: (bookingId: number | string) => void;
  onCloseBooking: () => void;
  onApprove: (bookingId: number) => void;
  onReject: (bookingId: number) => void;
  processingId?: number | null;
  processingAction?: ApprovalAction | null;
  actionError?: string | null;
  /** Pending requests before search filtering (tells "empty" from "no match"). */
  totalCount?: number;
  searchQuery?: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
};

/** Wide enough for the five-column table; below this the queue renders as cards. */
// Measured: the table needs ~975px of content width, which the shell
// only provides from ~1320px up (en/de/hr); 1360px leaves headroom.
const TABLE_QUERY = '(min-width: 1360px)';

function TwoLine({
  primary,
  secondary,
}: Readonly<{ primary: ReactNode; secondary?: ReactNode }>) {
  return (
    <div className="flex min-w-0 flex-col leading-snug">
      <span
        className="truncate font-semibold text-(--color-table-text)"
        title={typeof primary === 'string' ? primary : undefined}
      >
        {primary}
      </span>
      {secondary && (
        <span
          className="truncate text-xs text-(--color-modal-label)"
          title={typeof secondary === 'string' ? secondary : undefined}
        >
          {secondary}
        </span>
      )}
    </div>
  );
}

function RequestLink({
  booking,
  onOpen,
  className,
}: Readonly<{
  booking: BookingWithRelations;
  onOpen: () => void;
  className?: string;
}>) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={t('approvals.actions.detailsAria', { id: booking.id })}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      className={twMerge(
        'inline-flex min-h-9 cursor-pointer items-center rounded-md px-1.5 text-sm font-semibold text-(--color-brand) tabular-nums underline decoration-1 underline-offset-4 transition-colors outline-none hover:decoration-2 focus-visible:ring-2 focus-visible:ring-(--color-brand)',
        className
      )}
    >
      #{booking.id}
    </button>
  );
}

type QueueStateProps = {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  role?: 'status' | 'alert';
};

function QueueState({
  icon,
  title,
  body,
  action,
  role = 'status',
}: Readonly<QueueStateProps>) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border) px-6 py-14 text-center"
    >
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-(--color-surface) text-(--color-brand)"
      >
        {icon}
      </span>
      <h2 className="text-lg font-semibold text-(--color-ink)">{title}</h2>
      {body && (
        <p className="max-w-md text-sm text-(--color-modal-label)">{body}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

function QueueSkeleton({ label }: Readonly<{ label: string }>) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-3">
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          aria-hidden
          className="flex animate-pulse items-center gap-4 rounded-xl border border-(--color-border) p-4 motion-reduce:animate-none"
        >
          <div className="h-14 w-12 rounded-lg bg-(--color-surface)" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-1/3 rounded bg-(--color-surface)" />
            <div className="h-3 w-1/2 rounded bg-(--color-surface)" />
          </div>
          <div className="hidden h-10 w-48 rounded-lg bg-(--color-surface) sm:block" />
        </div>
      ))}
    </div>
  );
}

// pending approvals component
export function PendingApprovalsTable({
  bookings,
  isLoading,
  error,
  selectedBooking,
  onOpenBooking,
  onCloseBooking,
  onApprove,
  onReject,
  processingId = null,
  processingAction = null,
  actionError = null,
  totalCount,
  searchQuery = '',
  onClearSearch,
  onRetry,
}: Readonly<Props>) {
  const { t, i18n } = useTranslation();
  // Without matchMedia (e.g. jsdom) fall back to the table.
  const isWide = useMediaQuery(TABLE_QUERY, true);
  const regionRef = useRef<HTMLDivElement>(null);
  const [rejectTarget, setRejectTarget] = useState<BookingWithRelations | null>(
    null
  );

  const slots = useMemo(
    () =>
      new Map(
        bookings.map((booking) => [
          booking.id,
          formatApprovalSlot(
            booking.bookingStart,
            booking.bookingEnd,
            i18n.language
          ),
        ])
      ),
    [bookings, i18n.language]
  );

  // Reject always goes through a confirmation step (it cannot be undone).
  const requestReject = (bookingId: number) => {
    setRejectTarget(
      bookings.find((booking) => Number(booking.id) === bookingId) ??
        selectedBooking
    );
  };

  const confirmReject = (bookingId: number) => {
    setRejectTarget(null);
    onReject(bookingId);
  };

  // When a decided request leaves the queue its buttons go with it; keep
  // keyboard users in the queue instead of dropping focus to <body>.
  // Only when a request was removed, never on the initial load.
  const bookingCount = bookings.length;
  const previousCountRef = useRef(bookingCount);
  useEffect(() => {
    if (
      bookingCount < previousCountRef.current &&
      document.activeElement === document.body
    ) {
      regionRef.current?.focus();
    }
    previousCountRef.current = bookingCount;
  }, [bookingCount]);

  const columns: TableColumn<BookingWithRelations>[] = [
    {
      key: 'when',
      header: t('approvals.table.when'),
      headerClassName: 'py-3 pr-4 pl-5',
      cellClassName: 'py-3 pr-4 pl-5',
      render: (booking) => <SlotSummary slot={slots.get(booking.id)} />,
    },
    {
      key: 'requestedBy',
      header: t('approvals.table.requestedBy'),
      headerClassName: 'px-4 py-3',
      cellClassName: 'max-w-60 px-4 py-3',
      render: (booking) => (
        <TwoLine
          primary={getFullName(booking.user)}
          secondary={booking.user.email}
        />
      ),
    },
    {
      key: 'asset',
      header: t('approvals.table.asset'),
      headerClassName: 'px-4 py-3',
      cellClassName: 'max-w-60 px-4 py-3',
      render: (booking) => (
        <TwoLine
          primary={booking.asset.name}
          secondary={booking.asset.category?.name}
        />
      ),
    },
    {
      key: 'request',
      header: t('approvals.table.request'),
      headerClassName: 'px-4 py-3',
      cellClassName: 'px-3 py-3',
      render: (booking) => (
        <RequestLink
          booking={booking}
          onOpen={() => onOpenBooking(booking.id)}
        />
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">{t('approvals.table.actionsSr')}</span>,
      headerClassName: 'w-px py-3 pr-5 pl-4 whitespace-nowrap',
      cellClassName: 'w-px py-3 pr-5 pl-4 whitespace-nowrap',
      render: (booking) => (
        <ApprovalActionButtons
          bookingId={Number(booking.id)}
          onApprove={onApprove}
          onReject={requestReject}
          processingId={processingId}
          processingAction={processingAction}
          size="sm"
          className="flex-nowrap justify-end"
        />
      ),
    },
  ];

  const renderCards = () => (
    <ul className="grid gap-3 md:grid-cols-2">
      {bookings.map((booking) => (
        <li key={booking.id}>
          <article
            aria-label={t('approvals.modal.title', { id: booking.id })}
            className="flex h-full flex-col gap-4 rounded-xl border border-(--color-table-border) bg-(--color-table-surface) p-4 shadow-(--color-table-shadow)"
          >
            <div className="flex items-start justify-between gap-3">
              <SlotSummary slot={slots.get(booking.id)} />
              <RequestLink
                booking={booking}
                onOpen={() => onOpenBooking(booking.id)}
                className="-mt-1 -mr-1.5"
              />
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
              <div className="min-w-0">
                <dt className="mb-0.5 text-xs text-(--color-modal-label)">
                  {t('approvals.table.requestedBy')}
                </dt>
                <dd>
                  <TwoLine
                    primary={getFullName(booking.user)}
                    secondary={booking.user.email}
                  />
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="mb-0.5 text-xs text-(--color-modal-label)">
                  {t('approvals.table.asset')}
                </dt>
                <dd>
                  <TwoLine
                    primary={booking.asset.name}
                    secondary={booking.asset.category?.name}
                  />
                </dd>
              </div>
            </dl>

            <ApprovalActionButtons
              bookingId={Number(booking.id)}
              onApprove={onApprove}
              onReject={requestReject}
              processingId={processingId}
              processingAction={processingAction}
              size="md"
              fullWidth
              className="mt-auto border-t border-(--color-table-row-border) pt-4"
            />
          </article>
        </li>
      ))}
    </ul>
  );

  let content: ReactNode;

  if (isLoading && bookings.length === 0) {
    content = <QueueSkeleton label={t('approvals.loading')} />;
  } else if (error) {
    content = (
      <QueueState
        role="alert"
        icon={<ErrorOutlineIcon aria-hidden />}
        title={t('approvals.states.errorTitle')}
        body={t('approvals.states.errorBody')}
        action={
          onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11"
              onClick={onRetry}
            >
              {t('approvals.states.retry')}
            </Button>
          )
        }
      />
    );
  } else if (
    bookings.length === 0 &&
    searchQuery.trim() &&
    (totalCount ?? 0) > 0
  ) {
    content = (
      <QueueState
        icon={<SearchOffIcon aria-hidden />}
        title={t('approvals.states.noResultsTitle', {
          query: searchQuery.trim(),
        })}
        body={t('approvals.states.noResultsBody')}
        action={
          onClearSearch && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11"
              onClick={onClearSearch}
            >
              {t('approvals.states.clearSearch')}
            </Button>
          )
        }
      />
    );
  } else if (bookings.length === 0) {
    content = (
      <QueueState
        icon={<TaskAltIcon aria-hidden />}
        title={t('approvals.states.emptyTitle')}
        body={t('approvals.states.emptyBody')}
      />
    );
  } else if (isWide) {
    content = (
      <Table
        data={bookings}
        columns={columns}
        getRowKey={(booking) => String(booking.id)}
        className="w-full rounded-xl"
        onRowClick={(booking) => onOpenBooking(booking.id)}
      />
    );
  } else {
    content = renderCards();
  }

  return (
    <>
      <div
        ref={regionRef}
        tabIndex={-1}
        aria-busy={isLoading || undefined}
        className="outline-none"
      >
        {content}
      </div>

      <PendingApprovalDetailsModal
        booking={selectedBooking}
        onClose={onCloseBooking}
        onApprove={onApprove}
        onReject={requestReject}
        processingId={processingId}
        processingAction={processingAction}
        actionError={actionError}
      />

      <RejectBookingDialog
        booking={rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onConfirm={confirmReject}
      />
    </>
  );
}
