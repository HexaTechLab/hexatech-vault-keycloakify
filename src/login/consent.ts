import type { Attribute } from 'keycloakify/login';

/**
 * Revue 20.3 (décision E4) — valeur envoyée pour un consentement déclaré dans le user profile du
 * realm. `terms_accepted` porte la version des conditions acceptée (seule option du validateur
 * `options`, par ex. `2026-11-22`) : changer cette option dans le realm rend invalide la valeur des
 * comptes existants et Keycloak redemande l'acceptation à leur prochaine connexion. Realm sans
 * version (option `true`) ou attribut sans validateur : `true`, comme avant.
 */
export function consentValue(attribute: Attribute | undefined): string {
  return attribute?.validators.options?.options[0] ?? 'true';
}

/** Vrai si le compte a déjà donné ce consentement, dans la version demandée. */
export function consentGiven(attribute: Attribute | undefined): boolean {
  return attribute !== undefined && attribute.value === consentValue(attribute);
}

/** « 22 novembre 2026 » pour une version datée `AAAA-MM-JJ`, sinon rien. */
export function termsVersionLabel(version: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(version);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Attributs de consentement rendus en cases à cocher, jamais en champs texte. */
export const CONSENT_ATTRIBUTES = ['age_confirmed', 'terms_accepted', 'marketing_consent'];
