import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import { config } from '../config';
import { ArrowLeft, Call, Sms, Information, CloseCircle, Home2, Edit } from 'iconsax-react';
import '../styles/operations.css';
import { fetchMarketplaceItems } from '../services/marketplace';
import emailjs from '@emailjs/browser';
import { submitMessage } from '../services/messages';
import { useNotification } from '../context/NotificationContext';
import SEO from './SEO';
import { formatPrice } from '../utils/format';

const FALLBACK_IMAGE = '/images/hero-v3.webp';
const POLL_INTERVAL = 15000; // 15 seconds

const MarketplaceDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const { t } = useTranslation();
    const { notify } = useNotification();
    const inquiryRef = useRef(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const pollRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Image error handler — swap broken src to local fallback
    const handleImageError = useCallback((e) => {
        if (e.target.src !== window.location.origin + FALLBACK_IMAGE) {
            e.target.src = FALLBACK_IMAGE;
        }
    }, []);

    const loadItemDetails = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        let dynamicItems = [];

        try {
            dynamicItems = await fetchMarketplaceItems();
        } catch (error) {
            console.error("Could not fetch marketplace items:", error);
        }

        try {
            const processedDynamic = dynamicItems.map(di => {
                const gallery = di.gallery || [];
                const mainImage = gallery.length > 0 ? gallery[0] : FALLBACK_IMAGE;
                return {
                    id: di.id,
                    category: di.category,
                    title: di.title,
                    description: di.description,
                    image: mainImage,
                    gallery: gallery,
                    badges: di.category === 'sale' ? [t('Marketplace Available'), t('Tag Marketplace')] : [t('Marketplace Featured')],
                    price: di.price ? formatPrice(di.price) : null,
                    location: di.location
                };
            });

            const foundItem = processedDynamic.find(op => op.id.toString() === id);
            if (foundItem) {
                setItem(prev => {
                    // Only update activeImage if this is the first load (no previous item)
                    if (!prev) setActiveImage(foundItem.image);
                    return foundItem;
                });
            }
        } catch (error) {
            console.error("Error processing item details:", error);
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadItemDetails();

        // Check for triggerInquiry param
        const params = new URLSearchParams(location.search);
        if (params.get('triggerInquiry') === 'true') {
            setShowInquiryForm(true);
            setTimeout(() => {
                inquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }

        // Auto-poll for live updates (only when tab is visible)
        pollRef.current = setInterval(() => {
            if (!document.hidden) {
                loadItemDetails(true); // silent refresh
            }
        }, POLL_INTERVAL);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [id, location.search, loadItemDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target;
        const subject = form.subject.value;

        try {
            // 1. Save to Supabase
            await submitMessage({
                full_name: formData.name,
                email: formData.email,
                subject: subject,
                message: formData.message
            });

            // 2. Send via EmailJS
            await emailjs.send(
                config.emailjsServiceId,
                config.emailjsTemplateId,
                {
                    name: formData.name,
                    email: formData.email,
                    subject: subject,
                    message: formData.message,
                    time: new Date().toLocaleString(),
                    to_email: 'info@romeoalphamaritime.com'
                },
                config.emailjsPublicKey
            );

            notify(t('Inquiry Success'), 'success');
            setShowInquiryForm(false);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Submission Error:', error);
            notify(`Error: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="detail-loading-container">
                <div className="loader"></div>
                <p>{t('Marketplace Loading')}</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="detail-error-container">
                <h2>{t('Item Not Found')}</h2>
                <p>{t('Item Error Desc')}</p>
                <Link to="/marketplace" className="back-btn-solid">
                    <ArrowLeft size="18" /> {t('Back to Marketplace')}
                </Link>
            </div>
        );
    }

    return (
        <div className="marketplace-detail-page">
            <SEO 
                titleKey={item.title} 
                descriptionKey={item.description} 
                keywordsKey={`${item.title}, Romeo Alpha Maritime, marketplace`}
                ogImage={item.image}
            />
            {/* Persistent Back Button Strip */}
            <div className="detail-navigation-bar">
                <div className="nav-flex-wrapper">
                    <Link to="/marketplace" className="back-circle-btn" aria-label="Go Back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001F3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>
            </div>

            <main className="detail-main-wrapper">
                <div className="detail-container">
                    <div className="detail-layout">
                        
                        {/* LEFT: GALLERY */}
                        <div className="detail-media-box">
                            <div className="detail-active-image">
                                <img src={activeImage} alt={item.title} onError={handleImageError} loading="lazy" />
                            </div>
                            {item.gallery && item.gallery.length > 1 && (
                                <div className="detail-gallery-strip">
                                    {item.gallery.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`detail-thumb-btn ${activeImage === img ? 'is-active' : ''}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img src={img} alt={`${item.title} - ${idx + 1}`} onError={handleImageError} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="detail-info-box">
                            <div className="detail-hero-info">
                                <span className="category-pill">
                                    {t('Marketplace ' + item.category.charAt(0).toUpperCase() + item.category.slice(1))}
                                </span>
                                <h1 className="detail-main-title">{item.title}</h1>
                                {item.price && <div className="detail-main-price">{item.price}</div>}
                            </div>

                            <div className="detail-description-group">
                                <h3 className="detail-subheading">
                                    <Information size="18" variant="Bold" /> {t('Item Description')}
                                </h3>
                                <p className="detail-text-body">{item.longDescription || item.description}</p>
                            </div>

                            <div className="detail-specs-group">
                                <h3 className="detail-subheading">{t('Key Specifications')}</h3>
                                <div className="specs-flat-list">
                                    <div className="spec-flat-item">
                                        <span className="spec-label">{t('Label Location')}</span>
                                        <span className="spec-value">{item.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-actions-footer" style={{ marginTop: 'auto' }}>
                                <button
                                    onClick={() => setShowInquiryForm(true)}
                                    className="btn-primary-action"
                                >
                                    <Sms size="22" variant="Bulk" /> {t('Send Inquiry Detail')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL OVERLAY */}
            {showInquiryForm && (
                <div className="inquiry-modal-overlay">
                    <div className="inquiry-modal-content">
                        <div className="modern-inquiry-box">
                            <div className="inquiry-box-header">
                                <h4>{t('Submit Inquiry Title')}</h4>
                                <button onClick={() => setShowInquiryForm(false)} className="inquiry-close-x">
                                    <CloseCircle size="28" color="#A0AEC0" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="modern-form">
                                <div className="modern-field">
                                    <label>{t('Form Subject')}</label>
                                    <input type="text" name="subject" defaultValue={item.title} required readOnly className="readonly-input" />
                                </div>
                                <div className="modern-field">
                                    <label>{t('Contact Person')}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('Placeholder Name')} required />
                                </div>
                                <div className="modern-field">
                                    <label>{t('Form Email')}</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('Placeholder Email')} required />
                                </div>
                                <div className="modern-field">
                                    <label>{t('Discussion Details')}</label>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder={t('Placeholder Message')} rows="4" required></textarea>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn-modern-submit">
                                    {isSubmitting ? t('Sending Request') : t('Inquiry Submit')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceDetail;
