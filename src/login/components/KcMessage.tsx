import { kcSanitize } from 'keycloakify/lib/kcSanitize';

interface KcMessageProps {
  html: string;
  className: string;
}

export function alertClassName(type: 'success' | 'warning' | 'error' | 'info') {
  if (type === 'success' || type === 'info') return 'kc-alert success';
  return type === 'warning' ? 'kc-alert warning' : 'kc-alert';
}

// Keycloak envoie ses messages en HTML : plusieurs erreurs sont jointes par <br>.
export default function KcMessage({ html, className }: KcMessageProps) {
  return <div className={className} role="alert" dangerouslySetInnerHTML={{ __html: kcSanitize(html) }} />;
}
