import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import logo from '../../shared/assets/logo.svg';

interface LogoutConfirmProps {
  kcContext: KcContext & { pageId: 'logout-confirm.ftl' };
  i18n: I18n;
}

export default function LogoutConfirm({ kcContext, i18n }: LogoutConfirmProps) {
  const { url, client, logoutConfirm } = kcContext;
  const { msg } = i18n;

  return (
    <div className="kc-page">
      <div className="kc-card">
        {/* Logo */}
        <div className="kc-logo">
          <img src={logo} alt="HexaTechVault Logo" />
        </div>

        {/* Header */}
        <div className="kc-header">
          <h1>{msg('logoutConfirmTitle')}</h1>
          <p>{msg('logoutConfirmMessage')}</p>
        </div>

        {/* Logout form */}
        <form
          id="kc-logout-form"
          className="kc-form"
          action={url.logoutConfirmAction}
          method="post"
        >
          <input type="hidden" name="session_code" value={logoutConfirm.code} />

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
            <button type="submit" name="confirmLogout" value="true" className="kc-button danger">
              {msg('doLogout')}
            </button>

            <a href={url.loginUrl} className="kc-button secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {msg('doCancel')}
            </a>
          </div>
        </form>

        {/* Footer */}
        {client && client.baseUrl && (
          <div className="kc-footer" style={{ marginTop: 'var(--spacing-lg)' }}>
            <a href={client.baseUrl} className="kc-link">
              {msg('backToApplication')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
