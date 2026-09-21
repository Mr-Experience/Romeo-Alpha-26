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

    contactPhone: '+2348066184330 / +2348055769660'
};
