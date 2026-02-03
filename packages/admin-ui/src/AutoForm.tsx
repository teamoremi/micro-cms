import React, { useState, useEffect } from 'react';
import { Entity } from '@micro-cms/types';
import { ComponentRegistry, DefaultTextInput } from './registry';
import { injectStyles } from './index';

interface AutoFormProps {
  entity: Entity;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export const AutoForm: React.FC<AutoFormProps> = ({ entity, initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState<any>(initialData || {});

  useEffect(() => {
    injectStyles();
  }, []);

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
    <form onSubmit={handleSubmit} className="mcms-space-y-6">
      {entity.fields.map((field) => {
        const Component = ComponentRegistry.get(field.type) || DefaultTextInput;
        return (
          <div key={field.name} className="mcms-mb-2">
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
        className="mcms-px-4 mcms-py-2 mcms-bg-blue-600 mcms-text-white mcms-rounded hover:mcms-bg-blue-700 mcms-transition-colors"
      >
        Save {entity.name}
      </button>
    </form>
  );
};