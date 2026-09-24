// utils
import type { ApprovalSlot } from '../utils/approvalSlot';

/** Calendar tile: the booking day at a glance, the anchor of each request. */
export function DateTile({ slot }: Readonly<{ slot: ApprovalSlot }>) {
  return (
    <div
      aria-hidden
      className="flex w-12 shrink-0 flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-table-surface) text-center shadow-xs"
    >
      <span className="bg-(--color-primaryblue) py-0.5 text-[0.6875rem] leading-4 font-semibold text-white">
        {slot.month}
      </span>
      <span className="py-1 text-lg leading-6 font-bold text-(--color-ink) tabular-nums">
        {slot.day}
      </span>
    </div>
  );
}

export function SlotSummary({
  slot,
}: Readonly<{ slot: ApprovalSlot | undefined }>) {
  if (!slot?.valid) return null;

  return (
    <div className="flex items-center gap-3">
      <DateTile slot={slot} />
      <div className="min-w-0 leading-snug">
        <span className="sr-only">{slot.dateLabel}, </span>
        <p className="text-sm font-semibold whitespace-nowrap text-(--color-table-text) tabular-nums">
          {slot.timeLabel}
        </p>
        <p
          aria-hidden
          className="text-xs text-(--color-modal-label) capitalize"
        >
          {slot.weekday}
        </p>
      </div>
    </div>
  );
}
