import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import SEO from './SEO';
import '../styles/operations.css';
import { fetchMarketplaceItems } from '../services/marketplace';
import { formatPrice } from '../utils/format';

const FALLBACK_IMAGE = '/images/hero-v3.webp';
const POLL_INTERVAL = 15000; // 15 seconds

const Marketplace = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('sale');
    const [allOps, setAllOps] = useState([]);
    const pollRef = useRef(null);

    // Image error handler — swap broken src to local fallback
    const handleImageError = useCallback((e) => {
        if (e.target.src !== window.location.origin + FALLBACK_IMAGE) {
            e.target.src = FALLBACK_IMAGE;
        }
    }, []);

    const loadMarketplace = useCallback(async (silent = false) => {
        try {
            const dynamicItems = await fetchMarketplaceItems();

            // Map dynamic items to match the structure of operationsData
            const mappedDynamic = dynamicItems.map(item => ({
                id: item.id,
                category: item.category,
                title: item.title,
                description: item.description,
                image: (item.gallery && item.gallery.length > 0) ? item.gallery[0] : FALLBACK_IMAGE,
                badges: item.category === 'sale' ? [t('Marketplace Available'), t('Tag Marketplace')] : [t('Marketplace Featured')],
                cta: item.category === 'sale' ? t('Enquire') : t('Reach out'),
                price: item.price ? formatPrice(item.price) : null
            }));

            setAllOps(mappedDynamic);
        } catch (err) {
            console.error("Error loading live marketplace items:", err);
            if (!silent) setAllOps([]);
        }
    }, [t]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Parse category from URL query params
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam && ['sale', 'hire', 'repair', 'scrap'].includes(categoryParam)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveCategory(categoryParam);
        }

        loadMarketplace();

        // Auto-poll for live updates (only when tab is visible)
        const startPolling = () => {
            pollRef.current = setInterval(() => {
                if (!document.hidden) {
                    loadMarketplace(true); // silent refresh
                }
            }, POLL_INTERVAL);
        };
        startPolling();

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [location.search, loadMarketplace]);

    const handleTabClick = (category) => {
        setActiveCategory(category);
    };

    const filteredOps = allOps.filter(op => op.category === activeCategory);

    return (
        <div className="operations-page">
            <SEO titleKey="SEO Marketplace Title" descriptionKey="SEO Marketplace Desc" keywordsKey="SEO Marketplace Keywords" />
            {/* Operations Hero / Search Section */}
            <section className="operations-hero">
                <div className="operations-container">
                    <h1 className="operations-title">{t('Marketplace')}</h1>
                    <p className="operations-subtitle">{t('Operations Page Subtitle')}</p>
                </div>
            </section>

            {/* Category Filters Section */}
            <div className="marketplace-filters-section">
                <div className="operations-container">
                    <div className="category-tabs-container">
                        <div className="category-tabs">
                            <button
                                className={`category-tab ${activeCategory === 'sale' ? 'active' : ''}`}
                                onClick={() => handleTabClick('sale')}
                            >
                                {t('Marketplace Sale') || t('Category Offshore')}
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'hire' ? 'active' : ''}`}
                                onClick={() => handleTabClick('hire')}
                            >
                                {t('Marketplace Hire') || t('Category Logistics')}
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'repair' ? 'active' : ''}`}
                                onClick={() => handleTabClick('repair')}
                            >
                                {t('Marketplace Repair') || t('Category Charter')}
                            </button>
                            <button
                                className={`category-tab ${activeCategory === 'scrap' ? 'active' : ''}`}
                                onClick={() => handleTabClick('scrap')}
                            >
                                {t('Marketplace Scrap') || t('Category Port')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simplified Service Highlight */}
            <div className="operations-container">
                <div className="service-highlight-banner">
                    <p className="service-highlight-text">
                        {t('Service Help Text')}
                        <Link to="/contact" className="service-highlight-link">{t('Reach out')}</Link>
                    </p>
                </div>
            </div>

            {/* Operations Grid */}
            <section className="operations-grid-section">
                <div className="operations-container">
                    <div className="operations-grid">
                        {filteredOps.map(op => (
                            <div key={op.id} className="operation-card">
                                <div className="op-card-image">
                                    <img src={op.image} alt={op.title} onError={handleImageError} loading="lazy" />
                                </div>
                                <div className="op-card-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 className="op-card-title" style={{ margin: 0 }}>{op.title}</h3>
                                        {op.price && <span style={{ fontWeight: '700', color: '#0056b3', fontSize: '18px' }}>{op.price}</span>}
                                    </div>
                                    <p className="op-card-desc">{op.description}</p>
                                    <div className="op-card-badges">
                                        {op.badges.map((badge, index) => (
                                            <span key={index} className="op-badge">{badge}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <Link to={`/marketplace/${op.id}`} className="op-card-cta-link" style={{ textDecoration: 'none', flex: 1 }}>
                                            <button className="op-card-cta" style={{ backgroundColor: '#F3FAFF', color: '#0056b3', border: '1px solid #0056b3' }}>
                                                {t('See Details')}
                                            </button>
                                        </Link>
                                        <Link to={`/marketplace/${op.id}?triggerInquiry=true`} className="op-card-cta-link" style={{ textDecoration: 'none', flex: 1 }}>
                                            <button className="op-card-cta">{t('Reach out')}</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredOps.length === 0 && (
                        <div className="no-results">
                            <p>{t('No Results')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div >
    );
};

export default Marketplace;
