import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  title?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  testId?: string;
  backdropTestId?: string;
};

const sizeClassName: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  ariaLabel,
  title,
  size = 'md',
  children,
  footer,
  headerRight,
  className,
  bodyClassName,
  testId,
  backdropTestId,
}) => {
  const { t } = useTranslation();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  // Remember the element that opened the modal and return focus to it once
  // the modal closes/unmounts (WCAG 2.4.3). Declared before the showModal
  // effect so it captures the trigger before focus moves into the dialog.
  React.useEffect(() => {
    if (!isOpen) return;
    const active = document.activeElement;
    // Ignore elements inside the dialog (StrictMode re-runs this effect
    // after focus has already moved in).
    if (active instanceof HTMLElement && !dialogRef.current?.contains(active)) {
      returnFocusRef.current = active;
    }

    return () => {
      const trigger = returnFocusRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isOpen]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // showModal() focuses the first focusable node, which is the
        // pointer-only backdrop. Move focus to the first tabbable control in
        // the panel instead (or the panel itself if it has none).
        const panel = panelRef.current;
        if (panel && !panel.contains(document.activeElement)) {
          const firstTabbable = panel.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          (firstTabbable ?? panel).focus();
        }
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof title === 'string' ? title : undefined) ??
    t('ui.modal.dialogAria');

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 flex h-full max-h-full w-full max-w-full items-center justify-center border-0 bg-transparent p-4 backdrop:bg-transparent sm:p-6"
      aria-label={resolvedAriaLabel}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        data-testid={backdropTestId}
        // Pointer-only affordance; keyboard users close with Escape. Keeping
        // it out of the tab order lets initial focus land on real content.
        tabIndex={-1}
        className="animate-overlay-in fixed inset-0 cursor-default bg-(--color-modal-overlay) backdrop-blur-[3px]"
        aria-label={t('ui.modal.closeAria')}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        data-testid={testId ?? 'modal-dialog'}
        className={twMerge(
          'animate-modal-in relative z-10 flex max-h-[min(95vh,900px)] w-full flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-table-surface) text-(--color-table-text) shadow-(--shadow-modal) outline-none',
          sizeClassName[size],
          className
        )}
      >
        {(title != null || headerRight != null) && (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-(--color-modal-divider) bg-(--color-modal-header) px-6 py-5 sm:px-8">
            {title != null ? (
              <div className="min-w-0 flex-1 [&_h2]:tracking-tight">{title}</div>
            ) : (
              <div className="min-w-0 flex-1" />
            )}
            {headerRight != null && (
              <div className="flex shrink-0 items-center gap-2 pt-0.5">
                {headerRight}
              </div>
            )}
          </div>
        )}

        <div
          className={twMerge(
            'min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7',
            bodyClassName
          )}
        >
          {children}
        </div>

        {footer != null && (
          <div className="shrink-0 border-t border-(--color-modal-divider) bg-(--color-modal-header) px-6 py-4 sm:px-8 sm:py-5">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
};
