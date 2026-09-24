// External packages
import { useId } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

// Components
import { ApprovalsPendingIndicator } from './ApprovalsPendingIndicator';
import { isNavItemActive, useNavGroups, type NavGroup } from './navItems';

/** Shared focus ring for controls sitting on the ink-coloured shell. */
export const shellFocusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(color:--color-shell-accent)';

const linkBase = twMerge(
  'relative flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-[0.9375rem] leading-snug transition-colors duration-150',
  shellFocusRing
);

const activeLink =
  'border-(--color-shell-border) bg-(--color-shell-active) font-semibold text-(--color-shell-text) before:absolute before:inset-y-2.5 before:-left-px before:w-[3px] before:rounded-full before:bg-(--color-shell-accent)';

const inactiveLink =
  'border-transparent font-medium text-(--color-shell-muted) hover:bg-(--color-shell-hover) hover:text-(--color-shell-text)';

type Props = {
  className?: string;
  /** Called after a link is activated (the mobile drawer uses it to close). */
  onNavigate?: () => void;
};

function NavGroupList({
  group,
  pathname,
  onNavigate,
}: Readonly<{ group: NavGroup; pathname: string; onNavigate?: () => void }>) {
  const headingId = useId();

  return (
    <div className="flex flex-col gap-1">
      {group.label && (
        <h2
          id={headingId}
          className="px-3 pt-5 pb-1.5 text-xs font-medium text-(--color-shell-muted)"
        >
          {group.label}
        </h2>
      )}
      <ul
        className="flex flex-col gap-1"
        aria-labelledby={group.label ? headingId : undefined}
      >
        {group.items.map((item) => {
          const active = isNavItemActive(item, pathname);
          const Icon = item.icon;

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
                className={twMerge(
                  linkBase,
                  active ? activeLink : inactiveLink
                )}
              >
                <Icon
                  aria-hidden
                  className={twMerge(
                    'shrink-0',
                    active ? 'opacity-100' : 'opacity-80'
                  )}
                  fontSize="small"
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.showPendingCount && <ApprovalsPendingIndicator />}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SidebarNav({ className, onNavigate }: Readonly<Props>) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const groups = useNavGroups();

  return (
    <nav
      aria-label={t('layout.navbar.mainLabel')}
      className={twMerge('flex flex-col px-3', className)}
    >
      {groups.map((group) => (
        <NavGroupList
          key={group.id}
          group={group}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
