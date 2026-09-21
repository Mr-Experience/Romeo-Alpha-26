import React, { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

const BASE_URL = 'https://romeoalphamaritime.com';

/**
 * Reusable SEO Component to dynamically update document title, head metadata,
 * and canonical link tag per page. Uses translation keys for full localisation.
 */
const SEO = ({ titleKey, descriptionKey, keywordsKey, ogImage = '/images/logo-alpha.jpg', ogType = 'website' }) => {
    const { t, language } = useTranslation();

    useEffect(() => {
        // 1. Sync HTML lang attribute
        document.documentElement.lang = language || 'en';

        // 2. Fetch and translate values
        const translatedTitle = t(titleKey);
        const translatedDesc = t(descriptionKey);
        const translatedKeywords = t(keywordsKey);

        const pageTitle = translatedTitle ? `${translatedTitle} | Romeo Alpha Maritime` : 'Romeo Alpha Maritime';

        // 3. Update document title
        document.title = pageTitle;

        // 4. Helper to update or create <meta> tags
        const updateMetaTag = (attributeName, attributeValue, contentValue) => {
            if (!contentValue) return;
            let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute(attributeName, attributeValue);
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', contentValue);
        };

        // 5. Update primary meta tags
        updateMetaTag('name', 'description', translatedDesc);
        updateMetaTag('name', 'keywords', translatedKeywords);

        // 6. Update Open Graph (Facebook / LinkedIn)
        updateMetaTag('property', 'og:title', pageTitle);
        updateMetaTag('property', 'og:description', translatedDesc);
        updateMetaTag('property', 'og:image', `${BASE_URL}${ogImage}`);
        updateMetaTag('property', 'og:type', ogType);
        updateMetaTag('property', 'og:url', window.location.href);

        // 7. Update Twitter Card tags
        updateMetaTag('name', 'twitter:title', pageTitle);
        updateMetaTag('name', 'twitter:description', translatedDesc);
        updateMetaTag('name', 'twitter:image', `${BASE_URL}${ogImage}`);

        // 8. Canonical tag — clean URL without query string or hash
        const canonicalUrl = `${BASE_URL}${window.location.pathname}`;
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (!canonicalTag) {
            canonicalTag = document.createElement('link');
            canonicalTag.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalTag);
        }
        canonicalTag.setAttribute('href', canonicalUrl);

    }, [titleKey, descriptionKey, keywordsKey, ogImage, ogType, language, t]);

    return null;
};

export default SEO;
