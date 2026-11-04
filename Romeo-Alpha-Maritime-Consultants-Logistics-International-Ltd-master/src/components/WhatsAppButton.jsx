import { useLocation } from 'react-router-dom';
import { config } from '../config';

/** Floating "Chat on WhatsApp" button (bottom-right) on public pages. */
const WhatsAppButton = () => {
    const { pathname } = useLocation();
    if (/^\/(admin|login)/.test(pathname)) return null;
    const href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;
    return (
        <a className="whatsapp-float" href={href} target="_blank" rel="noopener noreferrer"
            aria-label="Chat with Romeo Alpha on WhatsApp" data-track-label="WhatsApp float">
            <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="#fff">
                <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.4 9.8 10.2 5.1 16 5.1s10.6 4.7 10.6 10.5S21.8 26.1 16 26.1zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/>
            </svg>
            <span className="whatsapp-float-label">Chat with us</span>
        </a>
    );
};

export default WhatsAppButton;
