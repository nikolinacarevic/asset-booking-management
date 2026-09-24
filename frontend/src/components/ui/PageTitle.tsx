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
        'min-w-0 text-3xl leading-tight font-bold tracking-tight text-(--color-ink)',
        className
      )}
    >
      {children}
    </h1>
  );
}

type PageTitleDividerProps = {
  className?: string;
};

export function PageTitleDivider({
  className,
}: Readonly<PageTitleDividerProps>) {
  return (
    <div
      className={twMerge(
        'h-px w-full bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_20%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]',
        className
      )}
    />
  );
}
