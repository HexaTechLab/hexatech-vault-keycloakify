import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface InfoProps {
  kcContext: KcContext & { pageId: 'info.ftl' };
  i18n: I18n;
}

export default function Info({ kcContext, i18n }: InfoProps) {
  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;
  const { msg, advancedMsgStr } = i18n;

  const actions = requiredActions?.map(action => advancedMsgStr(`requiredAction.${action}`)).join(', ');
  const body = actions ? `${message.summary.trim()} <b>${actions}</b>` : message.summary;
  const title = messageHeader ? advancedMsgStr(messageHeader) : 'Information';
  const link = skipLink ? undefined : pageRedirectUri ?? actionUri ?? client?.baseUrl;

  return (
    <AuthCardPage title={<span dangerouslySetInnerHTML={{ __html: kcSanitize(title) }} />}>
      <p className="auth-page-text" dangerouslySetInnerHTML={{ __html: kcSanitize(body) }} />
      {link && (
        <a href={link} className="auth-cta">
          {actionUri && !pageRedirectUri ? msg('doContinue') : msg('backToApplication')}
        </a>
      )}
    </AuthCardPage>
  );
}
