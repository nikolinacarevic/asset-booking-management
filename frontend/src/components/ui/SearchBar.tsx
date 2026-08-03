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
          className="text-(--color-primaryblue) opacity-80 dark:text-[#98c5fb]"
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
          'h-11 w-full rounded-xl bg-white py-2 pr-3 pl-10 text-sm font-medium text-[#000d4d] shadow-sm ring-1 ring-[rgba(152,197,251,0.45)] transition-all outline-none',
          'placeholder:font-normal placeholder:text-(--color-table-text)/50',
          'hover:bg-[rgba(152,197,251,0.08)] hover:ring-[rgba(152,197,251,0.7)]',
          'focus-visible:ring-2 focus-visible:ring-[#98c5fb]',
          'dark:bg-(--color-table-surface) dark:text-[#98c5fb] dark:ring-[rgba(152,197,251,0.25)] dark:hover:bg-[rgba(152,197,251,0.1)]'
        )}
      />
    </div>
  );
};
