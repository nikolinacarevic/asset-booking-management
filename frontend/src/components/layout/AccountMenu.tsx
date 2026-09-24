// External packages
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

// Components
import { PreferenceControls } from './PreferenceControls';
import { shellFocusRing } from './SidebarNav';

// Types
import type { UserDto } from '../../features/user/types';
import { getFullName } from '../../features/user/utils/users';

type Props = {
  user: Pick<UserDto, 'name' | 'surname' | 'email'>;
  role?: string;
  onLogout: () => void;
};

function getInitials(user: Pick<UserDto, 'name' | 'surname'>) {
  return `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase();
}

export function Avatar({
  user,
  className,
}: Readonly<{ user: Pick<UserDto, 'name' | 'surname'>; className?: string }>) {
  return (
    <span
      aria-hidden
      className={twMerge(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-(--color-shell-accent) text-sm font-bold text-(--color-ink) dark:text-(--color-shell)',
        className
      )}
    >
      {getInitials(user)}
    </span>
  );
}

const menuRowClassName =
  'flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium text-(--color-table-text) transition-colors outline-none hover:bg-(--color-surface-hover) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(color:--color-brand)';

/**
 * Account surface at the foot of the navigation rail: identity, account
 * details, theme/language preferences and log out.
 */
export function AccountMenu({ user, role, onLogout }: Readonly<Props>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const fullName = getFullName(user);
  const roleLabel = role
    ? t(`users.roles.${role}`, { defaultValue: role })
    : '';

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={twMerge(
            'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-(--color-shell-hover) data-[state=open]:bg-(--color-shell-active)',
            shellFocusRing
          )}
        >
          <Avatar user={user} />
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-semibold text-(--color-shell-text)">
              {fullName}
            </span>
            {roleLabel && (
              <span className="truncate text-xs text-(--color-shell-muted)">
                {roleLabel}
              </span>
            )}
          </span>
          <span className="sr-only">{t('layout.accountMenu.trigger')}</span>
          <UnfoldMoreIcon
            aria-hidden
            className="shrink-0 text-(--color-shell-muted)"
            fontSize="small"
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          className="animate-overlay-in z-50 w-(--radix-popover-trigger-width) min-w-64 rounded-xl border border-(--color-border) bg-(--color-table-surface) p-2 text-(--color-table-text) shadow-(--shadow-modal) outline-none"
        >
          <div className="px-3 pt-2 pb-3">
            <p className="truncate text-sm font-semibold">{fullName}</p>
            {user.email && (
              <p className="truncate text-xs text-(--color-modal-label)">
                {user.email}
              </p>
            )}
          </div>

          <Link
            to="/account-info"
            onClick={() => setOpen(false)}
            className={menuRowClassName}
          >
            <ManageAccountsOutlinedIcon aria-hidden fontSize="small" />
            {t('layout.accountMenu.accountDetails')}
          </Link>

          <PreferenceControls
            tone="surface"
            className="my-2 border-y border-(--color-border) px-3 py-4"
          />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className={menuRowClassName}
          >
            <LogoutSharpIcon aria-hidden fontSize="small" />
            {t('layout.navbar.logout')}
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
