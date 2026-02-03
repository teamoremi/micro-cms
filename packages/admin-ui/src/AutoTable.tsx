import React, { useEffect } from 'react';
import { Entity } from '@micro-cms/types';
import { injectStyles } from './index';

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
}

export const AutoTable: React.FC<AutoTableProps> = ({ 
  entity, 
  data, 
  onEdit, 
  onDelete,
  onPageChange,
  onLimitChange
}) => {
  useEffect(() => {
    injectStyles();
  }, []);

  const isPaginated = !Array.isArray(data) && data && 'total' in data;
  const items = isPaginated ? (data as PaginatedResponse).data : (data as any[]);
  const total = isPaginated ? (data as PaginatedResponse).total : items.length;
  const page = isPaginated ? (data as PaginatedResponse).page : 1;
  const limit = isPaginated ? (data as PaginatedResponse).limit : items.length;

  if (!items || items.length === 0) {
    return <div className="mcms-p-4 mcms-text-gray-500 mcms-text-center mcms-border mcms-rounded mcms-bg-white">No records found for {entity.name}</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mcms-space-y-4">
      <div className="mcms-overflow-x-auto mcms-border mcms-rounded mcms-bg-white mcms-shadow-sm">
        <table className="mcms-min-w-full mcms-divide-y mcms-divide-gray-200">
          <thead className="mcms-bg-gray-50">
            <tr>
              {entity.fields.map((field) => (
                <th
                  key={field.name}
                  className="mcms-px-6 mcms-py-3 mcms-text-left mcms-text-xs mcms-font-medium mcms-text-gray-500 mcms-uppercase mcms-tracking-wider"
                >
                  {field.label || field.name}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="mcms-px-6 mcms-py-3 mcms-text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="mcms-bg-white mcms-divide-y mcms-divide-gray-200">
            {items.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:mcms-bg-gray-50 mcms-transition-colors">
                {entity.fields.map((field) => (
                  <td key={field.name} className="mcms-px-6 mcms-py-4 mcms-whitespace-nowrap mcms-text-sm mcms-text-gray-900">
                    {typeof item[field.name] === 'boolean'
                      ? item[field.name] ? '✅' : '❌'
                      : String(item[field.name] ?? '-')}
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
            ))}
          </tbody>
        </table>
      </div>

      {isPaginated && (
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