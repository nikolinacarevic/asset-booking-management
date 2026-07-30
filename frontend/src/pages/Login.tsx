// Components
import { Layout, LayoutRow, LayoutColumn } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { HeaderHero } from '../components/layout/HeaderHero';
import LoginForm from '../features/auth/components/LoginForm';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();

  return (
    <>
      <Header className="hidden md:flex" />
      <Layout>
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
    </>
  );
}
