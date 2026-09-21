import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { getCertifications } from '../services/certifications';
import SEO from './SEO';
import '../styles/about.css'; // Use the exact same styles as About page

const Certifications = () => {
    const { t } = useTranslation();
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const data = await getCertifications();
            setCertifications(data || []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="about-page">
            <SEO titleKey="Certifications" descriptionKey="Our official certifications and licenses." keywordsKey="certifications, licenses, maritime, romeo alpha" />
            
            {/* Hero Section cloned from About */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-hero-title">Certifications & Licenses</h1>
                    <p className="about-hero-subtitle">Our commitment to regulatory compliance and excellence.</p>
                </div>
            </section>

            {/* Content section matching About's mission-vision-section or overview */}
            <section className="mission-vision-section" style={{ paddingBottom: '120px' }}>
                <div className="mv-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>Loading certifications...</div>
                    ) : certifications.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>No certifications available at this time.</div>
                    ) : (
                        certifications.map(cert => (
                            <div key={cert.id} className="mv-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ height: '250px', marginBottom: '24px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={cert.image_url} alt={cert.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                                <h2>{cert.title}</h2>
                                <p>{cert.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Certifications;
