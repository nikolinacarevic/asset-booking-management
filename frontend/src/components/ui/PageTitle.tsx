import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className }: Readonly<PageTitleProps>) {
  return (
    <h1
      className={twMerge(
        'flex items-center gap-3 text-3xl font-bold tracking-tight text-(--color-ink)',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="h-7 w-1 shrink-0 rounded-full bg-(--color-ink)"
      />
      <span className="min-w-0 leading-tight">{children}</span>
    </h1>
  );
}

type PageTitleDividerProps = {
  className?: string;
};

export function PageTitleDivider({ className }: Readonly<PageTitleDividerProps>) {
  return (
    <div
      className={twMerge(
        'h-px w-full bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_20%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
        className
      )}
    />
  );
}
