// Types
import type { BookingWithRelations } from '../../booking/types';

// function to check if a booking is past its end date
export const isBookingPastEnd = (
  booking: Pick<BookingWithRelations, 'bookingEnd'>
) => new Date(booking.bookingEnd).getTime() < Date.now();

// statuses that cannot be cancelled by the user
const NON_CANCELLABLE_STATUSES = new Set([
  'CANCELLED',
  'REJECTED',
  'COMPLETED',
]);

// function to check if a booking can be cancelled by the user
export const canCancelBooking = (
  booking: Pick<BookingWithRelations, 'status' | 'bookingEnd'>
) =>
  !NON_CANCELLABLE_STATUSES.has(booking.status) && !isBookingPastEnd(booking);

// function to sort bookings by start date newest first
export const sortBookingsNewestFirst = (
  bookings: BookingWithRelations[]
): BookingWithRelations[] =>
  [...bookings].sort(
    (a, b) =>
      new Date(b.bookingStart).getTime() - new Date(a.bookingStart).getTime()
  );

export const mapBookingsToCalendarEvents = (
  bookings: BookingWithRelations[],
  bookingPeriod: 'HOUR' | 'DAY' = 'DAY'
) => {
  return bookings
    .filter(
      (booking) =>
        booking.status === 'APPROVED' || booking.status === 'PENDING'
    )
    .map((booking) => ({
      id: booking.id.toString(),
      title: '',
      start: new Date(booking.bookingStart).toISOString(),
      end: new Date(booking.bookingEnd).toISOString(),
      backgroundColor: '#e5e7eb',
      borderColor: '#e5e7eb',
      display: bookingPeriod === 'DAY' ? ('background' as const) : ('block' as const),
      extendedProps: {
        booking,
      },
    }));
};

export const hasBookingOverlap = ({
  bookings,
  fromDate,
  toDate,
  fromHour,
  toHour,
  bookingPeriod,
}: {
  bookings: BookingWithRelations[];
  fromDate: string;
  toDate: string;
  fromHour?: string;
  toHour?: string;
  bookingPeriod: 'HOUR' | 'DAY';
}) => {
  const selectedStart =
    bookingPeriod === 'HOUR'
      ? new Date(`${fromDate}T${fromHour}:00`)
      : new Date(`${fromDate}T00:00:00`);

  // check if the selected start time is in the past
  if (bookingPeriod === 'HOUR') {
    if (selectedStart.getTime() < Date.now()) {
      return true;
    }
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedStart < today) {
      return true;
    }
  }

  const selectedEnd =
    bookingPeriod === 'HOUR'
      ? new Date(`${toDate}T${toHour}:00`)
      : new Date(`${toDate}T23:59:59`);
  return bookings.some((booking) => {
    if (booking.status !== 'APPROVED' && booking.status !== 'PENDING') {
      return false;
    }

    const bookingStart = new Date(booking.bookingStart);
    const bookingEnd = new Date(booking.bookingEnd);

    return selectedStart < bookingEnd && selectedEnd > bookingStart;
  });
};

// format the booking time
export const formatBookingTime = (start: string | Date, end: string | Date) => {
  return `${formatDateTime(start)} – ${formatDateTime(end)}`;
};

const formatDateTime = (value: string | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year}. ${hours}:${minutes}`;
};
