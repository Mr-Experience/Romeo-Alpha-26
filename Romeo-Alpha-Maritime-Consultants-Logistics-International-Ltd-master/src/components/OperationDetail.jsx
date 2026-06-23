import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import { operationsData } from '../data/operationsData';
import '../styles/operation-detail.css';

const OperationDetail = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [searchParams]);

    const id = parseInt(searchParams.get('id'));
    const operation = operationsData.find(item => item.id === id) || operationsData[0];
    const relatedOps = operationsData.filter(item => item.id !== operation.id).slice(0, 3);

    if (!operation) return <div>Loading...</div>;

    const remainingCount = operation.gallery.length - 4;

    return (
        <div className="operation-detail-page">
            {/* Detail Content Section */}
            <section className="detail-section">
                <div className="detail-container">
                    {/* Upper Group: Text and Form */}
                    <div className="detail-upper">
                        <div className="detail-text-col">
                            <h1 className="detail-title">{operation.title}</h1>
                            <p className="detail-description">{operation.longDescription}</p>
                            <div className="detail-expertise">
                                <h3>{t('Expertise Heading')}</h3>
                                <ul>
                                    <li>{t('Expertise 1')}</li>
                                    <li>{t('Expertise 2')}</li>
                                    <li>{t('Expertise 3')}</li>
                                    <li>{t('Expertise 4')}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="detail-form-col">
                            <div className="contact-form-container">
                                <h2>{t('Inquiry Heading')}</h2>
                                <form className="contact-form" action="https://formspree.io/f/xlgnaqop" method="POST">
                                    <input type="hidden" name="Inquiry Type" value={operation.title} />
                                    <div className="form-group">
                                        <label htmlFor="name">{t('Form Name')}</label>
                                        <input type="text" id="name" name="name" placeholder={t('Placeholder Name')} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">{t('Form Email')}</label>
                                        <input type="email" id="email" name="email" placeholder={t('Email Placeholder')} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">{t('Form Message')}</label>
                                        <textarea id="message" name="message" rows="4"
                                            placeholder={t('Inquiry Placeholder Message')} required></textarea>
                                    </div>
                                    <button type="submit" className="btn-submit">{t('Inquiry Submit')}</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Lower Group: Image Gallery */}
                    <div className="detail-lower">
                        <div className="gallery-grid">
                            {operation.gallery.slice(0, 4).map((img, index) => (
                                <div key={index} className={`gallery-item ${index === 3 ? 'see-more' : ''}`}>
                                    <img src={img} alt={`${operation.title} Gallery ${index + 1}`} />
                                    {index === 3 && remainingCount > 0 && (
                                        <div className="see-more-overlay"><span>{remainingCount} {t('Images Left')}</span></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Operations Section */}
            <section className="related-operations">
                <div className="operations-container">
                    <div className="related-header">
                        <span className="related-subtitle">{t('Related Subtitle')}</span>
                    </div>
                    <div className="related-grid" id="related-grid">
                        {relatedOps.map(item => (
                            <div key={item.id} className="related-image-container">
                                <img src={item.image} alt={item.title} className="related-content-image" />
                                <div className="image-shadow"></div>
                                <div className="image-overlay-text">{item.title}</div>
                                <Link to={`/operation-detail?id=${item.id}`} className="overlay-button-link">
                                    <button className="overlay-button">{t('Explore Service')}</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OperationDetail;
