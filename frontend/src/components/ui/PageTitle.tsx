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
        'flex items-center gap-3 text-3xl font-bold tracking-tight text-[#000d4d] dark:text-[#4d8ad4]',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="h-7 w-1 shrink-0 rounded-full bg-[#000d4d] dark:bg-[#4d8ad4]"
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
        'h-px w-full bg-[rgba(152,197,251,0.2)] dark:bg-[rgba(152,197,251,0.1)]',
        className
      )}
    />
  );
}
