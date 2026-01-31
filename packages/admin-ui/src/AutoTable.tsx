import React from 'react';
import { Entity } from '@micro-cms/types';

interface AutoTableProps {
  entity: Entity;
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export const AutoTable: React.FC<AutoTableProps> = ({ entity, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-gray-500">No records found for {entity.name}</div>;
  }

  return (
    <div className="overflow-x-auto border rounded">
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
          {data.map((item, idx) => (
            <tr key={item.id || idx}>
              {entity.fields.map((field) => (
                <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {typeof item[field.name] === 'boolean'
                    ? item[field.name] ? 'Yes' : 'No'
                    : String(item[field.name])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
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
  );
};
