import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface LoginIdpLinkEmailProps {
  kcContext: KcContext & { pageId: 'login-idp-link-email.ftl' };
  i18n: I18n;
}

export default function LoginIdpLinkEmail({ kcContext, i18n }: LoginIdpLinkEmailProps) {
  const { url, realm, brokerContext, idpAlias, message } = kcContext;
  const { msg } = i18n;

  return (
    <AuthCardPage title={msg('emailLinkIdpTitle', idpAlias)} message={message}>
      <p className="auth-page-text">{msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)}</p>
      <p className="auth-page-text">
        {msg('emailLinkIdp2')} <a href={url.loginAction} className="auth-link">{msg('doClickHere')}</a> {msg('emailLinkIdp3')}
      </p>
      <p className="auth-page-text">
        {msg('emailLinkIdp4')} <a href={url.loginAction} className="auth-link">{msg('doClickHere')}</a> {msg('emailLinkIdp5')}
      </p>
    </AuthCardPage>
  );
}
