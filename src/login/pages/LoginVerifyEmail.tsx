import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface LoginVerifyEmailProps {
  kcContext: KcContext & { pageId: 'login-verify-email.ftl' };
  i18n: I18n;
}

export default function LoginVerifyEmail({ kcContext, i18n }: LoginVerifyEmailProps) {
  const { url, user, message } = kcContext;
  const { msg } = i18n;

  return (
    <AuthCardPage title={msg('emailVerifyTitle')} message={message}>
      <p className="auth-page-text">{msg('emailVerifyInstruction1', user?.email ?? '')}</p>
      <p className="auth-page-text">
        {msg('emailVerifyInstruction2')}{' '}
        <a href={url.loginAction} className="auth-link">{msg('doClickHere')}</a>{' '}
        {msg('emailVerifyInstruction3')}
      </p>
    </AuthCardPage>
  );
}
