import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface LoginPageExpiredProps {
  kcContext: KcContext & { pageId: 'login-page-expired.ftl' };
  i18n: I18n;
}

export default function LoginPageExpired({ kcContext, i18n }: LoginPageExpiredProps) {
  const { url, message } = kcContext;
  const { msg } = i18n;

  return (
    <AuthCardPage title={msg('pageExpiredTitle')} message={message}>
      <p className="auth-page-text">
        {msg('pageExpiredMsg1')} : <a href={url.loginRestartFlowUrl} className="auth-link">{msg('doClickHere')}</a>.
      </p>
      <p className="auth-page-text">
        {msg('pageExpiredMsg2')} : <a href={url.loginAction} className="auth-link">{msg('doClickHere')}</a>.
      </p>
    </AuthCardPage>
  );
}
