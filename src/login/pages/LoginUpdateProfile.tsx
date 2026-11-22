import { useState } from 'react';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import AuthCardPage from '../components/AuthCardPage';
import FormField from '../components/FormField';
import KcMessage from '../components/KcMessage';
import { CONSENT_ATTRIBUTES, consentGiven, consentValue, termsVersionLabel } from '../consent';

interface LoginUpdateProfileProps {
  kcContext: KcContext & { pageId: 'login-update-profile.ftl' };
  i18n: I18n;
}

const IcoCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
  </svg>
);

const AUTOCOMPLETE: Record<string, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  username: 'username',
};

/**
 * Revue 20.3 (décision E6) — mise à jour du profil, y compris l'acceptation des conditions demandée
 * par Keycloak à la connexion d'un compte existant (AC 4.1) ou après un changement de version
 * (E4). Les liens vers les CGU et la politique sont cliquables et accessibles au clavier ; les
 * consentements sont des cases à cocher, les autres attributs du user profile des champs texte.
 */
export default function LoginUpdateProfile({ kcContext, i18n }: LoginUpdateProfileProps) {
  const { url, message, messagesPerField, isAppInitiatedAction, profile } = kcContext;
  const { msg, advancedMsgStr } = i18n;
  const attributes = profile.attributesByName;
  const termsUrl = kcContext.properties?.termsUrl ?? '/terms';
  const privacyUrl = kcContext.properties?.privacyUrl ?? '/privacy';

  const ageAttribute = attributes['age_confirmed'];
  const termsAttribute = attributes['terms_accepted'];
  const marketingAttribute = attributes['marketing_consent'];
  const termsVersion = termsAttribute ? termsVersionLabel(consentValue(termsAttribute)) : null;

  const [adult, setAdult] = useState(() => consentGiven(ageAttribute));
  const [terms, setTerms] = useState(() => consentGiven(termsAttribute));
  const [marketing, setMarketing] = useState(() => consentGiven(marketingAttribute));
  const canSubmit = (!termsAttribute || terms) && (!ageAttribute || adult);

  const textAttributes = Object.values(attributes).filter(
    (attribute) => !CONSENT_ATTRIBUTES.includes(attribute.name),
  );
  const fieldError = (name: string) =>
    messagesPerField.existsError(name) ? messagesPerField.get(name) : undefined;
  const hasFieldError = Object.keys(attributes).some((name) => messagesPerField.existsError(name));

  return (
    <AuthCardPage title={msg('loginProfileTitle')} message={hasFieldError ? undefined : message}>
      <form id="kc-update-profile-form" className="auth-form" action={url.loginAction} method="post">
        {textAttributes.map((attribute, index) => (
          <FormField
            key={attribute.name}
            type={attribute.name === 'email' ? 'email' : 'text'}
            name={attribute.name}
            label={advancedMsgStr(attribute.displayName ?? attribute.name)}
            defaultValue={attribute.value ?? ''}
            readOnly={attribute.readOnly}
            required={attribute.required}
            autoComplete={AUTOCOMPLETE[attribute.name]}
            autoFocus={index === 0 && !attribute.readOnly}
            icon={attribute.name === 'email' ? 'mail' : undefined}
            error={fieldError(attribute.name)}
          />
        ))}

        <div className="auth-checks-block">
          {ageAttribute && (
            <>
              <label className="auth-check required">
                <input
                  type="checkbox"
                  name="age_confirmed"
                  value={consentValue(ageAttribute)}
                  required
                  checked={adult}
                  onChange={(e) => setAdult(e.target.checked)}
                />
                <span className="auth-check-box"><IcoCheck /></span>
                <span>Je certifie avoir <strong>au moins 18 ans</strong>.</span>
              </label>
              {fieldError('age_confirmed') && (
                <KcMessage className="auth-field-error" html={fieldError('age_confirmed') as string} />
              )}
            </>
          )}

          {termsAttribute && (
            <>
              <label className="auth-check required">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  value={consentValue(termsAttribute)}
                  required
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <span className="auth-check-box"><IcoCheck /></span>
                <span>
                  J'accepte les{' '}
                  <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="auth-link">
                    Conditions générales
                  </a>{' '}
                  et la{' '}
                  <a href={privacyUrl} target="_blank" rel="noopener noreferrer" className="auth-link">
                    Politique de confidentialité
                  </a>
                  {termsVersion ? ` (version du ${termsVersion})` : ''}.
                </span>
              </label>
              {fieldError('terms_accepted') && (
                <KcMessage className="auth-field-error" html={fieldError('terms_accepted') as string} />
              )}
            </>
          )}

          {marketingAttribute && (
            <label className="auth-check">
              <input
                type="checkbox"
                name="marketing_consent"
                value={consentValue(marketingAttribute)}
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span className="auth-check-box"><IcoCheck /></span>
              <span>Recevoir les conseils de protection <em>(1 email par mois max.)</em></span>
            </label>
          )}
        </div>

        <button type="submit" className="auth-cta" disabled={!canSubmit}>{msg('doSubmit')}</button>
        {isAppInitiatedAction && (
          <button type="submit" name="cancel-aia" value="true" formNoValidate className="auth-btn-ghost">
            {msg('doCancel')}
          </button>
        )}
      </form>
    </AuthCardPage>
  );
}
