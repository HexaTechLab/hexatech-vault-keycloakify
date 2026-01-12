/* eslint-disable @typescript-eslint/ban-types */
import type { ExtendKcContext } from 'keycloakify/login';
import type { KcEnvName, ThemeName } from '../kc.gen';

export type KcContextExtension = {
  themeName: ThemeName;
  properties: Record<KcEnvName, string> & {
    termsUrl?: string;
    privacyUrl?: string;
  };
};

export type KcContextExtensionPerPage = {
  'register.ftl': {
    register: {
      formData?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        username?: string;
      };
    };
  };
  'logout-confirm.ftl': {
    logoutConfirm: {
      code: string;
      skipLink?: boolean;
    };
  };
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
