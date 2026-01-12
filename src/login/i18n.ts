import { i18nBuilder } from 'keycloakify/login';

const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<'hexatech-vault'>()
  .withCustomTranslations({
    fr: {
    // Login page
    doLogIn: 'Se connecter',
    username: 'Identifiant',
    usernameOrEmail: 'Email ou nom d\'utilisateur',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    doForgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas encore de compte ?',
    doRegister: 'Créer un compte',
    invalidUsernameOrEmailMessage: 'Identifiants invalides',
    invalidPasswordMessage: 'Identifiants invalides',
    accountDisabledMessage: 'Compte temporairement verrouillé pour raisons de sécurité.',
    accountTemporarilyDisabledMessage: 'Compte temporairement verrouillé. Réessayez dans {0}.',
    sessionExpiredMessage: 'Votre session a expiré. Veuillez vous reconnecter.',

    // Register page
    doRegisterTitle: 'Créer un compte',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    confirmPassword: 'Confirmer le mot de passe',
    termsText: 'J\'accepte les {0} et la {1}',
    termsTitle: 'Conditions Générales d\'Utilisation',
    privacyPolicyTitle: 'Politique de confidentialité',
    alreadyHaveAccount: 'Déjà un compte ?',
    doSignIn: 'Se connecter',
    emailExistsMessage: 'Cet email est déjà utilisé',
    invalidPasswordMinLengthMessage: 'Le mot de passe doit contenir au moins {0} caractères',
    passwordConfirmNotMatch: 'Les mots de passe ne correspondent pas',
    missingFirstNameMessage: 'Veuillez saisir votre prénom',
    missingLastNameMessage: 'Veuillez saisir votre nom',
    missingEmailMessage: 'Veuillez saisir votre email',
    invalidEmailMessage: 'Adresse email invalide',

    // Logout page
    logoutConfirmTitle: 'Déconnexion',
    logoutConfirmMessage: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    doLogout: 'Se déconnecter',
    doCancel: 'Annuler',
    logoutSuccessTitle: 'Vous êtes déconnecté',
    logoutSuccessMessage: 'Vous avez été déconnecté avec succès.',
    backToApplication: 'Retour à l\'application',

    // Error page
    errorTitle: 'Une erreur est survenue',
    backToLogin: 'Retour à la connexion',

    // SSO section
    or: 'ou',
    socialProviderPrefix: 'Se connecter avec',

    // Common
    requiredField: 'Ce champ est requis',
    cancel: 'Annuler',
    submit: 'Envoyer',
  },
  })
  .build();

type I18n = typeof ofTypeI18n;
export { useI18n, type I18n };
