// Components
import { Brand } from './Brand';
import MobileMenu from './MobileMenu';

/**
 * Slim top bar shown below the lg breakpoint, where the navigation rail is
 * collapsed into the MobileMenu drawer. Carries only what helps navigation.
 */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-(--color-border) bg-(--color-table-surface) px-4 md:px-6 lg:hidden">
      <MobileMenu />
      <Brand />
    </header>
  );
}
