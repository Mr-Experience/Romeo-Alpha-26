/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

/** Shared layout for Privacy Policy and Terms & Conditions. */
const LegalPage = ({ title, description, updated, children }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="legal-page">
            <SEO titleKey={title} descriptionKey={description} />
            <div className="legal-container">
                <p className="legal-breadcrumb"><Link to="/">Home</Link> / {title}</p>
                <h1>{title}</h1>
                <p className="legal-updated">Last updated: {updated}</p>
                {children}
            </div>
        </div>
    );
};

export const COMPANY = {
    name: 'Romeo Alpha Maritime Consultants and Logistics International Ltd',
    rc: 'RC 9257242',
    address: 'No. 58 Circular Road, Alcon Road, Woji, Obio-Akpor LGA, Rivers State, Nigeria',
    email: 'info@romeoalphamaritime.com',
    phone: '+234 806 618 4330',
    whatsapp: '+234 805 576 9660',
};

export default LegalPage;
