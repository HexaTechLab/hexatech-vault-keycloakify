import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KcPage } from './kc.gen';

// For development/testing, you can uncomment this to mock a specific page:
// import { createGetKcContextMock } from "keycloakify/login/KcContext";
// const { getKcContextMock } = createGetKcContextMock({
//   kcContextExtension: { themeName: "hexatech-vault", properties: {} },
//   kcContextExtensionPerPage: {},
//   overrides: {}
// });
// window.kcContext = getKcContextMock({ pageId: "login.ftl" });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.kcContext === undefined ? (
      <h1>No Keycloak Context - This is a Keycloak theme, not a standalone app</h1>
    ) : (
      <KcPage kcContext={window.kcContext} />
    )}
  </StrictMode>
);
