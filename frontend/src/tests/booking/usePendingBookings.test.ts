import { act, renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock('../../features/booking/api/bookingApi', () => ({
  getPendingBookings: vi.fn(),
}));
vi.mock('../../features/booking/utils/approvalFilter', () => ({
  filterPendingBookingsForApprover: vi.fn((bookings: unknown[]) => bookings),
}));

import { getPendingBookings } from '../../features/booking/api/bookingApi';
import {
  invalidatePendingBookings,
  usePendingBookings,
} from '../../features/booking/hooks/usePendingBookings';

const approver = { email: 'manager@test.com', role: 'MANAGER' as const };

describe('usePendingBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPendingBookings).mockResolvedValue({
      content: [{ id: 1 }, { id: 2 }],
    } as any);
  });

  it('refetches all hook instances when invalidatePendingBookings is called', async () => {
    const { result: first } = renderHook(() => usePendingBookings(approver));
    const { result: second } = renderHook(() => usePendingBookings(approver));

    await waitFor(() => expect(first.current.loading).toBe(false));
    await waitFor(() => expect(second.current.loading).toBe(false));
    expect(first.current.bookings).toHaveLength(2);
    expect(second.current.bookings).toHaveLength(2);

    vi.mocked(getPendingBookings).mockResolvedValue({
      content: [{ id: 3 }],
    } as any);

    act(() => {
      invalidatePendingBookings();
    });

    await waitFor(() => expect(first.current.loading).toBe(false));
    await waitFor(() => expect(second.current.loading).toBe(false));
    expect(first.current.bookings).toHaveLength(1);
    expect(second.current.bookings).toHaveLength(1);
  });
});
