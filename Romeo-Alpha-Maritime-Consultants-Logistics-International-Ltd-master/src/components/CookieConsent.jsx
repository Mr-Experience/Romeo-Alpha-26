import { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsConfigured, getConsent, setConsent } from '../lib/analytics';

/**
 * Small cookie notice. Shown only when analytics IDs are configured and the
 * visitor hasn't chosen yet. Never baked into prerendered HTML.
 */
const CookieConsent = () => {
    const [visible, setVisible] = useState(() =>
        analyticsConfigured()
        && !(typeof navigator !== 'undefined' && navigator.webdriver)
        && !getConsent()
    );
    if (!visible) return null;

    const choose = (value) => { setConsent(value); setVisible(false); };

    return (
        <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent" data-prerender-skip>
            <p>
                We use cookies to measure visits and improve our services (Google Analytics, LinkedIn, TikTok).
                No tracking happens unless you accept. <Link to="/privacy">Privacy Policy</Link>
            </p>
            <div className="cookie-consent-actions">
                <button type="button" className="cookie-btn cookie-btn-secondary" onClick={() => choose('denied')}>Decline</button>
                <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => choose('granted')}>Accept</button>
            </div>
        </div>
    );
};

export default CookieConsent;
