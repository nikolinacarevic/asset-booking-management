import { useTranslation } from 'react-i18next';

/** Keyboard "skip navigation" link, visible only when focused (WCAG 2.4.1). */
export function SkipLink({
  targetId = 'main-content',
}: Readonly<{ targetId?: string }>) {
  const { t } = useTranslation();

  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-lg bg-(--color-primaryblue) text-sm font-medium text-white shadow-md outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-3 focus-visible:ring-2 focus-visible:ring-(--color-brand) focus-visible:ring-offset-2"
    >
      {t('layout.skipToContent')}
    </a>
  );
}
