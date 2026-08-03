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
        'relative inline-flex h-10 w-26 items-center rounded-full bg-[rgba(152,197,251,0.18)] p-1 text-(--color-primaryblue) shadow-sm ring-1 ring-[rgba(152,197,251,0.25)] transition-colors outline-none hover:cursor-pointer hover:bg-[rgba(152,197,251,0.3)] focus-visible:ring-2 focus-visible:ring-[#98c5fb]',
        'dark:bg-[rgba(152,197,251,0.08)] dark:text-[#98c5fb] dark:ring-[rgba(152,197,251,0.16)] dark:hover:bg-[rgba(152,197,251,0.14)]',
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
          'dark:bg-[rgba(152,197,251,0.25)]',
          isDark && 'translate-x-12'
        )}
      />
    </button>
  );
}
