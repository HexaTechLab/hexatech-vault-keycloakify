import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';
import FormField from '../components/FormField';

interface LoginUpdatePasswordProps {
  kcContext: KcContext & { pageId: 'login-update-password.ftl' };
  i18n: I18n;
}

const IcoCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
  </svg>
);

export default function LoginUpdatePassword({ kcContext, i18n }: LoginUpdatePasswordProps) {
  const { url, message, messagesPerField, isAppInitiatedAction } = kcContext;
  const { msg } = i18n;
  const hasFieldError = messagesPerField.existsError('password', 'password-confirm');

  return (
    <AuthCardPage title={msg('updatePasswordTitle')} message={hasFieldError ? undefined : message}>
      <form id="kc-passwd-update-form" className="auth-form" action={url.loginAction} method="post">
        <FormField
          type="password"
          name="password-new"
          label={msg('passwordNew')}
          autoComplete="new-password"
          autoFocus
          required
          icon="lock"
          error={messagesPerField.existsError('password') ? messagesPerField.get('password') : undefined}
        />
        <FormField
          type="password"
          name="password-confirm"
          label={msg('passwordConfirm')}
          autoComplete="new-password"
          required
          icon="lock"
          error={messagesPerField.existsError('password-confirm') ? messagesPerField.get('password-confirm') : undefined}
        />
        <label className="auth-check">
          <input type="checkbox" name="logout-sessions" value="on" defaultChecked />
          <span className="auth-check-box"><IcoCheck /></span>
          <span>{msg('logoutOtherSessions')}</span>
        </label>
        <button type="submit" className="auth-cta">{msg('doSubmit')}</button>
        {isAppInitiatedAction && (
          <button type="submit" name="cancel-aia" value="true" className="auth-btn-ghost">{msg('doCancel')}</button>
        )}
      </form>
    </AuthCardPage>
  );
}
