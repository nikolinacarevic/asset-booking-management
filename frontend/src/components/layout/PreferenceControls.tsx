// External packages
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

// App
import { useTheme } from '../../app/ThemeProvider';
import { LANGUAGE_STORAGE_KEY } from '../../config/languageStorage';
import { languages, resolveLanguage } from '../ui/languages';

type Tone = 'shell' | 'surface';

type Props = {
  /** `shell` sits on the ink navigation surface, `surface` on regular panels. */
  tone?: Tone;
  className?: string;
};

const toneClasses: Record<
  Tone,
  {
    label: string;
    track: string;
    option: string;
    checked: string;
    select: string;
    focus: string;
  }
> = {
  shell: {
    label: 'text-(--color-shell-muted)',
    track: 'bg-(--color-shell-hover) ring-1 ring-(--color-shell-border)',
    option: 'text-(--color-shell-muted) hover:text-(--color-shell-text)',
    checked:
      'has-[:checked]:bg-(--color-shell-text) has-[:checked]:text-(--color-ink) dark:has-[:checked]:bg-(--color-shell-accent) dark:has-[:checked]:text-(--color-shell)',
    select:
      'bg-(--color-shell-hover) text-(--color-shell-text) ring-1 ring-(--color-shell-border) [&>option]:text-black',
    focus: 'has-[:focus-visible]:outline-(color:--color-shell-accent)',
  },
  surface: {
    label: 'text-(--color-modal-label)',
    track: 'bg-(--color-surface) ring-1 ring-(--color-border)',
    option: 'text-(--color-table-text) hover:text-(--color-ink)',
    checked:
      'has-[:checked]:bg-(--color-primaryblue) has-[:checked]:text-white dark:has-[:checked]:bg-(--color-primaryblue-soft) dark:has-[:checked]:text-(--color-surface)',
    select:
      'bg-(--color-table-surface) text-(--color-table-text) ring-1 ring-(--color-border)',
    focus: 'has-[:focus-visible]:outline-(color:--color-brand)',
  },
};

/**
 * Theme and language are secondary, global preferences, so they live in the
 * account surface (desktop account menu, mobile drawer) rather than the
 * persistent header. Native radios/select give keyboard support for free.
 */
export function PreferenceControls({
  tone = 'surface',
  className,
}: Readonly<Props>) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const languageId = useId();
  const themeName = useId();
  const classes = toneClasses[tone];
  const currentLanguage = resolveLanguage(i18n.language)?.code ?? 'en';

  const handleLanguageChange = (code: string) => {
    void i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  const themeOptions = [
    {
      value: 'light',
      label: t('layout.accountMenu.light'),
      Icon: LightModeOutlinedIcon,
    },
    {
      value: 'dark',
      label: t('layout.accountMenu.dark'),
      Icon: DarkModeOutlinedIcon,
    },
  ] as const;

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <fieldset className="flex flex-col gap-1.5">
        <legend
          className={twMerge('mb-1.5 text-xs font-medium', classes.label)}
        >
          {t('layout.accountMenu.theme')}
        </legend>
        <div
          className={twMerge(
            'grid grid-cols-2 gap-1 rounded-lg p-1',
            classes.track
          )}
        >
          {themeOptions.map(({ value, label, Icon }) => (
            <label
              key={value}
              className={twMerge(
                'flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium transition-colors',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-solid',
                classes.option,
                classes.checked,
                classes.focus
              )}
            >
              <input
                type="radio"
                name={themeName}
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
                className="sr-only"
              />
              <Icon aria-hidden sx={{ fontSize: 18 }} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={languageId}
          className={twMerge('text-xs font-medium', classes.label)}
        >
          {t('layout.accountMenu.language')}
        </label>
        <select
          id={languageId}
          value={currentLanguage}
          onChange={(event) => handleLanguageChange(event.target.value)}
          className={twMerge(
            'min-h-10 w-full cursor-pointer rounded-lg px-3 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
            tone === 'shell'
              ? 'focus-visible:outline-(color:--color-shell-accent)'
              : 'focus-visible:outline-(color:--color-brand)',
            classes.select
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
