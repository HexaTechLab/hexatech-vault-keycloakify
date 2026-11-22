import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';
import FormField from '../components/FormField';

interface LoginResetPasswordProps {
  kcContext: KcContext & { pageId: 'login-reset-password.ftl' };
  i18n: I18n;
}

export default function LoginResetPassword({ kcContext, i18n }: LoginResetPasswordProps) {
  const { url, realm, auth, message, messagesPerField } = kcContext;
  const { msg } = i18n;
  const hasFieldError = messagesPerField.existsError('username');

  return (
    <AuthCardPage title={msg('emailForgotTitle')} message={hasFieldError ? undefined : message}>
      <p className="auth-page-text">
        {realm.duplicateEmailsAllowed ? msg('emailInstructionUsername') : msg('emailInstruction')}
      </p>
      <form id="kc-reset-password-form" className="auth-form" action={url.loginAction} method="post">
        <FormField
          type="text"
          name="username"
          label={
            !realm.loginWithEmailAllowed
              ? msg('username')
              : !realm.registrationEmailAsUsername
              ? msg('usernameOrEmail')
              : msg('email')
          }
          defaultValue={auth.attemptedUsername ?? ''}
          autoComplete="username"
          autoFocus
          required
          icon="mail"
          error={hasFieldError ? messagesPerField.get('username') : undefined}
        />
        <button type="submit" className="auth-cta">{msg('doSubmit')}</button>
      </form>
      <div className="auth-logout-back">
        <a href={url.loginUrl}>{msg('backToLogin')}</a>
      </div>
    </AuthCardPage>
  );
}
