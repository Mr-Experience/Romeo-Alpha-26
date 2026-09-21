import React, { useState } from 'react';
import { subscribeToNewsletter } from '../services/newsletter';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

const Footer = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('');


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('sending');
        setErrorMessage('');

        try {
            await subscribeToNewsletter(email);
            setStatus('success');
            setEmail('');
        } catch (err) {
            console.error('Subscription Error:', err);
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    return (
        <footer className="footer-section">
            <div className="footer-main-group" style={{ borderTop: 'none' }}>
                <div className="footer-col">
                    <h3>{t('Footer Subscribe Heading')}</h3>
                    <form className="footer-newsletter-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder={t('Email Placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'sending' || status === 'success'}
                                required
                            />
                            <button type="submit" disabled={status === 'sending' || status === 'success'}>
                                {status === 'sending' ? t('Sending') : t('Footer Subscribe Btn')}
                            </button>
                        </div>
                    </form>
                    {status === 'success' && (
                        <p style={{ color: '#00B341', fontSize: '13px', marginTop: '8px' }}>
                            {t('Partnership Success')}
                        </p>
                    )}
                    {status === 'error' && (
                        <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '8px' }}>
                            {errorMessage || t('General Error')}
                        </p>
                    )}
                    <div className="footer-social-links">
                        <a href="https://www.facebook.com/profile.php?id=61582132920070" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/romeoalphamaritime_/" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/romeo-alpha-9b7936417" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="footer-col footer-col-middle">
                    <h3>{t('Footer Business Heading')}</h3>
                    <ul className="footer-services-list">
                        <li><Link to="/about">{t('Footer Link What')}</Link></li>
                        <li><Link to="/marketplace">{t('Marketplace')}</Link></li>
                        <li><Link to="/service/offshore">{t('Footer Link Offshore')}</Link></li>
                        <li><Link to="/service/security">{t('Footer Link Security')}</Link></li>
                        <li><Link to="/service/charter">{t('Footer Link Charter')}</Link></li>
                        <li><Link to="/contact">{t('Footer Link Partnership')}</Link></li>
                    </ul>
                </div>
                <div className="footer-col footer-col-middle">
                    <h3>{t('Footer Know Heading')}</h3>
                    <ul className="footer-services-list">
                        <li><Link to="/about">{t('Footer Link About')}</Link></li>
                        <li><Link to="/team">{t('Our team')}</Link></li>
                        <li><Link to="/#insights">{t('Footer Link News')}</Link></li>
                        <li><Link to="/careers">{t('Footer Link Careers')}</Link></li>
                        <li><Link to="/contact">{t('Footer Link Contact')}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="scroll-top-btn" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span>{t('Scroll Top')}</span>
            </div>

            <div className="footer-secondary-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span>{t('Footer Address')}</span>
                <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: '500' }}>{t('CAC Registration')}</span>
            </div>
            <div className="copyright-group">
                <span>{t('Copyright')}</span>
            </div>
        </footer>
    );
};

export default Footer;
