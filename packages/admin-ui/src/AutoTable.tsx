import React from 'react';
import { Entity } from '@micro-cms/types';

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
  const isPaginated = !Array.isArray(data) && data && 'total' in data;
  const items = isPaginated ? (data as PaginatedResponse).data : (data as any[]);
  const total = isPaginated ? (data as PaginatedResponse).total : items.length;
  const page = isPaginated ? (data as PaginatedResponse).page : 1;
  const limit = isPaginated ? (data as PaginatedResponse).limit : items.length;

  if (!items || items.length === 0) {
    return <div className="p-4 text-gray-500 text-center border rounded bg-white">No records found for {entity.name}</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {entity.fields.map((field) => (
                <th
                  key={field.name}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field.label || field.name}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                {entity.fields.map((field) => (
                  <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof item[field.name] === 'boolean'
                      ? item[field.name] ? '✅' : '❌'
                      : String(item[field.name] ?? '-')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900 font-semibold"
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
        <div className="flex items-center justify-between px-4 py-3 bg-white border rounded shadow-sm">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex items-center px-2 text-sm">
              Page {page} of {totalPages}
            </div>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
