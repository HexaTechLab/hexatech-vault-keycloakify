import { useEffect, useRef, FormEvent } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import FormField from '../components/FormField';
import SsoButtons from '../components/SsoButtons';
import logo from '../../shared/assets/logo.svg';

interface LoginProps {
  kcContext: KcContext & { pageId: 'login.ftl' };
  i18n: I18n;
}

export default function Login({ kcContext, i18n }: LoginProps) {
  const { url, realm, usernameHidden, login, message, registrationDisabled } = kcContext;
  const { msg } = i18n;

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus first input field
    if (!usernameHidden && usernameInputRef.current) {
      usernameInputRef.current.focus();
    } else if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [usernameHidden]);

  const handleSubmit = (_e: FormEvent<HTMLFormElement>) => {
    // Let Keycloak handle the submission
    // Just prevent default if needed for validation
  };

  return (
    <div className="kc-page">
      <div className="kc-card">
        {/* Logo */}
        <div className="kc-logo">
          <img src={logo} alt="HexaTechVault Logo" />
        </div>

        {/* Header */}
        <div className="kc-header">
          <h1>{realm.displayName || 'HexaTechVault'}</h1>
          <p>Coffre-fort numérique sécurisé</p>
        </div>

        {/* Error/Info messages */}
        {message && (
          <div className={`kc-alert ${message.type === 'success' ? 'success' : ''}`} role="alert">
            {message.summary}
          </div>
        )}

        {/* Login form */}
        <form
          id="kc-form-login"
          className="kc-form"
          action={url.loginAction}
          method="post"
          onSubmit={handleSubmit}
        >
          {!usernameHidden && (
            <FormField
              ref={usernameInputRef}
              type="text"
              name="username"
              label={
                !realm.loginWithEmailAllowed
                  ? msg('username')
                  : !realm.registrationEmailAsUsername
                  ? msg('usernameOrEmail')
                  : msg('email')
              }
              defaultValue={login.username ?? ''}
              autoComplete="username"
              required
            />
          )}

          <FormField
            ref={passwordInputRef}
            type="password"
            name="password"
            label={msg('password')}
            autoComplete="current-password"
            required
          />

          {/* Remember me */}
          {realm.rememberMe && !usernameHidden && (
            <div className="kc-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                defaultChecked={login.rememberMe === 'on'}
              />
              <label htmlFor="rememberMe">{msg('rememberMe')}</label>
            </div>
          )}

          {/* Submit button */}
          <button type="submit" className="kc-button">
            {msg('doLogIn')}
          </button>

          {/* Links */}
          <div className="kc-form-links">
            {realm.resetPasswordAllowed && (
              <a href={url.loginResetCredentialsUrl} className="kc-link">
                {msg('doForgotPassword')}
              </a>
            )}
            {realm.registrationAllowed && !registrationDisabled && (
              <a href={url.registrationUrl} className="kc-link">
                {msg('doRegister')}
              </a>
            )}
          </div>
        </form>

        {/* SSO buttons */}
        <SsoButtons kcContext={kcContext} i18n={i18n} />

        {/* Footer */}
        <div className="kc-footer">
          En vous connectant, vous acceptez nos{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            politique de confidentialité
          </a>
          .
        </div>
      </div>
    </div>
  );
}
