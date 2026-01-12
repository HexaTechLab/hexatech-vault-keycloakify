import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  required?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({
  label,
  error,
  required = false,
  id,
  ...inputProps
}, ref) {
  const fieldId = id || inputProps.name || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="kc-form-group">
      <label htmlFor={fieldId} className={required ? 'required' : ''}>
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={error ? 'error' : ''}
        {...inputProps}
      />
      {error && (
        <div id={errorId} className="kc-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

export default FormField;
