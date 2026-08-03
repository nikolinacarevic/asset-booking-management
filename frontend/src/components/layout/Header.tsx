import { twMerge } from 'tailwind-merge';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import { Layout, LayoutRow, LayoutColumn } from './Layout';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  className?: string;
  variant?: 'public' | 'app';
  brandClickable?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  variant = 'public',
  brandClickable = true,
}) => {
  const { t } = useTranslation();

  const brandClassName =
    'text-2xl font-bold tracking-tight text-(--color-primaryblue) md:text-3xl dark:text-[#93c5fd]';

  const brand = brandClickable ? (
    <Link to="/" className={brandClassName}>
      {t('layout.brand')}
    </Link>
  ) : (
    <span className={brandClassName}>{t('layout.brand')}</span>
  );

  const controls = (
    <>
      <div className="hidden gap-6 md:flex">
        <ThemeToggle />
        <LanguageSwitcher className="text-(--color-primaryblue) dark:text-[#93c5fd]" />
      </div>
      <div className="text-(--color-primaryblue) md:hidden dark:text-[#93c5fd]">
        <MobileMenu />
      </div>
    </>
  );

  return (
    <div
      className={twMerge(
        'fixed top-0 z-40 mx-auto h-20 w-full border-b border-(--color-border) bg-(--color-table-surface) text-(--color-primaryblue) shadow-md dark:text-[#93c5fd]',
        className
      )}
    >
      {/* Keep the public (auth) header centered, but align the app header with the left sidebar layout after login. */}
      {variant === 'app' ? (
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {brand}
          {controls}
        </div>
      ) : (
        <Layout className="h-full">
          <LayoutRow className="flex h-full items-center">
            <LayoutColumn className="flex items-center justify-between">
              {brand}
              {controls}
            </LayoutColumn>
          </LayoutRow>
        </Layout>
      )}
    </div>
  );
};
