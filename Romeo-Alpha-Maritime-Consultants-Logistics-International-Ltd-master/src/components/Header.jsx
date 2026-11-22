import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import { HambergerMenu, CloseSquare, Global } from 'iconsax-react';

const Header = () => {
    const { t, changeLanguage, language } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const languageRef = useRef(null);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleLanguageDropdown = () => setLanguageDropdownOpen(!languageDropdownOpen);

    // Close language dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // Auto-close menu on active link click
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // The welcome bar was removed (audit #9); keep the layout in its compact, bar-free state
    useEffect(() => {
        document.body.classList.add('banner-closed');
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const isLoginPage = location.pathname === '/admin-login';

    if (isLoginPage) {
        return (
            <header className="main-header" style={{ justifyContent: 'flex-start', paddingLeft: '24px', top: 0, marginTop: 0, backgroundColor: '#FFFFFF' }}>
                <Link to="/">
                    <img src="/images/logo-header.png" alt={t('Logo Alt')} className="logo" />
                </Link>
            </header>
        );
    }

    return (
        <>
            <header className="main-header">
                <div className="header-left">
                    <Link to="/">
                        <img src="/images/logo-header.png" alt={t('Logo Alt')} className="logo" />
                    </Link>
                </div>

                <nav className="header-center desktop-nav">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('Home')}</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>{t('About us')}</Link>
                    <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>{t('Marketplace')}</Link>
                    <Link to="/team" className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}>{t('Our team')}</Link>
                    <Link to="/certifications" className={`nav-link ${location.pathname === '/certifications' ? 'active' : ''}`}>Certifications</Link>
                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>{t('Contact us')}</Link>
                </nav>

                <div className="header-right">
                    <div
                        className={`language-selector ${languageDropdownOpen ? 'active' : ''}`}
                        id="language-selector"
                        ref={languageRef}
                    >
                        <div className="language-trigger" onClick={toggleLanguageDropdown}>
                            <Global size="20" color="#000" variant="Outline" />
                            <span className="language-text" id="current-lang-text">{language.toUpperCase()}</span>
                        </div>
                        <div className="language-dropdown">
                            <div className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => { changeLanguage('en'); setLanguageDropdownOpen(false); }}>{t('Lang English')}</div>
                            <div className={`lang-option ${language === 'es' ? 'active' : ''}`} onClick={() => { changeLanguage('es'); setLanguageDropdownOpen(false); }}>{t('Lang Spanish')}</div>
                            <div className={`lang-option ${language === 'fr' ? 'active' : ''}`} onClick={() => { changeLanguage('fr'); setLanguageDropdownOpen(false); }}>{t('Lang French')}</div>
                            <div className={`lang-option ${language === 'de' ? 'active' : ''}`} onClick={() => { changeLanguage('de'); setLanguageDropdownOpen(false); }}>{t('Lang German')}</div>
                            <div className={`lang-option ${language === 'zh' ? 'active' : ''}`} onClick={() => { changeLanguage('zh'); setLanguageDropdownOpen(false); }}>{t('Lang Chinese')}</div>
                        </div>
                    </div>
                    <button className="btn-get-quotes desktop-cta" onClick={() => navigate('/contact')}>{t('Get Quotes')}</button>
                    <button className="btn-get-quotes phone-cta" data-track="quote" data-track-label="header_phone_quote" onClick={() => navigate('/contact')}>{t('Get Quote Short')}</button>
                </div>

                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    {!mobileMenuOpen ? (
                        <HambergerMenu size="24" color="#000" />
                    ) : (
                        <CloseSquare size="24" color="#000" />
                    )}
                </div>
            </header>

            <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <Link to="/" className="nav-link">{t('Home')}</Link>
                    <Link to="/about" className="nav-link">{t('About us')}</Link>
                    <Link to="/marketplace" className="nav-link">{t('Marketplace')}</Link>
                    <Link to="/team" className="nav-link">{t('Our team')}</Link>
                    <Link to="/certifications" className="nav-link">Certifications</Link>
                    <Link to="/contact" className="nav-link">{t('Contact us')}</Link>
                </nav>
                <div className="mobile-cta">
                    <button className="btn-get-quotes" onClick={() => navigate('/contact')}>{t('Get Quotes')}</button>
                </div>
            </div>
        </>
    );
};

export default Header;
