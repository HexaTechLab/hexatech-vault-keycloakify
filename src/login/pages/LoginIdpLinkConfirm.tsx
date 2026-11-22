import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';

interface LoginIdpLinkConfirmProps {
  kcContext: KcContext & { pageId: 'login-idp-link-confirm.ftl' };
  i18n: I18n;
}

export default function LoginIdpLinkConfirm({ kcContext, i18n }: LoginIdpLinkConfirmProps) {
  const { url, idpAlias, message } = kcContext;
  const { msg } = i18n;

  return (
    <AuthCardPage title={msg('confirmLinkIdpTitle')} message={message}>
      <form id="kc-register-form" className="auth-form" action={url.loginAction} method="post">
        <button type="submit" name="submitAction" value="linkAccount" className="auth-cta">
          {msg('confirmLinkIdpContinue', idpAlias)}
        </button>
        <button type="submit" name="submitAction" value="updateProfile" className="auth-btn-ghost">
          {msg('confirmLinkIdpReviewProfile')}
        </button>
      </form>
    </AuthCardPage>
  );
}
