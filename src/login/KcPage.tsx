import { lazy, Suspense } from 'react';
import DefaultPage from 'keycloakify/login/DefaultPage';
import Template from 'keycloakify/login/Template';
import type { KcContext } from './KcContext';
import { useI18n } from './i18n';
import '../shared/tokens.css';
import './styles.css';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const LogoutConfirm = lazy(() => import('./pages/LogoutConfirm'));
const Error = lazy(() => import('./pages/Error'));
const Info = lazy(() => import('./pages/Info'));
const LoginPageExpired = lazy(() => import('./pages/LoginPageExpired'));
const LoginUpdatePassword = lazy(() => import('./pages/LoginUpdatePassword'));
const LoginResetPassword = lazy(() => import('./pages/LoginResetPassword'));
const LoginVerifyEmail = lazy(() => import('./pages/LoginVerifyEmail'));
const LoginIdpLinkConfirm = lazy(() => import('./pages/LoginIdpLinkConfirm'));
const LoginIdpLinkEmail = lazy(() => import('./pages/LoginIdpLinkEmail'));
const UserProfileFormFields = lazy(() => import('keycloakify/login/UserProfileFormFields'));

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
          case 'info.ftl':
            return <Info kcContext={kcContext} i18n={i18n} />;
          case 'login-page-expired.ftl':
            return <LoginPageExpired kcContext={kcContext} i18n={i18n} />;
          case 'login-update-password.ftl':
            return <LoginUpdatePassword kcContext={kcContext} i18n={i18n} />;
          case 'login-reset-password.ftl':
            return <LoginResetPassword kcContext={kcContext} i18n={i18n} />;
          case 'login-verify-email.ftl':
            return <LoginVerifyEmail kcContext={kcContext} i18n={i18n} />;
          case 'login-idp-link-confirm.ftl':
            return <LoginIdpLinkConfirm kcContext={kcContext} i18n={i18n} />;
          case 'login-idp-link-email.ftl':
            return <LoginIdpLinkEmail kcContext={kcContext} i18n={i18n} />;
          default:
            // Page non habillée : apparence standard de Keycloak plutôt qu'un écran vide.
            return (
              <DefaultPage
                kcContext={kcContext as any}
                i18n={i18n as any}
                classes={{}}
                Template={Template}
                doUseDefaultCss
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword
              />
            );
        }
      })()}
    </Suspense>
  );
}
