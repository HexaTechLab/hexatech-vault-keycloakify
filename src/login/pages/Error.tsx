import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
import logo from '../../shared/assets/logo.svg';

interface ErrorProps {
  kcContext: KcContext & { pageId: 'error.ftl' };
  i18n: I18n;
}

export default function Error({ kcContext, i18n }: ErrorProps) {
  const { url, message, client } = kcContext;
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
          <h1>{msg('errorTitle')}</h1>
        </div>

        {/* Error message */}
        {message && (
          <div className="kc-alert" role="alert">
            {message.summary}
          </div>
        )}

        {/* Back to login button */}
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <a href={url.loginUrl} className="kc-button" style={{ textDecoration: 'none', display: 'block' }}>
            {msg('backToLogin')}
          </a>
        </div>

        {/* Back to application link */}
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
