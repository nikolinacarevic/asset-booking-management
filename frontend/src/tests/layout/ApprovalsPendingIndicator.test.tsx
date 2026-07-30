import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock('../../features/booking/hooks/usePendingBookings', () => ({
  usePendingBookings: vi.fn(),
}));
vi.mock('../../features/user/utils/users', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../features/user/utils/users')>();
  return { ...actual, isManager: vi.fn() };
});

import { ApprovalsPendingIndicator } from '../../components/layout/ApprovalsPendingIndicator';
import { usePendingBookings } from '../../features/booking/hooks/usePendingBookings';
import { isManager } from '../../features/user/utils/users';
import { authState, mockUseAuth } from '../mocks/auth';

const managerUser = {
  id: 1,
  role: 'MANAGER',
  name: 'Test',
  surname: 'Manager',
  email: 'manager@test.com',
} as const;

const renderIndicator = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ApprovalsPendingIndicator />
    </MemoryRouter>
  );

describe('ApprovalsPendingIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isManager).mockReturnValue(true);
    mockUseAuth.mockReturnValue(authState({ user: managerUser as any }));
    vi.mocked(usePendingBookings).mockReturnValue({
      bookings: [],
      loading: false,
      error: '',
      refetch: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('renders nothing when there are no pending bookings', () => {
    renderIndicator();
    expect(screen.queryByLabelText('layout.navbar.pendingApprovals')).not.toBeInTheDocument();
  });

  it('renders a red indicator when pending bookings exist', () => {
    vi.mocked(usePendingBookings).mockReturnValue({
      bookings: [{ id: 1 }] as any,
      loading: false,
      error: '',
      refetch: vi.fn().mockResolvedValue(undefined),
    });

    renderIndicator();
    expect(screen.getByLabelText('layout.navbar.pendingApprovals')).toBeInTheDocument();
  });

  it('does not render for non-manager users', () => {
    vi.mocked(isManager).mockReturnValue(false);
    vi.mocked(usePendingBookings).mockReturnValue({
      bookings: [{ id: 1 }] as any,
      loading: false,
      error: '',
      refetch: vi.fn().mockResolvedValue(undefined),
    });

    renderIndicator();
    expect(screen.queryByLabelText('layout.navbar.pendingApprovals')).not.toBeInTheDocument();
  });
});
