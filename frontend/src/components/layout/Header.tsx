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
}

export const Header: React.FC<HeaderProps> = ({
  className,
  variant = 'public',
}) => {
  const { t } = useTranslation();

  const brand = (
    <Link
      to="/"
      className="text-xl font-semibold tracking-tight text-(--color-text) md:text-2xl"
    >
      {t('layout.brand')}
    </Link>
  );

  return (
    <div
      className={twMerge(
        'fixed top-0 z-40 mx-auto h-20 w-full bg-(--color-surface) shadow-md',
        className
      )}
    >
      {/* Keep the public (auth) header centered, but align the app header with the left sidebar layout after login. */}
      {variant === 'app' ? (
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {brand}
          <div className="hidden gap-6 md:flex">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <MobileMenu />
        </div>
      ) : (
        <Layout className="h-full">
          <LayoutRow className="flex h-full items-center">
            <LayoutColumn className="flex items-center justify-between">
              {brand}
              <div className="hidden gap-6 md:flex">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <MobileMenu />
            </LayoutColumn>
          </LayoutRow>
        </Layout>
      )}
    </div>
  );
};
