const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.7 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13.7 17.6 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.2-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
    <path fill="#FBBC05" d="M10.4 28.7a14.3 14.3 0 0 1 0-9.4l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.6 2.6 10.8l7.8-6.1z"/>
    <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.5-5.8c-2.1 1.4-4.8 2.2-8.5 2.2-6.4 0-11.8-4.2-13.6-10l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M17.05 12.86c-.03-3 2.45-4.43 2.56-4.5-1.4-2.05-3.58-2.33-4.35-2.36-1.85-.19-3.61 1.09-4.55 1.09-.95 0-2.4-1.07-3.95-1.04C4.74 6.08 2.9 7.2 1.9 8.95c-2.04 3.53-.52 8.74 1.47 11.6.97 1.4 2.13 2.97 3.65 2.91 1.47-.06 2.02-.95 3.8-.95 1.78 0 2.27.95 3.83.92 1.58-.03 2.58-1.42 3.55-2.83 1.12-1.62 1.58-3.2 1.6-3.28-.04-.02-3.07-1.18-3.1-4.66ZM14.34 4.05c.82-.99 1.37-2.37 1.22-3.74-1.18.05-2.61.78-3.45 1.77-.76.87-1.42 2.26-1.24 3.61 1.31.1 2.66-.66 3.47-1.64Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9V15.5H7v-3.5h3.1V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z"/>
  </svg>
);

const providerIconMap: Record<string, JSX.Element> = {
  google: <GoogleIcon />,
  microsoft: <MicrosoftIcon />,
  apple: <AppleIcon />,
  facebook: <FacebookIcon />,
};

const providerOrder = ['google', 'microsoft', 'apple', 'facebook', 'franceconnect'];

interface SocialProvider {
  providerId: string;
  displayName: string;
  loginUrl: string;
}

interface SsoButtonsProps {
  social?: { displayInfo?: boolean; providers?: SocialProvider[] };
}

export default function SsoButtons({ social }: SsoButtonsProps) {
  if (!social?.displayInfo || !social?.providers?.length) return null;

  const sorted = [...social.providers].sort((a, b) => {
    const ia = providerOrder.indexOf(a.providerId);
    const ib = providerOrder.indexOf(b.providerId);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <>
      <div className="auth-providers">
        {sorted.map(provider => (
          <a
            key={provider.providerId}
            href={provider.loginUrl}
            className="auth-prov"
            aria-label={`Continuer avec ${provider.displayName}`}
          >
            {providerIconMap[provider.providerId] ?? null}
            <span>{provider.displayName}</span>
          </a>
        ))}
      </div>
      <div className="auth-divider"><span>ou avec votre adresse e-mail</span></div>
    </>
  );
}
