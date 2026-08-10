// External packages
import { twMerge } from 'tailwind-merge';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import { useTranslation } from 'react-i18next';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <div className={twMerge('relative w-full', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3.5">
        <SearchSharpIcon
          className="text-(--color-brand) opacity-80"
          sx={{ fontSize: 20 }}
        />
      </div>
      <input
        data-testid="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('ui.search.byNamePlaceholder')}
        className={twMerge(
          'h-11 w-full rounded-xl bg-white py-2 pr-3 pl-10 text-sm font-medium text-(--color-ink) shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_45%,transparent)] transition-all outline-none',
          'placeholder:font-normal placeholder:text-(--color-table-text)/50',
          'hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_8%,transparent)] hover:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_70%,transparent)]',
          'focus-visible:ring-2 focus-visible:ring-(--color-primaryblue-soft)',
          'dark:bg-(--color-table-surface) dark:text-(--color-ink) dark:ring-[color-mix(in_srgb,var(--color-primaryblue-soft)_25%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-primaryblue-soft)_10%,transparent)]'
        )}
      />
    </div>
  );
};
