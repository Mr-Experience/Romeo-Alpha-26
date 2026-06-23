import { config } from '../config';
import { getSession } from './auth';

// Helper for local mock subscriptions
const getMockSubscriptions = () => {
    try {
        const stored = localStorage.getItem('mock_newsletter_subscriptions');
        if (stored) return JSON.parse(stored);
        
        const initial = [
            { id: 'mock-sub-1', email: 'newsletter-subscriber-1@company.com', created_at: new Date(Date.now() - 36000000).toISOString() },
            { id: 'mock-sub-2', email: 'vessel-buyer-group@gmail.com', created_at: new Date(Date.now() - 172800000).toISOString() }
        ];
        localStorage.setItem('mock_newsletter_subscriptions', JSON.stringify(initial));
        return initial;
    } catch {
        return [];
    }
};

const saveMockSubscriptions = (data) => {
    localStorage.setItem('mock_newsletter_subscriptions', JSON.stringify(data));
};

export const fetchNewsletterSubscriptions = async () => {
    const token = getSession();
    if (token === 'mock_token') {
        return getMockSubscriptions();
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/newsletter_subscriptions?select=*&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch subscriptions');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        throw error;
    }
};

export const deleteNewsletterSubscription = async (id) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const subs = getMockSubscriptions();
        const updated = subs.filter(s => s.id !== id);
        saveMockSubscriptions(updated);
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/newsletter_subscriptions?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete subscription');
        }

        return true;
    } catch (error) {
        console.error("Error deleting subscription:", error);
        throw error;
    }
};

export const subscribeToNewsletter = async (email) => {
    try {
        // Also save to mock storage
        const subs = getMockSubscriptions();
        subs.unshift({
            id: `mock-sub-${Date.now()}`,
            email,
            created_at: new Date().toISOString()
        });
        saveMockSubscriptions(subs);

        const response = await fetch(`${config.supabaseUrl}/rest/v1/newsletter_subscriptions`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ email, created_at: new Date().toISOString() })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to subscribe');
        }

        return true;
    } catch (error) {
        console.error('Subscription Error:', error);
        throw error;
    }
};
