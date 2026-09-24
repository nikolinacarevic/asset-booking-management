// External packages
import DE from 'country-flag-icons/react/3x2/DE';
import GB from 'country-flag-icons/react/3x2/GB';
import HR from 'country-flag-icons/react/3x2/HR';

/** UI languages offered in the language pickers, with their flags. */
export const languages = [
  { code: 'hr', label: 'Hrvatski', Flag: HR },
  { code: 'en', label: 'English', Flag: GB },
  { code: 'de', label: 'Deutsch', Flag: DE },
] as const;

/** Maps an i18next language code (e.g. `en-GB`) to a supported language. */
export function resolveLanguage(code: string) {
  return (
    languages.find((lang) => lang.code === code) ??
    languages.find((lang) => code.startsWith(`${lang.code}-`)) ??
    languages.find((lang) => code.startsWith(lang.code))
  );
}
