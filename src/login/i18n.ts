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

    // Terminologie : « email » plutôt que « courriel » du socle Keycloak
    emailVerifyTitle: "Vérification de l'email",
    updateEmailTitle: "Mise à jour de l'email",
    emailUpdateConfirmationSentTitle: "Email de confirmation envoyé",
    emailUpdateConfirmationSent: "Un email de confirmation a été envoyé à {0}. Vous devez suivre les instructions de ce dernier afin de compléter la mise à jour.",
    emailUpdatedTitle: "Adresse email mise à jour",
    emailUpdated: "La mise à jour de votre adresse email vers {0} a été complétée avec succès.",
    emailVerified: "Email vérifié",
    emailScopeConsentText: "Email",
    emailVerifyInstruction1: "Un email avec des instructions à suivre a été envoyé à votre adresse {0}.",
    emailVerifyInstruction2: "Vous n'avez pas reçu de code dans l'email ?",
    emailVerifyInstruction3: "pour renvoyer l'email.",
    emailLinkIdp1: "Un email avec des instructions pour associer le compte {1} sur {0} avec votre compte {2} vous a été envoyé.",
    emailLinkIdp2: "Vous n'avez pas reçu de code dans l'email ?",
    emailLinkIdp3: "pour renvoyer l'email.",
    emailLinkIdp4: "Si vous avez déjà vérifié votre email dans un autre navigateur",
    emailInstruction: "Entrez votre nom d'utilisateur ou votre email ; un email va vous être envoyé vous permettant de créer un nouveau mot de passe.",
    emailInstructionUsername: "Entrez votre nom d'utilisateur ; un email va vous être envoyé vous permettant de créer un nouveau mot de passe.",
    'error-invalid-email': "Email invalide.",
    federatedIdentityEmailExistsMessage: "Cet utilisateur avec cet email existe déjà. Veuillez vous connecter au gestionnaire de compte pour lier le compte.",
    updateEmailMessage: "Vous devez mettre à jour votre adresse email pour activer votre compte.",
    verifyEmailMessage: "Vous devez vérifier votre email pour activer votre compte.",
    linkIdpMessage: "Vous devez vérifier votre email pour lier votre compte avec {0}.",
    emailSentMessage: "Vous devriez recevoir rapidement un email avec de plus amples instructions.",
    emailSendErrorMessage: "Erreur lors de l'envoi de l'email, veuillez essayer plus tard.",
    invalidPasswordNotEmailMessage: "Mot de passe invalide: ne doit pas être identique à l'email.",
    emailVerifiedMessage: "Votre email a été vérifié.",
    confirmEmailAddressVerification: "Confirmez la validité de l'adresse email {0}.",
    'idp-email-verification-display-name': "Vérification de l'email",
    'idp-email-verification-help-text': "Lier votre compte en validant votre email.",
    'console-verify-email': "Vous devez vérifier votre adresse email. Nous avons envoyé un email à {0} contenant un code de vérification. Veuillez saisir ce code ci-dessous.",
    'console-email-code': "Code email:",

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
