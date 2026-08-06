import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { IconButton } from './IconButton';

type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md';
  error?: boolean;
  errorMessage?: string;
};

export const formFieldLabelClassName =
  'mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-(--color-table-head-text) opacity-60';

const fieldClassName =
  'w-full rounded-lg border border-(--color-border) bg-(--color-table-surface) px-3.5 py-2.5 text-sm font-medium text-(--color-text) outline-none transition duration-100 placeholder:text-(--color-modal-label) focus:border-(--color-primaryblue) focus:ring-2 focus:ring-(--color-primaryblue)/15';

const BULLET = '•';
const REVEAL_MS = 900;

function maskPassword(password: string, revealLast: boolean): string {
  if (!password) return '';
  if (revealLast) {
    return BULLET.repeat(password.length - 1) + password.slice(-1);
  }
  return BULLET.repeat(password.length);
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      size = 'md',
      error = false,
      errorMessage,
      className,
      type = 'text',
      value,
      defaultValue,
      onChange,
      name,
      ...props
    },
    ref
  ) => {
    if (type !== 'password') {
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={id} className={formFieldLabelClassName}>
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            aria-invalid={error || undefined}
            className={twMerge(
              fieldClassName,
              size === 'sm' && 'px-3 py-2 text-xs',
              size === 'md' && 'px-3.5 py-2.5 text-sm',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {error && errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      );
    }

    return (
      <PasswordInput
        id={id}
        label={label}
        size={size}
        error={error}
        errorMessage={errorMessage}
        className={className}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        inputRef={ref}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

type PasswordInputProps = Omit<FormInputProps, 'type' | 'size'> & {
  size?: 'sm' | 'md';
  inputRef: React.ForwardedRef<HTMLInputElement>;
};

function PasswordInput({
  id,
  label,
  size = 'md',
  error = false,
  errorMessage,
  className,
  value: valueProp,
  defaultValue,
  onChange,
  name,
  inputRef,
  disabled,
  autoComplete,
  ...props
}: PasswordInputProps) {
  const { t } = useTranslation();
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    String(defaultValue ?? '')
  );
  const [visible, setVisible] = React.useState(false);
  const [revealLast, setRevealLast] = React.useState(false);
  const revealTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const password = isControlled ? String(valueProp ?? '') : uncontrolledValue;

  const clearRevealTimeout = () => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  };

  React.useEffect(() => clearRevealTimeout, []);

  const scheduleRevealClear = () => {
    clearRevealTimeout();
    revealTimeoutRef.current = setTimeout(() => {
      setRevealLast(false);
      revealTimeoutRef.current = null;
    }, REVEAL_MS);
  };

  const emitChange = (next: string) => {
    if (!onChange) return;
    const event = {
      target: { value: next, name: name ?? '' },
      currentTarget: { value: next, name: name ?? '' },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const updatePassword = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    emitChange(next);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (visible) {
      updatePassword(event.target.value);
      setRevealLast(false);
      clearRevealTimeout();
      return;
    }

    const nextDisplay = event.target.value;
    const previousDisplay = maskPassword(password, revealLast);

    if (nextDisplay.length === 0) {
      updatePassword('');
      setRevealLast(false);
      clearRevealTimeout();
      return;
    }

    if (nextDisplay.length < previousDisplay.length) {
      updatePassword(password.slice(0, nextDisplay.length));
      setRevealLast(false);
      clearRevealTimeout();
      return;
    }

    if (nextDisplay.length > previousDisplay.length) {
      const addedCount = nextDisplay.length - previousDisplay.length;
      const added = nextDisplay.slice(-addedCount);
      updatePassword(password + added);
      setRevealLast(true);
      scheduleRevealClear();
      return;
    }

    // Same length: treat as replacing the last character (common on mobile).
    updatePassword(password.slice(0, -1) + nextDisplay.slice(-1));
    setRevealLast(true);
    scheduleRevealClear();
  };

  const displayValue = visible ? password : maskPassword(password, revealLast);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={formFieldLabelClassName}>
          {label}
        </label>
      )}
      <div className="relative">
        <input type="hidden" name={name} value={password} disabled={disabled} />
        <input
          {...props}
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={error || undefined}
          spellCheck={false}
          className={twMerge(
            fieldClassName,
            'pr-12',
            size === 'sm' && 'px-3 py-2 text-xs',
            size === 'md' && 'px-3.5 py-2.5 text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
        />
        <IconButton
          type="button"
          size="sm"
          disabled={disabled}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-(--color-modal-label)"
          aria-label={visible ? t('ui.password.hide') : t('ui.password.show')}
          aria-pressed={visible}
          onClick={() => {
            setVisible((current) => !current);
            setRevealLast(false);
            clearRevealTimeout();
          }}
        >
          {visible ? (
            <VisibilityOffOutlinedIcon fontSize="small" />
          ) : (
            <VisibilityOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </div>
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
