// External packages
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type Props = {
  tone?: 'shell' | 'surface';
  className?: string;
  onNavigate?: () => void;
};

/** Product name linking to the app home. */
export function Brand({
  tone = 'surface',
  className,
  onNavigate,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const onShell = tone === 'shell';

  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label={t('layout.navbar.home')}
      className={twMerge(
        'inline-flex items-center rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid',
        onShell
          ? 'focus-visible:outline-(color:--color-shell-accent)'
          : 'focus-visible:outline-(color:--color-brand)',
        className
      )}
    >
      <span
        aria-hidden
        className={twMerge(
          'text-base leading-none font-semibold tracking-tight',
          onShell ? 'text-(--color-shell-text)' : 'text-(--color-ink)'
        )}
      >
        {t('layout.brand')}
      </span>
    </Link>
  );
}
