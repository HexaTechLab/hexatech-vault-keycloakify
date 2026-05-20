import { useEffect, useRef } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import FormField from '../components/FormField';
import SsoButtons from '../components/SsoButtons';

interface LoginProps {
  kcContext: KcContext & { pageId: 'login.ftl' };
  i18n: I18n;
}

const IcoShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
  </svg>
);

const IcoGlobe = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9Z"/>
  </svg>
);

const IcoCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
  </svg>
);

export default function Login({ kcContext, i18n }: LoginProps) {
  const { url, realm, usernameHidden, login, message, registrationDisabled } = kcContext;
  const { msg } = i18n;
  const social = (kcContext as any).social;

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!usernameHidden && usernameRef.current) {
      usernameRef.current.focus();
    } else {
      passwordRef.current?.focus();
    }
  }, [usernameHidden]);

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

      <main className="auth-main">
        {/* Left hero */}
        <div className="auth-left">
          <div className="auth-eyebrow">Bon retour</div>
          <h1>Vos documents vous attendent, <em>en sécurité.</em></h1>
          <p className="auth-lede">
            Connectez-vous pour déverrouiller votre coffre familial. Vos clés sont chargées
            localement le temps de votre session puis effacées à la déconnexion.
          </p>
          <div className="auth-trust-card">
            <div className="auth-trust-card-l"><IcoShield /></div>
            <div>
              <strong>Chiffrement E2EE actif.</strong>
              <span>Votre mot de passe ne quitte jamais votre appareil. Nous ne pouvons pas voir vos documents.</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          {/* Tabs */}
          <div className="auth-tabs is-login" role="tablist">
            <span role="tab" className="auth-tab active" aria-selected="true">Connexion</span>
            <a href={url.registrationUrl} role="tab" className="auth-tab" aria-selected="false">
              Inscription
            </a>
            <span className="auth-tab-indicator" aria-hidden="true" />
          </div>

          {/* Card */}
          <div className="auth-card">
            <form
              id="kc-form-login"
              className="auth-form"
              action={url.loginAction}
              method="post"
            >
              <div className="auth-form-h">
                <h2>Connexion</h2>
                <p>Accédez à votre coffre familial chiffré.</p>
              </div>

              <SsoButtons social={social} />

              {message && (
                <div className={`kc-alert${message.type === 'success' ? ' success' : ''}`} role="alert">
                  {message.summary}
                </div>
              )}

              {!usernameHidden && (
                <FormField
                  ref={usernameRef}
                  type={realm.loginWithEmailAllowed && realm.registrationEmailAsUsername ? 'email' : 'text'}
                  name="username"
                  label={
                    !realm.loginWithEmailAllowed
                      ? msg('username')
                      : !realm.registrationEmailAsUsername
                      ? msg('usernameOrEmail')
                      : msg('email')
                  }
                  defaultValue={login.username ?? ''}
                  autoComplete="username"
                  placeholder="vous@exemple.fr"
                  required
                  icon="mail"
                />
              )}

              <FormField
                ref={passwordRef}
                type="password"
                name="password"
                label={msg('password')}
                rightLabel={
                  realm.resetPasswordAllowed ? (
                    <a href={url.loginResetCredentialsUrl} className="auth-link">
                      Mot de passe oublié&nbsp;?
                    </a>
                  ) : undefined
                }
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                required
                icon="lock"
              />

              {realm.rememberMe && !usernameHidden && (
                <label className="auth-check">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    defaultChecked={login.rememberMe === 'on'}
                  />
                  <span className="auth-check-box"><IcoCheck /></span>
                  <span>Rester connecté sur cet appareil <em>(30 jours)</em></span>
                </label>
              )}

              <button type="submit" className="auth-cta">
                Se connecter <IcoArrow />
              </button>

              {realm.registrationAllowed && !registrationDisabled && (
                <div className="auth-switch">
                  Pas encore de compte&nbsp;?{' '}
                  <a href={url.registrationUrl}>Créer un compte</a>
                </div>
              )}
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
