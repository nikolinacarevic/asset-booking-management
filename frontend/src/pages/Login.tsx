// Components
import { Layout, LayoutRow, LayoutColumn } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { HeaderHero } from '../components/layout/HeaderHero';
import LoginForm from '../features/auth/components/LoginForm';
import { useTranslation } from 'react-i18next';

function LoginBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,197,253,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,51,168,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(147,197,253,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(147,197,253,0.06),transparent_50%)]" />

      <div className="absolute inset-0 opacity-[0.45] dark:opacity-[0.22] [background-image:repeating-linear-gradient(-28deg,transparent,transparent_46px,rgba(147,197,253,0.35)_46px,rgba(147,197,253,0.35)_47px)]" />

      <svg
        className="absolute -top-16 -right-10 h-[70%] w-[70%] text-[#93c5fd] opacity-50 dark:opacity-25"
        viewBox="0 0 800 800"
        fill="none"
      >
        <path
          d="M80 120C260 80 420 40 760 180"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M40 240C240 180 460 140 780 320"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.7"
        />
        <path
          d="M20 380C220 300 480 280 790 470"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="640" cy="160" r="90" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <circle cx="640" cy="160" r="150" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      </svg>

      <svg
        className="absolute -bottom-24 -left-16 h-[65%] w-[65%] text-[#93c5fd] opacity-40 dark:opacity-20"
        viewBox="0 0 800 800"
        fill="none"
      >
        <path
          d="M40 680C220 560 420 620 760 480"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 560C240 480 460 540 780 360"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.7"
        />
        <circle cx="180" cy="620" r="110" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LoginBackground />
      <Header className="hidden md:flex" brandClickable={false} />
      <Layout className="relative">
        <LayoutRow>
          <LayoutColumn
            lgSpan={6}
            className="hidden min-h-screen items-start justify-center pt-28 lg:flex lg:flex-col"
          >
            <HeaderHero />
          </LayoutColumn>
          <LayoutColumn
            lgSpan={6}
            lgOffset={0}
            smOffset={2}
            smSpan={8}
            className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:mb-0 md:pt-28"
          >
            <p className="mb-6 text-2xl font-bold tracking-tight text-(--color-primaryblue) md:hidden">
              {t('layout.brand')}
            </p>
            <LoginForm />
          </LayoutColumn>
        </LayoutRow>
      </Layout>
    </div>
  );
}
