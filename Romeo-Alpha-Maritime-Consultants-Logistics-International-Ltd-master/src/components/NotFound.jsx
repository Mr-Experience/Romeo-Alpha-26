import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const NotFound = () => (
    <div className="service-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 16px 64px', textAlign: 'center' }}>
        <SEO titleKey="Page Not Found" descriptionKey="The page you are looking for does not exist." noindex />
        <div>
            <h1>Page not found</h1>
            <p style={{ margin: '12px 0 24px' }}>The page you are looking for has moved or does not exist.</p>
            <p>
                <Link to="/">Go to the homepage</Link> · <Link to="/marketplace">Browse the marketplace</Link> · <Link to="/contact">Contact us</Link>
            </p>
        </div>
    </div>
);

export default NotFound;
