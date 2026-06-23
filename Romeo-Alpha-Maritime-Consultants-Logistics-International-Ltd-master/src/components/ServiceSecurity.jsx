
import React, { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'iconsax-react';
import { Shield, Lock, Eye } from 'iconsax-react';
import SEO from './SEO';

const ServiceSecurity = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page">
            <SEO titleKey="SEO Service Security Title" descriptionKey="SEO Service Security Desc" keywordsKey="SEO Service Security Keywords" />
            {/* Hero Section */}
            <div className="service-hero" style={{ backgroundImage: "url('/images/security-escort.webp')" }}>
                <div className="overlay-dark"></div>
                <div className="service-hero-content">
                    <Link to="/" className="back-link"><ArrowLeft size="16" color="#ffffff" /> {t('Home')}</Link>
                    <h1>{t('Tag Security')}</h1>
                    <p>{t('Service 9 Desc')}</p>
                </div>
            </div>

            <div className="service-container">
                <div className="service-main">
                    <h2>{t('Overlay Security').replace(/<br>/g, ' ')}</h2>
                    <p className="service-description">
                        {t('FAQ_A4')}
                        <br /><br />
                        {t('Benefit 2 Desc')}
                    </p>

                    <h3>{t('Security Operations')}</h3>
                    <ul className="operations-list">
                        <li>
                            <Shield size="24" className="op-icon" />
                            <div>
                                <strong>{t('Service 9 Title')}</strong>
                                <p>{t('Service 9 Desc')}</p>
                            </div>
                        </li>
                        <li>
                            <Lock size="24" className="op-icon" />
                            <div>
                                <strong>{t('Armed Guards')}</strong>
                                <p>{t('Service 9 Desc')}</p>
                            </div>
                        </li>
                        <li>
                            <Eye size="24" className="op-icon" />
                            <div>
                                <strong>{t('Risk Assessment')}</strong>
                                <p>{t('Benefit 2 Desc')}</p>
                            </div>
                        </li>
                    </ul>

                    <div className="service-gallery">
                        <img src="/images/security-escort.webp" alt={t('Tag Security')} />
                        <img src="/images/security-patrol.webp" alt={t('Tag Security')} />
                    </div>

                    <div className="service-cta-box">
                        <h3>{t('Banner Heading')}</h3>
                        <p>{t('Banner Subtext')}</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/contact" style={{ textDecoration: 'none' }}>
                                <button className="standard-btn" style={{ padding: '0 32px', width: 'auto', minWidth: '160px' }}>{t('Banner Button')}</button>
                            </Link>
                            <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                                <button className="standard-btn" style={{ padding: '0 32px', width: 'auto', minWidth: '160px', backgroundColor: 'transparent', border: '2px solid #ffffff', color: '#ffffff' }}>{t('Marketplace')}</button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="service-sidebar">
                    <div className="sidebar-widget">
                        <h4>{t('Other Services')}</h4>
                        <ul className="sidebar-links">
                            <li><Link to="/service/maritime">{t('Overlay Maritime').replace(/<br>/g, ' ')}</Link></li>
                            <li><Link to="/service/charter">{t('Overlay Charter').replace(/<br>/g, ' ')}</Link></li>
                            <li><Link to="/service/offshore">{t('Overlay Offshore').replace(/<br>/g, ' ')}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceSecurity;
