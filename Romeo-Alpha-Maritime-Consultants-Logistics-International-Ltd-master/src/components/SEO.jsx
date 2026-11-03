/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export const BASE_URL = 'https://romeoalphamaritime.com';
export const ORG_ID = `${BASE_URL}/#organization`;

/**
 * Reusable SEO component: updates document title, meta tags, canonical link,
 * and an optional per-page JSON-LD block. Uses translation keys for localisation.
 *
 * All URLs are built from BASE_URL (never window.location) so that pages
 * prerendered at build time on localhost still emit production URLs.
 *
 * Props:
 *  - schema:  object or array of JSON-LD objects for this page (optional)
 *  - noindex: true for pages that must not be indexed (404, admin)
 */
const SEO = ({
    titleKey,
    descriptionKey,
    keywordsKey,
    ogImage = '/images/og-share.jpg',
    ogType = 'website',
    schema,
    noindex = false,
}) => {
    const { t, language } = useTranslation();
    const schemaJson = schema ? JSON.stringify(schema) : '';

    useEffect(() => {
        document.documentElement.lang = language || 'en';

        const translatedTitle = t(titleKey);
        const translatedDesc = t(descriptionKey);
        const translatedKeywords = t(keywordsKey);

        const pageTitle = translatedTitle ? `${translatedTitle} | Romeo Alpha Maritime` : 'Romeo Alpha Maritime';
        document.title = pageTitle;

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

        // Canonical: production domain + clean path (no query, hash or trailing slash)
        const path = window.location.pathname.replace(/\/+$/, '') || '/';
        const canonicalUrl = `${BASE_URL}${path === '/' ? '/' : path}`;
        const imageUrl = /^https?:\/\//.test(ogImage) ? ogImage : `${BASE_URL}${ogImage}`;

        updateMetaTag('name', 'description', translatedDesc);
        updateMetaTag('name', 'keywords', translatedKeywords);
        updateMetaTag('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

        updateMetaTag('property', 'og:title', pageTitle);
        updateMetaTag('property', 'og:description', translatedDesc);
        updateMetaTag('property', 'og:image', imageUrl);
        updateMetaTag('property', 'og:type', ogType);
        updateMetaTag('property', 'og:url', canonicalUrl);
        updateMetaTag('property', 'og:site_name', 'Romeo Alpha Maritime');

        updateMetaTag('name', 'twitter:title', pageTitle);
        updateMetaTag('name', 'twitter:description', translatedDesc);
        updateMetaTag('name', 'twitter:image', imageUrl);

        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (noindex) {
            canonicalTag?.remove();
        } else {
            if (!canonicalTag) {
                canonicalTag = document.createElement('link');
                canonicalTag.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalTag);
            }
            canonicalTag.setAttribute('href', canonicalUrl);
        }

        // Per-page structured data (site-wide Organization schema lives in index.html)
        let schemaTag = document.getElementById('page-schema');
        if (schemaJson) {
            if (!schemaTag) {
                schemaTag = document.createElement('script');
                schemaTag.type = 'application/ld+json';
                schemaTag.id = 'page-schema';
                document.head.appendChild(schemaTag);
            }
            schemaTag.textContent = schemaJson;
        } else if (schemaTag) {
            schemaTag.remove();
        }
    }, [titleKey, descriptionKey, keywordsKey, ogImage, ogType, language, t, schemaJson, noindex]);

    return null;
};

/** Builds a schema.org Service object linked to the site-wide Organization. */
export const serviceSchema = ({ name, serviceType, description, path }) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: `${BASE_URL}${path}`,
    provider: { '@id': ORG_ID },
    areaServed: [
        { '@type': 'Place', name: 'Gulf of Guinea' },
        { '@type': 'Country', name: 'Nigeria' },
        { '@type': 'Place', name: 'Worldwide' },
    ],
});

export default SEO;
