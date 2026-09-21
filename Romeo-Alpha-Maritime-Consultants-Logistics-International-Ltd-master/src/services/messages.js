import { config } from '../config';
import { getSession } from './auth';

// Helper for local mock contact messages
const getMockMessages = () => {
    try {
        const stored = localStorage.getItem('mock_contact_messages');
        if (stored) return JSON.parse(stored);
        
        // Initial mock data if empty
        const initial = [
            {
                id: 'mock-msg-1',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                full_name: 'John Doe (Logistics)',
                email: 'john.doe@maritime-logistics.com',
                subject: 'Inquiry regarding Tugboat Chartering',
                message: 'Hello, we would like to enquire about the availability of tugboats for chartering in the Port Harcourt area for a 3-month contract starting next month. Please send over rates.',
                is_read: false
            },
            {
                id: 'mock-msg-2',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                full_name: 'Marie Sterling',
                email: 'm.sterling@offshoreops.nl',
                subject: 'Partnership Proposal',
                message: 'Dear Sirs, we are looking for a reliable marine security escort partner in West Africa. We would love to schedule a briefing call next week.',
                is_read: true
            }
        ];
        localStorage.setItem('mock_contact_messages', JSON.stringify(initial));
        return initial;
    } catch {
        return [];
    }
};

const saveMockMessages = (data) => {
    localStorage.setItem('mock_contact_messages', JSON.stringify(data));
};

// Submit a new contact message or inquiry to Supabase
export const submitMessage = async (payload) => {
    try {
        // Also save to mock list so it shows up in dashboard if using dev bypass
        const mockMsgs = getMockMessages();
        mockMsgs.unshift({
            id: `mock-msg-${Date.now()}`,
            created_at: new Date().toISOString(),
            full_name: payload.full_name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            is_read: false
        });
        saveMockMessages(mockMsgs);

        const response = await fetch(`${config.supabaseUrl}/rest/v1/contact_messages`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${config.supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                full_name: payload.full_name,
                email: payload.email,
                subject: payload.subject,
                message: payload.message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit message');
        }

        return true;
    } catch (error) {
        console.error("Error submitting message to Supabase:", error);
        throw error;
    }
};

export const fetchMessages = async () => {
    const token = getSession();
    if (token === 'mock_token') {
        return getMockMessages();
    }

    try {
        const headers = {
            'apikey': config.supabaseAnonKey,
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${config.supabaseUrl}/rest/v1/contact_messages?select=*&order=created_at.desc`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch messages');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const updateMessage = async (id, patch) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const msgs = getMockMessages();
        const index = msgs.findIndex(m => m.id === id);
        if (index !== -1) {
            msgs[index] = { ...msgs[index], ...patch };
            saveMockMessages(msgs);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/contact_messages?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patch)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update message');
        }

        return true;
    } catch (error) {
        console.error('Error updating message:', error);
        throw error;
    }
};

export const deleteMessage = async (id) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const msgs = getMockMessages();
        const updated = msgs.filter(m => m.id !== id);
        saveMockMessages(updated);
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/contact_messages?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete message');
        }

        return true;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};
