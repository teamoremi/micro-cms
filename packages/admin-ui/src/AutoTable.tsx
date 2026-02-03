import React, { useEffect, useState } from 'react';
import { Entity } from '@micro-cms/types';
import { injectStyles } from './index';
import moment from 'moment';

// Redeclare or use any to bypass persistent build issue with types package sync
interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface AutoTableProps {
  entity: Entity;
  data: any[] | PaginatedResponse;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  currentSort?: { field: string; direction: 'asc' | 'desc' };
}

export const AutoTable: React.FC<AutoTableProps> = ({ 
  entity, 
  data, 
  onEdit, 
  onDelete,
  onPageChange,
  onLimitChange,
  onSearch,
  onSort,
  currentSort
}) => {
  const [searchTerm, setSearchQuery] = useState('');

  useEffect(() => {
    injectStyles();
  }, []);

  const isPaginated = !Array.isArray(data) && data && 'total' in data;
  const items = isPaginated ? (data as PaginatedResponse).data : (data as any[]);
  const total = isPaginated ? (data as PaginatedResponse).total : items.length;
  const page = isPaginated ? (data as PaginatedResponse).page : 1;
  const limit = isPaginated ? (data as PaginatedResponse).limit : items.length;

  const totalPages = Math.ceil(total / limit);

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '-';
    if (type === 'boolean') return value ? '✅' : '❌';
    if (type === 'date' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
      return moment(value).format('MMM DD, YYYY HH:mm');
    }
    return String(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <div className="mcms-space-y-4">
      {/* Table Toolbar */}
      <div className="mcms-flex mcms-justify-between mcms-items-center mcms-gap-4">
        {onSearch && (
          <form onSubmit={handleSearchSubmit} className="mcms-flex mcms-flex-1 mcms-max-w-md mcms-gap-2">
            <input
              type="text"
              placeholder={`Search ${entity.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mcms-flex-1 mcms-px-4 mcms-py-2 mcms-border mcms-rounded-lg mcms-text-sm focus:mcms-ring-2 focus:mcms-ring-blue-500 mcms-outline-none"
            />
            <button 
              type="submit"
              className="mcms-px-4 mcms-py-2 mcms-bg-gray-100 mcms-text-gray-700 mcms-rounded-lg mcms-font-semibold mcms-text-sm hover:mcms-bg-gray-200 mcms-transition-all mcms-flex mcms-items-center mcms-gap-2"
            >
              <svg className="mcms-w-4 mcms-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="mcms-hidden md:mcms-inline">Search</span>
            </button>
          </form>
        )}
      </div>

      <div className="mcms-overflow-x-auto mcms-border mcms-rounded mcms-bg-white mcms-shadow-sm">
        <table className="mcms-min-w-full mcms-divide-y mcms-divide-gray-200">
          <thead className="mcms-bg-gray-50">
            <tr>
              {entity.fields.map((field) => (
                <th
                  key={field.name}
                  onClick={() => onSort?.(field.name, currentSort?.field === field.name && currentSort.direction === 'asc' ? 'desc' : 'asc')}
                  className={cn(
                    "mcms-px-6 mcms-py-3 mcms-text-left mcms-text-xs mcms-font-medium mcms-text-gray-500 mcms-uppercase mcms-tracking-wider",
                    onSort ? "mcms-cursor-pointer hover:mcms-bg-gray-100" : ""
                  )}
                >
                  <div className="mcms-flex mcms-items-center mcms-gap-1">
                    {field.label || field.name}
                    {onSort && currentSort?.field === field.name && (
                      <span className="mcms-text-blue-600">
                        {currentSort.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="mcms-px-6 mcms-py-3 mcms-text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="mcms-bg-white mcms-divide-y mcms-divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={entity.fields.length + 1} className="mcms-px-6 mcms-py-10 mcms-text-center mcms-text-gray-500">
                  No records found for {entity.name}
                </td>
              </tr>
            ) : (
              items.map((item: any, idx: number) => (
                <tr key={item.id || idx} className="hover:mcms-bg-gray-50 mcms-transition-colors">
                  {entity.fields.map((field) => (
                    <td key={field.name} className="mcms-px-6 mcms-py-4 mcms-whitespace-nowrap mcms-text-sm mcms-text-gray-900">
                      {formatValue(item[field.name], field.type)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="mcms-px-6 mcms-py-4 mcms-whitespace-nowrap mcms-text-right mcms-text-sm mcms-font-medium">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="mcms-text-blue-600 hover:mcms-text-blue-900 mcms-mr-4 mcms-font-semibold"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="mcms-text-red-600 hover:mcms-text-red-900 mcms-font-semibold"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isPaginated && total > 0 && (
        <div className="mcms-flex mcms-items-center mcms-justify-between mcms-px-4 mcms-py-3 mcms-bg-white mcms-border mcms-rounded mcms-shadow-sm">
          <div className="mcms-text-sm mcms-text-gray-700">
            Showing <span className="mcms-font-medium">{(page - 1) * limit + 1}</span> to <span className="mcms-font-medium">{Math.min(page * limit, total)}</span> of <span className="mcms-font-medium">{total}</span> results
          </div>
          <div className="mcms-flex mcms-gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="mcms-px-3 mcms-py-1 mcms-border mcms-rounded mcms-text-sm disabled:mcms-opacity-50 hover:mcms-bg-gray-50"
            >
              Previous
            </button>
            <div className="mcms-flex mcms-items-center mcms-px-2 mcms-text-sm">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="mcms-px-3 mcms-py-1 mcms-border mcms-rounded mcms-text-sm disabled:mcms-opacity-50 hover:mcms-bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal utility for class concatenation if not imported
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}