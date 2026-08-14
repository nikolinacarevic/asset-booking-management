import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Link, MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => {
      const navigate = actual.useNavigate();
      return ((to: unknown, options?: unknown) => {
        mockNavigate(to, options);
        return navigate(to as never, options as never);
      }) as typeof navigate;
    },
  };
});
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock('../../components/icons/Logo', () => ({
  Logo: ({ className }: React.SVGProps<SVGSVGElement>) => <svg className={className} aria-label="Logo" />,
}));
vi.mock('../../components/ui/LanguageSwitcher', () => ({ default: () => <div>LanguageSwitcher</div> }));
vi.mock('../../components/ui/ThemeToggle', () => ({ default: () => <button>ThemeToggle</button> }));
vi.mock('../../components/ui/Button', () => ({
  Button: ({ children, onClick, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} className={className}>{children}</button>
  ),
}));
vi.mock('../../features/user/utils/users', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../features/user/utils/users')>();
  const isAdmin = vi.fn();
  const isManager = vi.fn();
  return {
    ...actual,
    getFullName: vi.fn(() => 'Test User'),
    isAdmin,
    isManager,
    canAccessApprovals: (user: Parameters<typeof actual.canAccessApprovals>[0]) =>
      Boolean(isAdmin(user) || isManager(user)),
  };
});
vi.mock('../../components/layout/ApprovalsPendingIndicator', () => ({
  ApprovalsPendingIndicator: () => <span data-testid="approvals-pending-indicator" />,
}));
vi.mock('@mui/icons-material', () => ({
  MonitorSharp: () => <svg />, DnsSharp: () => <svg />, CalendarTodaySharp: () => <svg />,
  PeopleSharp: () => <svg />, LogoutSharp: () => <svg />, AccountCircleSharp: () => <svg />,
  HowToRegSharp: () => <svg />, EventNoteSharp: () => <svg />,
}));

import MobileMenu from '../../components/layout/MobileMenu';
import { authState, mockUseAuth } from '../mocks/auth';
import { isAdmin, isManager } from '../../features/user/utils/users';

const adminUser = { id: 1, role: 'ADMIN', name: 'Test', surname: 'User' } as const;

const renderMenu = (initialPath = '/', extra?: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      {extra}
      <MobileMenu />
    </MemoryRouter>
  );
const openMenu = () => userEvent.click(screen.getByRole('button', { name: '' }));

describe('MobileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.mocked(isAdmin).mockReturnValue(false);
    vi.mocked(isManager).mockReturnValue(false);
    mockUseAuth.mockReturnValue(authState({ user: adminUser as any }));
  });

  it('renders trigger button and opens menu on click', async () => {
    renderMenu();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    await openMenu();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders common nav links, logout and account link after opening', async () => {
    renderMenu();
    await openMenu();
    for (const key of ['layout.navbar.assets', 'layout.navbar.categories', 'layout.navbar.bookings', 'layout.navbar.myBookings', 'layout.navbar.logout']) {
      expect(screen.getByText(key)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /Test User/i })).toHaveAttribute('href', '/account-info');
  });

  it.each([
    ['users', 'admin', () => vi.mocked(isAdmin).mockReturnValue(true), 'layout.navbar.users'],
    [
      'approvals',
      'manager',
      () => vi.mocked(isManager).mockReturnValue(true),
      'layout.navbar.approvals',
    ],
    [
      'approvals',
      'admin',
      () => vi.mocked(isAdmin).mockReturnValue(true),
      'layout.navbar.approvals',
    ],
  ])('renders %s link only for %s', async (_, __, setup, linkText) => {
    renderMenu();
    await openMenu();
    expect(screen.queryByText(linkText)).not.toBeInTheDocument();

    cleanup();
    setup();
    renderMenu();
    await openMenu();
    expect(screen.getByText(linkText)).toBeInTheDocument();
  });

  it('renders pending approvals indicator for admin', async () => {
    vi.mocked(isAdmin).mockReturnValue(true);
    renderMenu();
    await openMenu();
    expect(screen.getByTestId('approvals-pending-indicator')).toBeInTheDocument();
  });

  it('closes menu after clicking a nav link', async () => {
    renderMenu('/bookings');
    await openMenu();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'layout.navbar.myBookings' }));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('closes menu after approvals deep-link navigation', async () => {
    vi.mocked(isAdmin).mockReturnValue(true);
    renderMenu(
      '/approvals',
      <Link to="/approvals/42">Open approval deep link</Link>
    );
    await openMenu();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'Open approval deep link' }));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('calls logout and navigates to /login on logout click', async () => {
    const auth = authState({ user: adminUser as any });
    mockUseAuth.mockReturnValue(auth);
    renderMenu();
    await openMenu();
    await userEvent.click(screen.getByText('layout.navbar.logout'));
    expect(auth.logout).toHaveBeenCalled();
    expect(mockNavigate.mock.calls[0][0]).toBe('/login');
  });

  it('renders user full name when logged in', async () => {
    mockUseAuth.mockReturnValue(authState({
      user: { id: 1, role: 'ADMIN', name: 'Test', surname: 'User' } as any,
    }));
    renderMenu();
    await openMenu();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
