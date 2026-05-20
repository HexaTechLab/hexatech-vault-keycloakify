import { InputHTMLAttributes, forwardRef, ReactNode, useState } from 'react';

const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>
  </svg>
);
const IcoLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </svg>
);
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="3.5"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
  </svg>
);
const IcoEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcoEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3 21 21"/>
    <path d="M10.6 6.1A10 10 0 0 1 12 6c7 0 10 6 10 6a16 16 0 0 1-3.1 3.9"/>
    <path d="M6.6 6.6A16 16 0 0 0 2 12s3 6 10 6c1.6 0 3-.3 4.3-.8"/>
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
  </svg>
);

const iconMap = { mail: <IcoMail />, lock: <IcoLock />, user: <IcoUser /> };

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  required?: boolean;
  icon?: 'mail' | 'lock' | 'user';
  rightLabel?: ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, required = false, icon, rightLabel, id, type, className, ...inputProps },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = id ?? inputProps.name ?? `field-${Math.random().toString(36).slice(2, 9)}`;
  const isPassword = type === 'password';
  const effectiveType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="auth-field">
      {label && (
        <div className={rightLabel ? 'auth-field-h' : undefined}>
          <label htmlFor={fieldId}>{label}</label>
          {rightLabel}
        </div>
      )}
      <div className="auth-input-wrap">
        {icon && <span className="auth-input-ico">{iconMap[icon]}</span>}
        <input
          ref={ref}
          id={fieldId}
          type={effectiveType}
          aria-required={required}
          aria-invalid={!!error}
          className={[
            'auth-input',
            !icon ? 'no-ico' : '',
            isPassword ? 'has-eye' : '',
            className ?? '',
          ].filter(Boolean).join(' ')}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-input-eye"
            onClick={() => setShowPassword(s => !s)}
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <IcoEyeOff /> : <IcoEye />}
          </button>
        )}
      </div>
      {error && <div className="auth-field-error" role="alert">{error}</div>}
    </div>
  );
});

export default FormField;
