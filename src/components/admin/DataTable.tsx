import { useState, type ReactNode } from 'react';
import SearchBar from '@/components/ui/SearchBar';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface ChipFilter<T> {
  label: string;
  value: string;
  test: (row: T) => boolean;
}

interface SelectFilter<T> {
  id: string;
  label: string;
  options: { label: string; value: string }[];
  test: (row: T, selectedValue: string) => boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  /** Custom search matcher (e.g. include related title text). */
  searchMatch?: (row: T, query: string) => boolean;
  filters?: ChipFilter<T>[];
  selectFilters?: SelectFilter<T>[];
  pageSize?: number;
  emptyMessage?: string;
  actions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  searchMatch,
  filters,
  selectFilters,
  pageSize = 6,
  emptyMessage = 'No records found.',
  actions,
  onRowClick,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((selectFilters ?? []).map((f) => [f.id, 'all'])),
  );
  const [page, setPage] = useState(1);

  const filtered = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (searchMatch
        ? searchMatch(row, q)
        : searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)));

    const active = filters?.find((f) => f.value === activeFilter);
    const matchesChip = !active || active.test(row);

    const matchesSelects = (selectFilters ?? []).every((sf) => {
      const selected = selectValues[sf.id] ?? 'all';
      if (selected === 'all') return true;
      return sf.test(row, selected);
    });

    return matchesQuery && matchesChip && matchesSelects;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              resetPage();
            }}
            placeholder={searchPlaceholder}
            className="sm:max-w-xs"
          />
          {filters && (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  resetPage();
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                All
              </button>
              {filters.map((f) => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => {
                    setActiveFilter(f.value);
                    resetPage();
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeFilter === f.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectFilters && selectFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectFilters.map((sf) => (
              <label key={sf.id} className="flex w-full items-center gap-2 sm:w-auto">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {sf.label}
                </span>
                <select
                  value={selectValues[sf.id] ?? 'all'}
                  onChange={(e) => {
                    setSelectValues((prev) => ({ ...prev, [sf.id]: e.target.value }));
                    resetPage();
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:flex-none"
                >
                  {sf.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/60 dark:border-slate-800/60 dark:bg-slate-900/40">
                {columns.map((c) => (
                  <th
                    key={String(c.key)}
                    className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 ${c.className ?? ''}`}
                  >
                    {c.label}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((c) => (
                      <td
                        key={String(c.key)}
                        className={`px-4 py-3.5 text-slate-700 dark:text-slate-200 ${c.className ?? ''}`}
                      >
                        {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3.5">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
