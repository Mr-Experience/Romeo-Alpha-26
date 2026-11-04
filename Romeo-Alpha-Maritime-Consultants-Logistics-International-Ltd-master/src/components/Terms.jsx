import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { COMPANY } from './LegalPage';

const Terms = () => (
    <LegalPage
        title="Terms & Conditions"
        description="Terms for using the Romeo Alpha Maritime website, marketplace listings and enquiry services."
        updated="4 November 2026"
    >
        <p>
            These terms apply to your use of romeoalphamaritime.com (the “website”), operated by {COMPANY.name} ({COMPANY.rc}),
            {' '}{COMPANY.address} (“Romeo Alpha”, “we”, “us”). By using the website you accept these terms. If you do not agree,
            please do not use the website.
        </p>

        <h2>1. Our role</h2>
        <p>
            Romeo Alpha provides maritime consultancy and vessel brokerage. Unless we expressly agree otherwise in writing, we act
            as a broker or intermediary between clients and vessel owners, operators, sellers and service providers. We do not own
            or operate the vessels shown in the marketplace, and the owner or operator remains responsible for the vessel, its crew,
            condition, certification and operation.
        </p>

        <h2>2. Marketplace listings</h2>
        <ul>
            <li>Listings (vessels for sale, charter, repair or scrap) are based on information supplied by owners, sellers or their agents. We take reasonable care but do not guarantee that descriptions, specifications, photos, locations or prices are complete or accurate.</li>
            <li>All listings are subject to availability, prior sale and change without notice. Prices are indicative and exclude taxes, duties, delivery, survey and other costs unless stated.</li>
            <li>A listing is an invitation to enquire, not an offer. No sale, charter or service is binding until a written contract (for example a memorandum of agreement or charter party) is signed by the parties.</li>
            <li>You should carry out your own inspection, survey, class and title checks, and take independent technical and legal advice, before committing to any transaction.</li>
        </ul>

        <h2>3. Quotes and services</h2>
        <p>
            Quotes we provide are estimates based on the information you give us and current market conditions, and are valid for
            the period stated in the quote. Security escort, offshore support and other services are provided under separate written
            agreements, which take priority over these terms where they differ.
        </p>

        <h2>4. Your responsibilities</h2>
        <ul>
            <li>Give accurate information in enquiries and forms.</li>
            <li>Use the website lawfully. Do not attempt to access admin areas, interfere with the website’s security or operation, or copy listings in bulk.</li>
            <li>Comply with sanctions, export control, anti-money-laundering and other laws that apply to any transaction you pursue with us. We may decline any enquiry or transaction at our discretion, including to meet our own compliance obligations.</li>
        </ul>

        <h2>5. Intellectual property</h2>
        <p>
            The Romeo Alpha name, logo, website design and content belong to us or our licensors. You may view and share pages for
            your own business purposes, but you may not reproduce, modify or use them commercially without our written permission.
            Listing photos and specifications may belong to the vessel owner or seller.
        </p>

        <h2>6. Third-party links</h2>
        <p>
            The website links to third-party services such as WhatsApp, LinkedIn, Instagram and TikTok. We are not responsible for
            their content or practices, which are governed by their own terms.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
            The website and its content are provided “as is” for general information. To the extent permitted by law, we are not
            liable for any loss arising from reliance on website content, from the acts or omissions of vessel owners, operators or
            other third parties, or for any indirect or consequential loss, loss of profit or loss of opportunity. Nothing in these
            terms limits liability that cannot be limited under Nigerian law, including for fraud or for death or personal injury
            caused by negligence.
        </p>

        <h2>8. Privacy</h2>
        <p>Our <Link to="/privacy">Privacy Policy</Link> explains how we handle personal data.</p>

        <h2>9. Governing law</h2>
        <p>
            These terms are governed by the laws of the Federal Republic of Nigeria. The courts of Rivers State, Nigeria have
            jurisdiction over any dispute arising from them, unless a written contract between us provides otherwise.
        </p>

        <h2>10. Changes and contact</h2>
        <p>
            We may update these terms; the date at the top shows the latest version. Questions:{' '}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or {COMPANY.phone}.
        </p>
    </LegalPage>
);

export default Terms;
