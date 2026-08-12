import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

export type TableColumn<T> = {
  key: React.Key;
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T, index: number) => React.Key;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  /** Below `md`, render stacked cards instead of a horizontally scrolling table. */
  mobileCards?: boolean;
};

const tableContainerClassName =
  'overflow-hidden rounded-lg border border-(--color-table-border) bg-(--color-table-surface) text-(--color-table-text) shadow-(--color-table-shadow)';

const tableClassName = 'min-w-full border-collapse text-left text-sm';

const tableHeadClassName =
  'border-b border-(--color-table-border) bg-(--color-table-head) text-(--color-table-head-text) text-xs uppercase tracking-[0.2em]';

const tableHeaderCellClassName = 'px-6 py-4 font-semibold';

const defaultTableRowClassName =
  'border-b border-(--color-table-row-border) transition-colors hover:bg-(--color-table-row-hover)';

const tableCellClassName = 'px-6 py-4 text-(--color-table-text)';

const mobileCardClassName =
  'rounded-lg border border-(--color-table-border) bg-(--color-table-surface) p-4 text-(--color-table-text) shadow-(--color-table-shadow) transition-colors';

const getCellContent = <T,>(column: TableColumn<T>, row: T, index: number) => {
  if (column.render) {
    return column.render(row, index);
  }

  if (column.accessor) {
    return row[column.accessor] as React.ReactNode;
  }

  return null;
};

const isLabeledColumn = <T,>(column: TableColumn<T>) =>
  typeof column.header === 'string' || typeof column.header === 'number';

const resolveRowClassName = <T,>(
  rowClassName: TableProps<T>['rowClassName'],
  row: T,
  index: number
) =>
  typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName;

export function Table<T>({
  data,
  columns,
  getRowKey,
  className,
  rowClassName,
  emptyMessage,
  onRowClick,
  mobileCards = false,
}: Readonly<TableProps<T>>) {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t('ui.table.emptyMessage');
  const fieldColumns = columns.filter(isLabeledColumn);
  const actionColumns = columns.filter((column) => !isLabeledColumn(column));

  const table = (
    <div
      className={twMerge(
        tableContainerClassName,
        mobileCards && 'hidden md:block',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className={tableClassName}>
          <thead className={tableHeadClassName}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={twMerge(
                    tableHeaderCellClassName,
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className={twMerge(
                    defaultTableRowClassName,
                    onRowClick && 'cursor-pointer',
                    resolveRowClassName(rowClassName, row, index)
                  )}
                  onClick={
                    onRowClick
                      ? () => {
                          onRowClick(row, index);
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={twMerge(
                        tableCellClassName,
                        column.cellClassName
                      )}
                    >
                      {getCellContent(column, row, index)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className={twMerge(
                    tableCellClassName,
                    'py-8 text-center text-(--color-table-head-text)'
                  )}
                >
                  {resolvedEmptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!mobileCards) {
    return table;
  }

  return (
    <>
      <div className={twMerge('md:hidden', className)}>
        {data.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {data.map((row, index) => {
              const actionNodes = actionColumns
                .map((column) => ({
                  key: column.key,
                  content: getCellContent(column, row, index),
                }))
                .filter(
                  ({ content }) => content != null && content !== false
                );

              return (
                <li key={getRowKey(row, index)}>
                  <div
                    className={twMerge(
                      mobileCardClassName,
                      onRowClick &&
                        'cursor-pointer hover:bg-(--color-table-row-hover)',
                      resolveRowClassName(rowClassName, row, index)
                    )}
                    onClick={
                      onRowClick
                        ? () => {
                            onRowClick(row, index);
                          }
                        : undefined
                    }
                  >
                    <dl className="flex flex-col gap-3">
                      {fieldColumns.map((column) => (
                        <div key={column.key}>
                          <dt className="text-[10px] font-semibold tracking-[0.22em] text-(--color-table-head-text) uppercase opacity-60">
                            {column.header}
                          </dt>
                          <dd
                            className={twMerge(
                              'mt-1 text-sm text-(--color-table-text)',
                              column.cellClassName
                            )}
                          >
                            {getCellContent(column, row, index)}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {actionNodes.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-(--color-table-row-border) pt-3">
                        {actionNodes.map(({ key, content }) => (
                          <div key={key}>{content}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className={twMerge(
              mobileCardClassName,
              'py-8 text-center text-sm text-(--color-table-head-text)'
            )}
          >
            {resolvedEmptyMessage}
          </div>
        )}
      </div>

      {table}
    </>
  );
}
