import * as React from 'react';
import { createPortal } from 'react-dom';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import { twMerge } from 'tailwind-merge';

export type FormDropdownOption = {
  value: string | number;
  label: string;
};

type FormDropdownProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  options: readonly FormDropdownOption[];
};

const fieldLabelClassName =
  'mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-table-head-text) opacity-60';

const triggerClassName = twMerge(
  'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all outline-none',
  'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
  'focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft)',
  'dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
);

export const FormDropdown = React.forwardRef<
  HTMLSelectElement,
  FormDropdownProps
>(
  (
    {
      id,
      label,
      error = false,
      errorMessage,
      className,
      options,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      String(defaultValue ?? '')
    );
    const stringValue = isControlled
      ? String(value ?? '')
      : uncontrolledValue;

    const updateMenuPosition = React.useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuMaxHeight = 256;
      const openUpward = spaceBelow < menuMaxHeight && rect.top > spaceBelow;

      setMenuStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        maxHeight: menuMaxHeight,
        zIndex: 80,
        ...(openUpward
          ? { bottom: window.innerHeight - rect.top + 8 }
          : { top: rect.bottom + 8 }),
      });
    }, []);

    React.useEffect(() => {
      if (!open) return;

      updateMenuPosition();

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          rootRef.current?.contains(target) ||
          (target instanceof Element &&
            target.closest('[data-form-dropdown-menu="true"]'))
        ) {
          return;
        }
        setOpen(false);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false);
      };

      const handleReposition = () => updateMenuPosition();

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleReposition);
      window.addEventListener('scroll', handleReposition, true);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleReposition);
        window.removeEventListener('scroll', handleReposition, true);
      };
    }, [open, updateMenuPosition]);

    const selectedOption = options.find(
      (option) => String(option.value) === stringValue
    );
    const displayLabel = selectedOption?.label ?? '';

    const emitChange = (nextValue: string) => {
      if (!isControlled) setUncontrolledValue(nextValue);

      onChange?.({
        target: { value: nextValue, name: name ?? '' },
        currentTarget: { value: nextValue, name: name ?? '' },
      } as React.ChangeEvent<HTMLSelectElement>);
    };

    const triggerId = id ? `${id}-trigger` : undefined;

    const menu =
      open && !disabled
        ? createPortal(
            <ul
              role="listbox"
              data-form-dropdown-menu="true"
              aria-labelledby={triggerId}
              style={menuStyle}
              className="overflow-y-auto rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] dark:bg-(--color-table-surface) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)]"
            >
              {options.map((option) => {
                const optionValue = String(option.value);
                const isSelected = stringValue === optionValue;

                return (
                  <li key={optionValue}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        emitChange(optionValue);
                        setOpen(false);
                      }}
                      className={twMerge(
                        'flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                        isSelected
                          ? 'bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_18%,transparent)] text-(--color-ink)'
                          : 'text-(--color-ink)/70 hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)] dark:text-(--color-ink)/70 dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null;

    return (
      <div ref={rootRef} className={twMerge('relative w-full', className)}>
        {label && (
          <label htmlFor={triggerId} className={fieldLabelClassName}>
            {label}
          </label>
        )}

        <button
          ref={triggerRef}
          type="button"
          id={triggerId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error || undefined}
          aria-label={
            ariaLabel ?? (typeof label === 'string' ? label : undefined)
          }
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev);
          }}
          onBlur={
            onBlur as unknown as React.FocusEventHandler<HTMLButtonElement>
          }
          className={twMerge(
            triggerClassName,
            open && 'ring-2 ring-(--color-primaryblue-soft)',
            error && 'ring-red-400 focus-visible:ring-red-400',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span
            className={twMerge(
              'truncate',
              stringValue
                ? 'text-(--color-ink)'
                : 'text-(--color-ink)/70'
            )}
          >
            {displayLabel || '—'}
          </span>
          <KeyboardArrowDownSharpIcon
            className={twMerge(
              'shrink-0 text-(--color-brand) opacity-80 transition-transform',
              open && 'rotate-180'
            )}
            sx={{ fontSize: 20 }}
          />
        </button>

        {menu}

        {/* Native select keeps FormData / RHF / tests working */}
        <select
          ref={ref}
          id={id}
          name={name}
          disabled={disabled}
          value={stringValue}
          aria-hidden
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            emitChange(event.target.value);
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && errorMessage && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

FormDropdown.displayName = 'FormDropdown';
