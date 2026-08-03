// External packages
import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Types
import type { BookingWithRelations } from '../types';

// Internationalization
import hrLocale from '@fullcalendar/core/locales/hr';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import deLocale from '@fullcalendar/core/locales/de';
import { useTranslation } from 'react-i18next';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
  extendedProps?: {
    booking: BookingWithRelations;
  };
};

type Props = {
  events: CalendarEvent[];
  selectedFromDate?: string;
  selectedToDate?: string;
  onDateClick?: (date: string) => void;
  variant?: 'HOUR' | 'DAY';
  setSelectedBooking?: (booking: BookingWithRelations | null) => void;
  onRangeSelect: (fromDate: string, toDate: string) => void;
  availableRecurringDates?: string[];
  maxBookingDate: Date;
  visibleMonth: Date;
  onMonthChange?: (date: Date) => void;
};

export function AvailabilityCalendar({
  events,
  selectedFromDate,
  selectedToDate,
  onDateClick,
  setSelectedBooking,
  onRangeSelect,
  onMonthChange,
  visibleMonth,
  availableRecurringDates = [],
  maxBookingDate,
  variant = 'DAY',
}: Props) {
  const { i18n } = useTranslation();

  const occupiedDates = React.useMemo(() => {
    const dates = new Set<string>();

    for (const event of events) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        continue;
      }

      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);

      const last = new Date(end);
      // FullCalendar end is exclusive for all-day-like ranges; for timed events
      // still gray every calendar day the booking covers.
      if (
        last.getHours() === 0 &&
        last.getMinutes() === 0 &&
        last.getSeconds() === 0 &&
        last.getTime() > start.getTime()
      ) {
        last.setDate(last.getDate() - 1);
      }
      last.setHours(0, 0, 0, 0);

      while (cursor <= last) {
        dates.add(cursor.toLocaleDateString('sv-SE'));
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return dates;
  }, [events]);

  const calendarLocale = React.useMemo(() => {
    switch (i18n.resolvedLanguage) {
      case 'hr':
        return hrLocale;
      case 'de':
        return deLocale;
      default:
        return enGbLocale;
    }
  }, [i18n.resolvedLanguage]);

  const isOccupiedDate = (date: Date | string) => {
    const key =
      typeof date === 'string' ? date : date.toLocaleDateString('sv-SE');
    return occupiedDates.has(key);
  };

  const isSelectableDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const max = new Date(maxBookingDate);
    max.setHours(23, 59, 59, 999);

    if (date < today || date > max) {
      return false;
    }

    // Day bookings occupy the whole day — block selection.
    if (variant === 'DAY' && isOccupiedDate(date)) {
      return false;
    }

    return true;
  };

  const handleDateClick = React.useCallback(
    (info: any) => {
      if (!isSelectableDate(info.date)) {
        return;
      }

      onDateClick?.(info.dateStr);
    },
    [onDateClick, maxBookingDate, occupiedDates, variant]
  );
  const handleEventClick = React.useCallback(
    (info: any) => {
      setSelectedBooking?.(info.event.extendedProps?.booking ?? null);
    },
    [setSelectedBooking]
  );

  const handleDateRangeSelect = React.useCallback(
    (info: any) => {
      const end = new Date(info.end);
      end.setDate(end.getDate() - 1);

      if (!isSelectableDate(info.start) || !isSelectableDate(end)) {
        return;
      }

      const cursor = new Date(info.start);
      cursor.setHours(0, 0, 0, 0);
      const last = new Date(end);
      last.setHours(0, 0, 0, 0);

      while (cursor <= last) {
        if (isOccupiedDate(cursor)) {
          return;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      onRangeSelect(info.startStr, end.toLocaleDateString('sv-SE'));
    },
    [onRangeSelect, maxBookingDate, occupiedDates, variant]
  );

  const isDateInRange = (date: string, from?: string, to?: string) => {
    if (!from) return false;
    if (!to) {
      return date === from;
    }
    return date >= from && date <= to;
  };
  const calendarRef = React.useRef<FullCalendar>(null);
  React.useEffect(() => {
    const api = calendarRef.current?.getApi();

    if (!api || !visibleMonth) return;

    const current = api.getDate();

    if (
      current.getFullYear() !== visibleMonth.getFullYear() ||
      current.getMonth() !== visibleMonth.getMonth()
    ) {
      api.gotoDate(visibleMonth);
    }
  }, [visibleMonth]);

  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={calendarLocale}
        titleFormat={(date) => {
          const formatted = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
            month: 'long',
            year: 'numeric',
          }).format(date.date.marker);

          return i18n.resolvedLanguage === 'hr'
            ? formatted.charAt(0).toUpperCase() + formatted.slice(1)
            : formatted;
        }}
        firstDay={1}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        displayEventTime={false}
        events={events}
        selectable={variant !== 'HOUR'}
        selectMirror={true}
        dateClick={handleDateClick}
        select={variant !== 'HOUR' ? handleDateRangeSelect : undefined}
        eventClick={variant === 'HOUR' ? handleEventClick : undefined}

        datesSet={(info) => {
          const current = info.view.currentStart;

          if (
            current.getFullYear() !== visibleMonth.getFullYear() ||
            current.getMonth() !== visibleMonth.getMonth()
          ) {
            onMonthChange?.(current);
          }
        }}
        selectAllow={(selectInfo) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectInfo.start < today || selectInfo.start > maxBookingDate) {
            return false;
          }

          if (variant !== 'DAY') {
            return true;
          }

          const cursor = new Date(selectInfo.start);
          cursor.setHours(0, 0, 0, 0);
          const end = new Date(selectInfo.end);
          end.setDate(end.getDate() - 1);
          end.setHours(0, 0, 0, 0);

          while (cursor <= end) {
            if (isOccupiedDate(cursor)) {
              return false;
            }
            cursor.setDate(cursor.getDate() + 1);
          }

          return true;
        }}
        eventContent={(eventInfo) => {
          if (variant !== 'HOUR') {
            return null;
          }

          const start = eventInfo.event.start?.toLocaleTimeString([], {
            hour: 'numeric',
          });

          const end = eventInfo.event.end?.toLocaleTimeString([], {
            hour: 'numeric',
          });

          return (
            <div className="px-1 text-xs font-medium text-gray-600 dark:text-gray-300">
              {start && end ? `${start} – ${end}` : null}
            </div>
          );
        }}
        dayCellClassNames={(arg) => {
          const date = arg.date.toLocaleDateString('sv-SE');

          const isSelected = isDateInRange(
            date,
            selectedFromDate,
            selectedToDate
          );
          const isRecurring = availableRecurringDates.includes(date);
          const isOutOfRange = !isSelectableDate(arg.date) && !isOccupiedDate(arg.date);
          const isOccupied = variant === 'DAY' && isOccupiedDate(arg.date);
          const isDisabled = isOutOfRange || isOccupied;

          return [
            'transition-all duration-150',
            isDisabled
              ? 'pointer-events-none cursor-not-allowed'
              : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20',

            isOutOfRange
              ? 'bg-gray-50 text-gray-400 opacity-50 dark:bg-gray-800/40'
              : '',

            isOccupied
              ? 'bg-gray-50 text-gray-400 dark:bg-gray-700/20 dark:text-gray-500'
              : '',

            !isDisabled && (isSelected || isRecurring)
              ? 'bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/40'
              : '',
          ].join(' ');
        }}
        eventDisplay="block"
      />
    </div>
  );
}
