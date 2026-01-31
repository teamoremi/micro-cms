import React, { useState, useEffect } from 'react';
import { Entity } from '@micro-cms/types';
import { ComponentRegistry, DefaultTextInput } from './registry';

interface AutoFormProps {
  entity: Entity;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export const AutoForm: React.FC<AutoFormProps> = ({ entity, initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState<any>(initialData);

  // Update form data if initialData changes
  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Create {entity.name}</h3>
      {entity.fields.map((field) => {
        const Component = ComponentRegistry.get(field.type) || DefaultTextInput;
        return (
          <div key={field.name} className="mb-2">
            <Component
              field={field}
              value={formData[field.name]}
              onChange={(val) => handleChange(field.name, val)}
            />
          </div>
        );
      })}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Save {entity.name}
      </button>
    </form>
  );
};
