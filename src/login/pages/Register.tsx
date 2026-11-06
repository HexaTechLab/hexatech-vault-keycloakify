import { useEffect, useRef, FormEvent, useState } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import FormField from '../components/FormField';
import KcMessage, { alertClassName } from '../components/KcMessage';
import SsoButtons from '../components/SsoButtons';
import logoMark from '../../shared/assets/logo-mark.png';

interface RegisterProps {
  kcContext: KcContext & { pageId: 'register.ftl' };
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

export default function Register({ kcContext, i18n }: RegisterProps) {
  const { url, realm, register, message, passwordRequired } = kcContext;
  const { msg } = i18n;
  const social = (kcContext as any).social;

  const termsUrl = (kcContext as any).properties?.termsUrl ?? '/terms';
  const privacyUrl = (kcContext as any).properties?.privacyUrl ?? '/privacy';

  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Sans déclaration dans le user profile du realm, Keycloak ignorerait la valeur envoyée.
  const ageFieldDeclared = kcContext.profile.attributesByName['age_confirmed'] !== undefined;
  const canSubmit = terms && (adult || !ageFieldDeclared);
  const marketingFieldDeclared = kcContext.profile.attributesByName['marketing_consent'] !== undefined;

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { firstNameRef.current?.focus(); }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!canSubmit) e.preventDefault();
  };

  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-mark"><img src={logoMark} alt="CryptArc" /></div>
          <div>
            <div className="auth-brand-name">CryptArc</div>
          </div>
        </div>
        <div className="auth-topbar-r">
          <button className="auth-lang">
            <IcoGlobe /> FR <span className="caret">▾</span>
          </button>
          <div className="auth-trust-pill">
            <IcoShield />
            <span>Documents chiffrés · stockés en France</span>
          </div>
        </div>
      </header>

      <main className="auth-main">
        {/* Left hero */}
        <div className="auth-left">
          <div className="auth-eyebrow">Bienvenue</div>
          <h1>Un coffre numérique <em>pour les papiers d'une vie.</em></h1>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          {/* Tabs */}
          <div className="auth-tabs is-register" role="tablist">
            <a href={url.loginUrl} role="tab" className="auth-tab" aria-selected="false">
              Connexion
            </a>
            <span role="tab" className="auth-tab active" aria-selected="true">Inscription</span>
            <span className="auth-tab-indicator" aria-hidden="true" />
          </div>

          {/* Card */}
          <div className="auth-card">
            <form
              id="kc-form-register"
              className="auth-form"
              action={url.registrationAction}
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="auth-form-h">
                <h2>Créer un compte</h2>
                <p>Commencez gratuitement. Vos documents sont chiffrés et stockés en France.</p>
              </div>

              <SsoButtons social={social} />

              {message && (
                <KcMessage className={alertClassName(message.type)} html={message.summary} />
              )}

              <div className="auth-field-grid">
                <FormField
                  ref={firstNameRef}
                  type="text"
                  name="firstName"
                  label={msg('firstName')}
                  defaultValue={register.formData?.firstName ?? ''}
                  autoComplete="given-name"
                  placeholder="Camille"
                  required
                  icon="user"
                />
                <FormField
                  type="text"
                  name="lastName"
                  label={msg('lastName')}
                  defaultValue={register.formData?.lastName ?? ''}
                  autoComplete="family-name"
                  placeholder="Dubois"
                  required
                />
              </div>

              <FormField
                type="email"
                name="email"
                label={msg('email')}
                defaultValue={register.formData?.email ?? ''}
                autoComplete="email"
                placeholder="vous@exemple.fr"
                required
                icon="mail"
              />

              {!realm.registrationEmailAsUsername && (
                <FormField
                  type="text"
                  name="username"
                  label={msg('username')}
                  defaultValue={register.formData?.username ?? ''}
                  autoComplete="username"
                  required
                  icon="user"
                />
              )}

              {passwordRequired && (
                <>
                  <FormField
                    type="password"
                    name="password"
                    label={msg('password')}
                    autoComplete="new-password"
                    placeholder="Votre mot de passe"
                    required
                    icon="lock"
                  />
                  <FormField
                    type="password"
                    name="password-confirm"
                    label={msg('confirmPassword')}
                    autoComplete="new-password"
                    placeholder="Confirmer le mot de passe"
                    required
                    icon="lock"
                  />
                </>
              )}

              <div className="auth-checks-block">
                {ageFieldDeclared && (
                  <>
                    <label className="auth-check required">
                      <input
                        type="checkbox"
                        name="age_confirmed"
                        value="true"
                        required
                        checked={adult}
                        onChange={e => setAdult(e.target.checked)}
                      />
                      <span className="auth-check-box"><IcoCheck /></span>
                      <span>Je certifie avoir <strong>plus de 18 ans</strong>.</span>
                    </label>
                    {kcContext.messagesPerField.existsError('age_confirmed') && (
                      <KcMessage className="auth-field-error" html={kcContext.messagesPerField.get('age_confirmed')} />
                    )}
                  </>
                )}

                <label className="auth-check required">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    value="true"
                    required
                    checked={terms}
                    onChange={e => setTerms(e.target.checked)}
                  />
                  <span className="auth-check-box"><IcoCheck /></span>
                  <span>
                    J'accepte les{' '}
                    <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="auth-link" tabIndex={-1}>
                      Conditions générales
                    </a>{' '}
                    et la{' '}
                    <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="auth-link" tabIndex={-1}>
                      Politique de confidentialité
                    </a>.
                  </span>
                </label>

                {kcContext.messagesPerField.existsError('terms_accepted') && (
                  <KcMessage className="auth-field-error" html={kcContext.messagesPerField.get('terms_accepted')} />
                )}

                {marketingFieldDeclared && (
                  <label className="auth-check">
                    <input
                      type="checkbox"
                      name="marketing_consent"
                      value="true"
                      checked={marketing}
                      onChange={e => setMarketing(e.target.checked)}
                    />
                    <span className="auth-check-box"><IcoCheck /></span>
                    <span>Recevoir les conseils de protection <em>(1 email par mois max.)</em></span>
                  </label>
                )}
              </div>

              <button type="submit" className="auth-cta" disabled={!canSubmit}>
                Créer mon compte <IcoArrow />
              </button>

              {/* Les liens du libellé sont hors tabulation : ils restent accessibles au clavier ici, après le bouton. */}
              <div className="auth-legal-kbd">
                <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="auth-link">Conditions générales</a>
                <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="auth-link">Politique de confidentialité</a>
              </div>

              <div className="auth-switch">
                Vous avez déjà un compte&nbsp;?{' '}
                <a href={url.loginUrl}>Se connecter</a>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
