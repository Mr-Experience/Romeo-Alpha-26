import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import SEO from './SEO';
import '../styles/contact.css';
import { config } from '../config';
import emailjs from '@emailjs/browser';
import { submitMessage } from '../services/messages';
import { useNotification } from '../context/NotificationContext';

const Contact = () => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Map form fields to Supabase column names
        const payload = {
            full_name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        };

        setIsSubmitting(true);

        try {
            // 1. Save to Supabase Dashboard
            const supabasePromise = submitMessage(payload);

            // 2. Send to Zoho Mail via EmailJS
            const emailjsPromise = emailjs.send(
                config.emailjsServiceId,
                config.emailjsTemplateId,
                {
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                    time: new Date().toLocaleString(),
                    to_email: 'info@romeoalphamaritime.com'
                },
                config.emailjsPublicKey
            ).catch(err => {
                let errorMsg = err.text || err.message || 'Failed to send email';
                if (errorMsg.includes('535') || errorMsg.includes('Authentication')) {
                    errorMsg = 'Zoho Authentication Failed. Please check your App-Specific Password in Zoho and credentials in EmailJS Dashboard.';
                }
                throw new Error(`Email Error: ${errorMsg}`);
            });

            await Promise.all([supabasePromise, emailjsPromise]);

            notify(t('Form Success Alert'), 'success');
            form.reset();

        } catch (error) {
            console.error('Submission Error:', error);
            notify(`Oops! ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <SEO titleKey="SEO Contact Title" descriptionKey="SEO Contact Desc" keywordsKey="SEO Contact Keywords" />
            {/* Contact Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1 className="contact-hero-title">{t('Contact Hero Title')}</h1>
                    <p className="contact-hero-subtitle">{t('Contact Hero Subtitle')}</p>
                </div>
            </section>

            {/* Contact Content Section */}
            <section className="contact-content-section">

                {/* Info Strip */}
                <div className="contact-info-strip">
                    {/* Item 1: Visit Office */}
                    <div className="contact-strip-item dark">
                        <div className="strip-icon-circle">
                            {/* Map Pin Icon */}
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFF"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div className="strip-text">
                            <h3>{t('Visit Office Heading')}</h3>
                            <p>{t('Label Portharcourt')}</p>
                        </div>
                    </div>

                    {/* Item 2: Let's Talk */}
                    <div className="contact-strip-item primary">
                        <div className="strip-icon-circle">
                            {/* Phone Icon */}
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFF"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.57A2 2 0 0 1 22 16.92z">
                                </path>
                            </svg>
                        </div>
                        <div className="strip-text">
                            <h3>{t('Lets Talk Heading')}</h3>
                            <p>{config.contactPhone}</p>
                            <span className="cta-text">{t('Call Us CTA')}</span>
                        </div>
                    </div>

                    {/* Item 3: Inbox */}
                    <div className="contact-strip-item dark">
                        <div className="strip-icon-circle">
                            {/* Envelope Icon */}
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFF"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                </path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div className="strip-text">
                            <h3>{t('Inbox Heading')}</h3>
                            <p>info@romeoalphamaritime.com / Kyoyan99@yahoo.com</p>
                            <span className="cta-text">{t('Email Us CTA')}</span>
                        </div>
                    </div>
                </div>

                <div className="contact-container">



                    {/* Right Panel: Contact Form */}
                    <div className="contact-form-container">
                        <h2>{t('Form Title')}</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">{t('Form Name')}</label>
                                <input type="text" id="name" name="name" placeholder={t('Placeholder Name')} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">{t('Form Email')}</label>
                                <input type="email" id="email" name="email" placeholder={t('Email Placeholder')} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">{t('Form Subject')}</label>
                                <input type="text" id="subject" name="subject" placeholder={t('Placeholder Subject')} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">{t('Form Message')}</label>
                                <textarea id="message" name="message" rows="5" placeholder={t('Placeholder Message')} required></textarea>
                            </div>
                            <div className="contact-form-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
                                <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ marginTop: 0 }}>
                                    {isSubmitting ? t('Sending') : t('Form Submit')}
                                </button>
                                <div className="contact-social-links" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                        </form>
                    </div>

                </div>

            </section>
        </div>
    );
};

export default Contact;
