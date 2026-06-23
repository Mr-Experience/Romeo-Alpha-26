
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import { ArrowLeft } from 'iconsax-react';
import { Activity, Setting2, Layer } from 'iconsax-react';
import SEO from './SEO';

const ServiceOffshore = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page">
            <SEO titleKey="SEO Service Offshore Title" descriptionKey="SEO Service Offshore Desc" keywordsKey="SEO Service Offshore Keywords" />
            {/* Hero Section */}
            <div className="service-hero" style={{ backgroundImage: "url('/images/bottom-2.webp')" }}>
                <div className="overlay-dark"></div>
                <div className="service-hero-content">
                    <Link to="/" className="back-link"><ArrowLeft size="16" color="#ffffff" /> {t('Home')}</Link>
                    <h1>{t('Tag Offshore')}</h1>
                    <p>{t('Service 8 Desc')}</p>
                </div>
            </div>

            <div className="service-container">
                <div className="service-main">
                    <h2>{t('Overlay Offshore').replace(/<br>/g, ' ')}</h2>
                    <p className="service-description">
                        {t('Benefit 3 Desc')}
                        <br /><br />
                        {t('Ads Subtext')}
                    </p>

                    <h3>{t('Offshore Operations')}</h3>
                    <ul className="operations-list">
                        <li>
                            <Layer size="24" className="op-icon" />
                            <div>
                                <strong>{t('Service 8 Title')}</strong>
                                <p>{t('Service 8 Desc')}</p>
                            </div>
                        </li>
                        <li>
                            <Setting2 size="24" className="op-icon" />
                            <div>
                                <strong>{t('Service 5 Title')}</strong>
                                <p>{t('Service 5 Desc')}</p>
                            </div>
                        </li>
                        <li>
                            <Activity size="24" className="op-icon" />
                            <div>
                                <strong>{t('Service 6 Title')}</strong>
                                <p>{t('Service 6 Desc')}</p>
                            </div>
                        </li>
                    </ul>

                    <div className="service-gallery">
                        <img src="/images/bottom-2.webp" alt={t('Tag Offshore')} />
                        <img src="/images/ads-gallery-1.webp" alt={t('Tag Offshore')} />
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
                            <li><Link to="/service/security">{t('Overlay Security').replace(/<br>/g, ' ')}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceOffshore;
