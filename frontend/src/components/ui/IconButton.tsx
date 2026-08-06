import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'neutral' | 'danger';
  size?: 'sm' | 'md';
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = 'neutral', size = 'md', className, type = 'button', ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(
          'inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'neutral' &&
          'text-(--color-table-text) hover:bg-(--color-surface-hover) hover:text-(--color-primaryblue)',
          variant === 'danger' &&
          'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300',
          size === 'sm' && 'p-1',
          size === 'md' && 'p-1.5',
          className
        )}
        {...rest}
      />
    );
  }
);

IconButton.displayName = 'IconButton';
