import type { ReactNode } from 'react';
import KcMessage, { alertClassName } from './KcMessage';
import logoMark from '../../shared/assets/logo-mark.png';

interface AuthCardPageProps {
  title: ReactNode;
  message?: { type: 'success' | 'warning' | 'error' | 'info'; summary: string };
  children: ReactNode;
}

export default function AuthCardPage({ title, message, children }: AuthCardPageProps) {
  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-mark"><img src={logoMark} alt="CryptArc" /></div>
          <div>
            <div className="auth-brand-name">CryptArc</div>
          </div>
        </div>
      </header>

      <main className="auth-logout-main">
        <div className="auth-logout-card auth-page-card">
          <div className="auth-logout-heading">
            <h2>{title}</h2>
          </div>
          {message && <KcMessage className={alertClassName(message.type)} html={message.summary} />}
          {children}
        </div>
      </main>
    </div>
  );
}
