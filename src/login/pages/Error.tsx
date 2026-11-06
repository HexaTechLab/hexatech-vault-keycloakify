import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface ErrorProps {
  kcContext: KcContext & { pageId: 'error.ftl' };
  i18n: I18n;
}

export default function Error({ kcContext, i18n }: ErrorProps) {
  const { url, message, client, skipLink } = kcContext;
  const { msg } = i18n;

  return (
    <AuthCardPage title={msg('errorTitle')} message={{ ...message, type: 'error' }}>
      {!skipLink && (
        <>
          <a href={url.loginUrl} className="auth-cta">{msg('backToLogin')}</a>
          {client?.baseUrl && (
            <div className="auth-logout-back">
              <a href={client.baseUrl}>{msg('backToApplication')}</a>
            </div>
          )}
        </>
      )}
    </AuthCardPage>
  );
}
