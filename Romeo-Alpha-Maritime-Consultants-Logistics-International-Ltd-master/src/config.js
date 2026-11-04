// Configuration for Supabase API
// Configuration for Supabase API
export const config = {
    // PASTE YOUR SUPABASE URL HERE (e.g., https://xyz.supabase.co)
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://kqzxbmvpqcjssusnpepl.supabase.co',

    // PASTE YOUR ANON PUBLIC KEY HERE
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxenhibXZwcWNqc3N1c25wZXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjM4ODcsImV4cCI6MjA4NTczOTg4N30.C1n7PS7n7UoDPQgqVY-ji78TVSSVBxTlmn1tFV01XaA',

    // EMAILJS CONFIGURATION (FOR ZOHO MAIL)
    emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_3hkjfel',
    emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_gvwfajx',
    emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'p-g-nE3GFu7JCps4Q',

    contactPhone: '+2348066184330 / +2348055769660',
    // Clickable numbers (header/footer/contact page and floating WhatsApp button)
    phones: [
        { display: '+234 806 618 4330', tel: '+2348066184330' },
        { display: '+234 805 576 9660', tel: '+2348055769660' },
    ],
    whatsappNumber: '2348055769660', // CEO line, digits only for wa.me
    whatsappMessage: "Hello Romeo Alpha, I'd like to make an enquiry.",

    // ANALYTICS (public IDs, safe to commit). Leave empty to disable tracking entirely.
    // LinkedIn: Campaign Manager > Analyze > Insight Tag > "Partner ID" (digits only)
    linkedinPartnerId: import.meta.env.VITE_LINKEDIN_PARTNER_ID || '10010730',
    // Google Analytics 4: Admin > Data streams > Web > "Measurement ID" (G-XXXXXXXXXX)
    ga4MeasurementId: import.meta.env.VITE_GA4_ID || 'G-8NT2JP7KG8',
    // LinkedIn conversion IDs (Campaign Manager > Analyze > Conversion tracking > each conversion's ID)
    linkedinConversions: {
        lead: import.meta.env.VITE_LI_CONV_LEAD || '',        // contact / marketplace form sent
        quote: import.meta.env.VITE_LI_CONV_QUOTE || '',      // "Get Quotes" clicked
        whatsapp: import.meta.env.VITE_LI_CONV_WHATSAPP || '',// WhatsApp link clicked
        call: import.meta.env.VITE_LI_CONV_CALL || '',        // phone number clicked
    },
};
