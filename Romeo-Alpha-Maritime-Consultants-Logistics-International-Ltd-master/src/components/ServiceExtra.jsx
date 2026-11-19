import React from 'react';
import { useTranslation } from '../context/TranslationContext';

// Extra written content for a service page, read from 'SX <Name> ...' translation keys.
// Layout: H1, P1, P2, H2 + list (L1..L6), H3, P3, P4.
const ServiceExtra = ({ name }) => {
    const { t } = useTranslation();
    const k = (suffix) => `SX ${name} ${suffix}`;
    const has = (suffix) => t(k(suffix)) !== k(suffix);
    const items = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].filter(has);

    return (
        <section className="service-extra">
            <h3>{t(k('H1'))}</h3>
            <p className="service-description">{t(k('P1'))}</p>
            <p className="service-description">{t(k('P2'))}</p>
            <h3>{t(k('H2'))}</h3>
            <ul className="service-extra-list">
                {items.map((s) => <li key={s}>{t(k(s))}</li>)}
            </ul>
            <h3>{t(k('H3'))}</h3>
            <p className="service-description">{t(k('P3'))}</p>
            <p className="service-description">{t(k('P4'))}</p>
        </section>
    );
};

export default ServiceExtra;
