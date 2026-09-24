// Components
import { Layout, LayoutRow, LayoutColumn } from '../components/layout/Layout';
import { HeaderHero } from '../components/layout/HeaderHero';
import { Header } from '../components/layout/Header';
import RegisterForm from '../features/auth/components/RegisterForm';

export default function Register() {
  return (
    <>
      <Header className="hidden md:flex" />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
      >
        <Layout>
          <LayoutRow>
            <LayoutColumn
              lgSpan={6}
              className="hidden min-h-screen items-center justify-center pt-20 lg:flex lg:flex-col"
            >
              <HeaderHero />
            </LayoutColumn>
            <LayoutColumn
              lgSpan={6}
              lgOffset={0}
              smOffset={2}
              smSpan={8}
              className="flex min-h-screen flex-col items-center justify-center md:pt-20"
            >
              <RegisterForm />
            </LayoutColumn>
          </LayoutRow>
        </Layout>
      </main>
    </>
  );
}
