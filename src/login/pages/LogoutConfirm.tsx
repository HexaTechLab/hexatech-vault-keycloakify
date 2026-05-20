import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

interface LogoutConfirmProps {
  kcContext: KcContext & { pageId: 'logout-confirm.ftl' };
  i18n: I18n;
}

const IcoShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const IcoGlobe = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9Z"/>
  </svg>
);

const IcoLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IcoLock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

export default function LogoutConfirm({ kcContext, i18n }: LogoutConfirmProps) {
  const { url, client, logoutConfirm } = kcContext;
  const { msg } = i18n;

  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-mark">C</div>
          <div>
            <div className="auth-brand-name">CryptArc</div>
            <div className="auth-brand-sub">Coffre familial chiffré</div>
          </div>
        </div>
        <div className="auth-topbar-r">
          <button className="auth-lang">
            <IcoGlobe /> FR <span className="caret">▾</span>
          </button>
          <div className="auth-trust-pill">
            <IcoShield />
            <span>Chiffrement E2EE · Hébergé en France</span>
          </div>
        </div>
      </header>

      <main className="auth-logout-main">
        <div className="auth-logout-card">
          <div className="auth-logout-icon">
            <IcoLock />
          </div>

          <div className="auth-logout-heading">
            <h2>Déconnexion</h2>
            <p>
              Êtes-vous sûr de vouloir vous déconnecter&nbsp;?
              <br />
              Vos clés de chiffrement seront effacées de cette session.
            </p>
          </div>

          <form
            id="kc-logout-form"
            action={url.logoutConfirmAction}
            method="post"
            style={{ width: '100%' }}
          >
            <input type="hidden" name="session_code" value={logoutConfirm.code} />

            <div className="auth-logout-actions">
              <a
                href={logoutConfirm.skipLink ? undefined : (client?.baseUrl ?? url.loginUrl)}
                className="auth-btn-ghost"
              >
                {msg('doCancel')}
              </a>
              <button
                type="submit"
                name="confirmLogout"
                value="true"
                className="auth-cta danger"
              >
                <IcoLogOut />
                {msg('doLogout')}
              </button>
            </div>
          </form>

          {client?.baseUrl && (
            <div className="auth-logout-back">
              <a href={client.baseUrl}>{msg('backToApplication')}</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
