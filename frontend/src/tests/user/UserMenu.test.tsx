import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'ui.userMenu.ariaLabel': 'User menu',
      'ui.userMenu.accountInfo': 'Account Info',
      'ui.userMenu.logout': 'Logout',
    }[key] ?? key),
  }),
}));
vi.mock('@mui/icons-material/AccountCircleOutlined', () => ({ default: () => <svg /> }));
vi.mock('@mui/icons-material/LogoutOutlined', () => ({ default: () => <svg /> }));
vi.mock('@mui/icons-material/VisibilityOutlined', () => ({ default: () => <svg /> }));
vi.mock('../icons/ChevronDown', () => ({ ChevronDown: () => <svg /> }));

import UserMenu from '../../components/ui/UserMenu';
import { authState, mockUseAuth } from '../mocks/auth';

const setup = () => {
  render(<UserMenu />);
  const trigger = screen.getByRole('button', { name: 'User menu' });
  const open = () => userEvent.click(trigger);
  return { trigger, open };
};

describe('UserMenu', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockReturnValue(authState());
  });

  it('renders the trigger, menu closed by default', () => {
    const { trigger } = setup();
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText('Account Info')).not.toBeInTheDocument();
  });

  it('opens the menu on click and closes on outside click', async () => {
    const { open } = setup();
    await open();
    expect(screen.getByText('Account Info')).toBeVisible();
    expect(screen.getByText('Logout')).toBeVisible();

    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByText('Account Info')).not.toBeInTheDocument());
  });

  it('opens with Enter/Space and closes with Escape', async () => {
    const { trigger } = setup();
    trigger.focus();

    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Account Info')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Account Info')).not.toBeInTheDocument());

    trigger.focus();
    await userEvent.keyboard(' ');
    expect(screen.getByText('Account Info')).toBeVisible();
  });

  it('"Account Info" navigates to /account-info and closes the menu', async () => {
    const { open } = setup();
    await open();
    await userEvent.click(screen.getByText('Account Info'));
    expect(mockNavigate).toHaveBeenCalledWith('/account-info');
    await waitFor(() => expect(screen.queryByText('Account Info')).not.toBeInTheDocument());
  });

  it('calls logout and navigates to /login', async () => {
    const auth = authState();
    mockUseAuth.mockReturnValue(auth);
    const { open } = setup();
    await open();
    await userEvent.click(screen.getByText('Logout'));
    expect(auth.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    await waitFor(() => expect(screen.queryByText('Logout')).not.toBeInTheDocument());
  });

  it('sets data-state="open" on trigger when menu is open', async () => {
    const { trigger, open } = setup();
    expect(trigger).not.toHaveAttribute('data-state', 'open');
    await open();
    expect(trigger).toHaveAttribute('data-state', 'open');
  });
});