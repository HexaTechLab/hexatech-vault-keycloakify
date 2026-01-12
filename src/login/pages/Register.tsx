import { useEffect, useRef, FormEvent, useState } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import FormField from '../components/FormField';
import logo from '../../shared/assets/logo.svg';

interface RegisterProps {
  kcContext: KcContext & { pageId: 'register.ftl' };
  i18n: I18n;
}

export default function Register({ kcContext, i18n }: RegisterProps) {
  const { url, realm, register, message, passwordRequired } = kcContext;
  const { msg } = i18n;

  const [termsAccepted, setTermsAccepted] = useState(false);

  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus first name field
    firstNameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!termsAccepted) {
      e.preventDefault();
      alert(msg('requiredField'));
    }
  };

  // Get terms and privacy URLs from theme properties or use defaults
  const termsUrl = (kcContext as any).properties?.termsUrl || '/terms';
  const privacyUrl = (kcContext as any).properties?.privacyUrl || '/privacy';

  return (
    <div className="kc-page">
      <div className="kc-card">
        {/* Logo */}
        <div className="kc-logo">
          <img src={logo} alt="HexaTechVault Logo" />
        </div>

        {/* Header */}
        <div className="kc-header">
          <h1>{msg('doRegisterTitle')}</h1>
          <p>Créez votre compte sécurisé</p>
        </div>

        {/* Error/Info messages */}
        {message && (
          <div className={`kc-alert ${message.type === 'success' ? 'success' : ''}`} role="alert">
            {message.summary}
          </div>
        )}

        {/* Register form */}
        <form
          id="kc-form-register"
          className="kc-form"
          action={url.registrationAction}
          method="post"
          onSubmit={handleSubmit}
        >
          <FormField
            ref={firstNameInputRef}
            type="text"
            name="firstName"
            label={msg('firstName')}
            defaultValue={register.formData?.firstName ?? ''}
            autoComplete="given-name"
            required
          />

          <FormField
            type="text"
            name="lastName"
            label={msg('lastName')}
            defaultValue={register.formData?.lastName ?? ''}
            autoComplete="family-name"
            required
          />

          <FormField
            type="email"
            name="email"
            label={msg('email')}
            defaultValue={register.formData?.email ?? ''}
            autoComplete="email"
            required
          />

          {!realm.registrationEmailAsUsername && (
            <FormField
              type="text"
              name="username"
              label={msg('username')}
              defaultValue={register.formData?.username ?? ''}
              autoComplete="username"
              required
            />
          )}

          {passwordRequired && (
            <>
              <FormField
                type="password"
                name="password"
                label={msg('password')}
                autoComplete="new-password"
                required
              />

              <FormField
                type="password"
                name="password-confirm"
                label={msg('confirmPassword')}
                autoComplete="new-password"
                required
              />
            </>
          )}

          {/* Terms acceptance */}
          <div className="kc-checkbox" style={{ marginTop: 'var(--spacing-md)' }}>
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="termsAccepted">
              J'accepte les{' '}
              <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="kc-link">
                Conditions Générales d'Utilisation
              </a>{' '}
              et la{' '}
              <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="kc-link">
                Politique de confidentialité
              </a>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="kc-button"
            disabled={!termsAccepted}
            style={{ marginTop: 'var(--spacing-lg)' }}
          >
            {msg('doRegisterTitle')}
          </button>

          {/* Link to login */}
          <div className="kc-form-links" style={{ marginTop: 'var(--spacing-md)' }}>
            <a href={url.loginUrl} className="kc-link">
              {msg('alreadyHaveAccount')} {msg('doSignIn')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
