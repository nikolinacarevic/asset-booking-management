import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { MobileTopBar } from '../components/layout/MobileTopBar';
import { Footer } from '../components/layout/Footer';
import { SkipLink } from '../components/layout/SkipLink';

/**
 * Authenticated app shell:
 *
 *   lg and up                      below lg
 *   +--------+----------------+    +------------------------+
 *   |  rail  |  main          |    | [menu] brand  (header) |
 *   |  nav   |  (page)        |    +------------------------+
 *   |        |                |    |  main (page)           |
 *   | account|  footer        |    |  footer                |
 *   +--------+----------------+    +------------------------+
 *
 * The rail is sticky and full height; there is no persistent top header on
 * desktop. `.app-outlet` normalises the page column (see index.css).
 */
export default function App() {
  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen w-full">
        <Navbar />

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />

          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none"
          >
            <div className="app-outlet mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 md:px-8 lg:px-10">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
