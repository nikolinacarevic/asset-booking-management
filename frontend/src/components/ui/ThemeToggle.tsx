import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../app/ThemeProvider';
import { Moon } from '../icons/Moon';
import { Sun } from '../icons/Sun';
import { useTranslation } from 'react-i18next';

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: Readonly<ThemeToggleProps>) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      data-testid="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={t('ui.themeToggle.ariaLabel')}
      aria-pressed={isDark}
      className={twMerge(
        'relative inline-flex h-10 w-26 items-center rounded-full bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_18%,transparent)] p-1 text-(--color-brand) shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] transition-colors outline-none hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_30%,transparent)] focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft)',
        'dark:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_16%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_14%,transparent)]',
        className
      )}
    >
      <span className="relative z-10 flex w-full items-center justify-between px-2">
        <Sun className="h-6 w-6" />
        <Moon className="h-6 w-6" />
      </span>

      <span
        aria-hidden="true"
        className={twMerge(
          'absolute top-1 left-1 h-8 w-12 rounded-full bg-white shadow transition-transform duration-300 ease-in-out',
          'dark:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)]',
          isDark && 'translate-x-12'
        )}
      />
    </button>
  );
}
