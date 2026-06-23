import React, { useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

/**
 * Reusable SEO Component to dynamically update document title and head metadata.
 * Uses translation keys to keep metadata fully localized.
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

        // 4. Helper function to update or create meta tags
        const updateMetaTag = (attributeName, attributeValue, contentValue) => {
            if (!contentValue) return;
            
            // Try to find existing tag
            let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
            
            if (!metaTag) {
                // Create new meta tag if it doesn't exist
                metaTag = document.createElement('meta');
                metaTag.setAttribute(attributeName, attributeValue);
                document.head.appendChild(metaTag);
            }
            
            metaTag.setAttribute('content', contentValue);
        };

        // 5. Update primary tags
        updateMetaTag('name', 'description', translatedDesc);
        updateMetaTag('name', 'keywords', translatedKeywords);

        // 6. Update Open Graph (Facebook / LinkedIn)
        updateMetaTag('property', 'og:title', pageTitle);
        updateMetaTag('property', 'og:description', translatedDesc);
        updateMetaTag('property', 'og:image', ogImage);
        updateMetaTag('property', 'og:type', ogType);
        updateMetaTag('property', 'og:url', window.location.href);

        // 7. Update Twitter Card tags
        updateMetaTag('name', 'twitter:title', pageTitle);
        updateMetaTag('name', 'twitter:description', translatedDesc);
        updateMetaTag('name', 'twitter:image', ogImage);

    }, [titleKey, descriptionKey, keywordsKey, ogImage, ogType, language, t]);

    return null;
};

export default SEO;
