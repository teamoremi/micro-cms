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
  <div className="mcms-flex mcms-flex-col mcms-gap-1">
    <label className="mcms-text-sm mcms-font-medium">{field.label || field.name}</label>
    <input
      className="mcms-border mcms-rounded mcms-px-2 mcms-py-1"
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={field.constraints?.required}
    />
  </div>
);

export const DefaultNumberInput: FieldComponent = ({ field, value, onChange }) => (
  <div className="mcms-flex mcms-flex-col mcms-gap-1">
    <label className="mcms-text-sm mcms-font-medium">{field.label || field.name}</label>
    <input
      className="mcms-border mcms-rounded mcms-px-2 mcms-py-1"
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export const DefaultBooleanInput: FieldComponent = ({ field, value, onChange }) => (
  <div className="mcms-flex mcms-items-center mcms-gap-2">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label className="mcms-text-sm mcms-font-medium">{field.label || field.name}</label>
  </div>
);

// Register defaults
ComponentRegistry.register('text', DefaultTextInput);
ComponentRegistry.register('number', DefaultNumberInput);
ComponentRegistry.register('boolean', DefaultBooleanInput);
