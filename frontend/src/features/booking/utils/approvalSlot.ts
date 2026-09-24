const LOCALES: Record<string, string> = {
  en: 'en-GB',
  hr: 'hr-HR',
  de: 'de-DE',
};

export type ApprovalSlot = {
  /** Short month for the calendar tile, e.g. "Oct". */
  month: string;
  /** Day of month for the calendar tile, e.g. "2". */
  day: string;
  /** Weekday, e.g. "Friday". */
  weekday: string;
  /** Full date line, e.g. "Friday, 2 October 2026". */
  dateLabel: string;
  /** Time range, e.g. "09:00 – 11:00", or with dates when it spans days. */
  timeLabel: string;
  valid: boolean;
};

const resolveLocale = (language: string) =>
  LOCALES[language] ?? LOCALES[language.split('-')[0]] ?? language;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Presentation-only formatting of a booking slot for the approvals queue.
 * Keeps the date and time on separate lines so approvers can scan by day.
 */
export function formatApprovalSlot(
  start: string | Date,
  end: string | Date,
  language: string
): ApprovalSlot {
  const from = new Date(start);
  const to = new Date(end);
  const locale = resolveLocale(language);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return {
      month: '',
      day: '',
      weekday: '',
      dateLabel: '',
      timeLabel: '',
      valid: false,
    };
  }

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const shortDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  });

  const timeLabel = isSameDay(from, to)
    ? `${time.format(from)} – ${time.format(to)}`
    : `${time.format(from)} – ${shortDate.format(to)}, ${time.format(to)}`;

  return {
    month: new Intl.DateTimeFormat(locale, { month: 'short' })
      .format(from)
      .replace('.', ''),
    day: String(from.getDate()),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(from),
    dateLabel: new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(from),
    timeLabel,
    valid: true,
  };
}

/** Soonest first, so the requests that need a decision first sit on top. */
export function sortBySoonestStart<T extends { bookingStart: string | Date }>(
  bookings: T[]
): T[] {
  return [...bookings].sort(
    (a, b) =>
      new Date(a.bookingStart).getTime() - new Date(b.bookingStart).getTime()
  );
}
