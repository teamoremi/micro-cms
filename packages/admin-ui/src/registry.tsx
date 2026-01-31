import React from 'react';
import { Field, FieldType } from '@micro-cms/types';

export interface FieldComponentProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export type FieldComponent = React.ComponentType<FieldComponentProps>;

class Registry {
  private components: Map<string, FieldComponent> = new Map();

  register(type: FieldType | string, component: FieldComponent) {
    this.components.set(type, component);
  }

  get(type: string): FieldComponent | undefined {
    return this.components.get(type);
  }
}

export const ComponentRegistry = new Registry();

// Default Components (Fallbacks)
export const DefaultTextInput: FieldComponent = ({ field, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{field.label || field.name}</label>
    <input
      className="border rounded px-2 py-1"
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={field.constraints?.required}
    />
  </div>
);

export const DefaultNumberInput: FieldComponent = ({ field, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{field.label || field.name}</label>
    <input
      className="border rounded px-2 py-1"
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export const DefaultBooleanInput: FieldComponent = ({ field, value, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label className="text-sm font-medium">{field.label || field.name}</label>
  </div>
);

// Register defaults
ComponentRegistry.register('text', DefaultTextInput);
ComponentRegistry.register('number', DefaultNumberInput);
ComponentRegistry.register('boolean', DefaultBooleanInput);
