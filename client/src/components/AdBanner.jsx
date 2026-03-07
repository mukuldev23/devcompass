import { useEffect, useRef, useState } from 'react';
import { parseBooleanEnv } from '../lib/env';

const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';
const ADS_ENABLED = parseBooleanEnv(import.meta.env.VITE_ENABLE_ADS, false);

function ensureAdSenseScript(clientId) {
  if (!clientId || typeof document === 'undefined') return;

  const existing = document.querySelector(`script[data-adsense-client="${clientId}"]`);
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-adsense-client', clientId);
  document.head.appendChild(script);
}

function AdBanner({ slot, className = '', minHeight = 120 }) {
  const adRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || !slot || typeof window === 'undefined') {
      return;
    }

    ensureAdSenseScript(ADSENSE_CLIENT_ID);

    const run = () => {
      if (!adRef.current) return;
      if (adRef.current.getAttribute('data-ad-initialized') === 'true') return;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current.setAttribute('data-ad-initialized', 'true');
        setIsInitialized(true);
      } catch {
        // Ignore transient ad script race conditions.
      }
    };

    const timer = window.setTimeout(run, 200);
    return () => window.clearTimeout(timer);
  }, [slot]);

  if (!ADS_ENABLED || !ADSENSE_CLIENT_ID || !slot) return null;

  return (
    <div className={`border border-slate-300 bg-[#efece7] p-2 ${className}`} style={{ minHeight }}>
      <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Sponsored</p>
      <div className="relative" style={{ minHeight: `${minHeight - 28}px` }}>
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#efece7]">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">Loading ad...</p>
          </div>
        )}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: `${minHeight - 28}px` }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export default AdBanner;
