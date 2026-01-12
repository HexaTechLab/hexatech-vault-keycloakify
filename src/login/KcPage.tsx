import { lazy, Suspense } from 'react';
import type { KcContext } from './KcContext';
import { useI18n } from './i18n';
import '../shared/tokens.css';
import './styles.css';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const LogoutConfirm = lazy(() => import('./pages/LogoutConfirm'));
const Error = lazy(() => import('./pages/Error'));

export default function KcApp(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { i18n } = useI18n({ kcContext });

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case 'login.ftl':
            return <Login kcContext={kcContext as any} i18n={i18n} />;
          case 'register.ftl':
            return <Register kcContext={kcContext as any} i18n={i18n} />;
          case 'logout-confirm.ftl':
            return <LogoutConfirm kcContext={kcContext as any} i18n={i18n} />;
          case 'error.ftl':
            return <Error kcContext={kcContext as any} i18n={i18n} />;
          default:
            return null;
        }
      })()}
    </Suspense>
  );
}
