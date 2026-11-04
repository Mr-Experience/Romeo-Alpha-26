import React from 'react';
import { Link } from 'react-router-dom';
import LegalPage, { COMPANY } from './LegalPage';

const PrivacyPolicy = () => (
    <LegalPage
        title="Privacy Policy"
        description="How Romeo Alpha Maritime collects, uses and protects personal data under the Nigeria Data Protection Act 2023."
        updated="4 November 2026"
    >
        <p>
            This policy explains how {COMPANY.name} ({COMPANY.rc}) (“Romeo Alpha”, “we”, “us”) collects, uses and protects
            your personal data when you visit romeoalphamaritime.com, contact us, or respond to our advertising. We process
            personal data in line with the Nigeria Data Protection Act 2023 (NDPA) and, where it applies, other data protection
            laws of the country you contact us from.
        </p>

        <h2>1. Who is responsible for your data</h2>
        <p>
            {COMPANY.name}, {COMPANY.address}, is the data controller. Contact us about any privacy matter at{' '}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or {COMPANY.phone}.
        </p>

        <h2>2. What we collect</h2>
        <ul>
            <li><strong>Enquiries and quote requests</strong> (contact form, marketplace enquiry forms): your name, email address, subject and message, and any details you choose to share about a vessel, cargo or project.</li>
            <li><strong>LinkedIn lead forms</strong>: when you submit one of our forms on LinkedIn, LinkedIn shares with us the details shown on the form, such as your name, email, phone number, company, job title, country and your answers.</li>
            <li><strong>Phone, WhatsApp and email</strong>: your number or address and the content of the conversation.</li>
            <li><strong>Newsletter</strong>: your email address, if you subscribe.</li>
            <li><strong>Website usage</strong>, only if you accept cookies: pages visited, buttons clicked, approximate location, device and browser type, and the advert or link that brought you to the site.</li>
        </ul>
        <p>We do not ask for, and ask you not to send, payment card details, identity documents or other sensitive personal data through the website.</p>

        <h2>3. Why we use it and our lawful basis</h2>
        <ul>
            <li>To answer your enquiry, prepare quotes and arrange charters, sales, escort or offshore services — <em>to take steps at your request before entering into a contract, and to perform that contract</em>.</li>
            <li>To follow up on a lead form or enquiry and keep a record of our dealings — <em>our legitimate interest in running and growing our business</em>.</li>
            <li>To send our newsletter — <em>your consent</em>, which you can withdraw at any time.</li>
            <li>To measure website traffic and advert performance (Google Analytics, LinkedIn Insight Tag) — <em>your consent</em>, given through the cookie notice.</li>
            <li>To meet legal, regulatory, tax and anti-money-laundering obligations (including SCUML requirements) — <em>legal obligation</em>.</li>
        </ul>

        <h2>4. Cookies and analytics</h2>
        <p>
            The website only loads analytics and advertising cookies after you click “Accept” on the cookie notice. If you click
            “Decline”, none are set. We use Google Analytics 4 to understand which pages are useful, and the LinkedIn Insight Tag and
            TikTok Pixel to measure how our LinkedIn and TikTok adverts perform. Your choice is stored in your browser; to change it, clear this site’s data in
            your browser settings and reload the page.
        </p>

        <h2>5. Who we share it with</h2>
        <p>We do not sell your personal data. We share it only where needed with:</p>
        <ul>
            <li>Service providers who host or process data for us: Supabase (database), Netlify (website hosting), EmailJS and Zoho Mail (email), Google (Analytics), LinkedIn (lead forms and ad measurement), TikTok (ad measurement), and Meta (WhatsApp).</li>
            <li>Vessel owners, operators, sellers, brokers and service partners, where necessary to answer your enquiry or complete a transaction you have asked for.</li>
            <li>Professional advisers, regulators, law enforcement or courts, where the law requires it.</li>
        </ul>

        <h2>6. International transfers</h2>
        <p>
            Some of our providers store data outside Nigeria, and some transactions involve partners abroad (for example, vessels
            located in Asia). Where we transfer data outside Nigeria we rely on the safeguards allowed by the NDPA, such as the
            provider’s contractual data protection commitments, or on the transfer being necessary for a contract you asked for.
        </p>

        <h2>7. How long we keep it</h2>
        <ul>
            <li>Enquiries that do not lead to business: up to 2 years after our last contact.</li>
            <li>Client and transaction records: for as long as the law requires, generally up to 6 years after the transaction ends.</li>
            <li>Newsletter: until you unsubscribe.</li>
            <li>Analytics data: up to 14 months.</li>
        </ul>

        <h2>8. Your rights</h2>
        <p>
            Under the NDPA you can ask to access, correct or delete your personal data, to receive a copy in a portable format, to
            restrict or object to our use of it (including for direct marketing), and to withdraw consent at any time. Email{' '}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we will respond within 30 days. If you are not satisfied,
            you can complain to the Nigeria Data Protection Commission (NDPC).
        </p>

        <h2>9. Security</h2>
        <p>
            We use encrypted connections (HTTPS), access controls and reputable hosting providers to protect your data. No system is
            completely secure; if a breach affects you, we will notify you and the NDPC as the law requires.
        </p>

        <h2>10. Children</h2>
        <p>Our services are for businesses and adults. We do not knowingly collect data from anyone under 18.</p>

        <h2>11. Changes</h2>
        <p>We may update this policy. The date at the top shows the latest version. See also our <Link to="/terms">Terms &amp; Conditions</Link>.</p>
    </LegalPage>
);

export default PrivacyPolicy;
