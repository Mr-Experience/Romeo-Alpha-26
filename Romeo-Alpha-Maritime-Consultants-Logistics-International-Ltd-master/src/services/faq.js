import { config } from '../config';
import { getSession } from './auth';

// Default FAQs to display if no custom FAQs exist in database
const defaultFaqs = [
    {
        id: 'default-1',
        question: 'FAQ_Q1',
        answer: 'FAQ_A1'
    },
    {
        id: 'default-2',
        question: 'FAQ_Q2',
        answer: 'FAQ_A2'
    },
    {
        id: 'default-3',
        question: 'FAQ_Q3',
        answer: 'FAQ_A3'
    },
    {
        id: 'default-4',
        question: 'FAQ_Q4',
        answer: 'FAQ_A4'
    },
    {
        id: 'default-5',
        question: 'FAQ_Q5',
        answer: 'FAQ_A5'
    },
    {
        id: 'default-6',
        question: 'FAQ_Q6',
        answer: 'FAQ_A6'
    },
    {
        id: 'default-7',
        question: 'FAQ_Q7',
        answer: 'FAQ_A7'
    }
];

// Helper for local mock FAQs
const getMockFaqs = () => {
    try {
        const data = localStorage.getItem('mock_faqs');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveMockFaqs = (data) => {
    localStorage.setItem('mock_faqs', JSON.stringify(data));
};

// Get all FAQs from Supabase
export const fetchFaqs = async () => {
    try {
        const token = getSession();
        const response = await fetch(`${config.supabaseUrl}/rest/v1/faqs?select=*&order=display_order.asc`, {
            method: 'GET',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Content-Type': 'application/json'
            }
        });

        let data = [];
        if (response.ok) {
            data = await response.json();
        }

        const faqs = data.length > 0 ? data : defaultFaqs;

        if (token === 'mock_token') {
            const mockFaqs = getMockFaqs();
            // 1. Filter out deleted items
            const deletedIds = new Set(mockFaqs.filter(f => f._deleted).map(f => f.id));
            let filtered = faqs.filter(f => !deletedIds.has(f.id));

            // 2. Overlay modified items
            const modifiedMap = new Map(
                mockFaqs.filter(f => !f._deleted && !f._isNew).map(f => [f.id, f])
            );
            filtered = filtered.map(f => {
                if (modifiedMap.has(f.id)) {
                    return { ...f, ...modifiedMap.get(f.id) };
                }
                return f;
            });

            // 3. Append new items
            const newFaqs = mockFaqs.filter(f => f._isNew);
            filtered = [...filtered, ...newFaqs];
            return filtered;
        }

        return faqs;
    } catch (error) {
        console.error('Error loading FAQs from Supabase:', error);
        const token = getSession();
        if (token === 'mock_token') {
            return getMockFaqs().filter(f => !f._deleted);
        }
        return defaultFaqs;
    }
};

// Add a new FAQ item
export const addFaq = async (faq) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockFaqs = getMockFaqs();
        const newFaq = {
            ...faq,
            id: `mock-faq-${Date.now()}`,
            created_at: new Date().toISOString(),
            display_order: mockFaqs.length + 10,
            _isNew: true
        };
        mockFaqs.push(newFaq);
        saveMockFaqs(mockFaqs);
        return newFaq;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/faqs`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(faq)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add FAQ');
        }

        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("Error adding FAQ:", error);
        throw error;
    }
};

// Update an existing FAQ
export const updateFaq = async (id, updatedFaq) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockFaqs = getMockFaqs();
        if (id.toString().startsWith('mock-faq-')) {
            const index = mockFaqs.findIndex(x => x.id === id);
            if (index !== -1) {
                mockFaqs[index] = { ...mockFaqs[index], ...updatedFaq };
                saveMockFaqs(mockFaqs);
            }
        } else {
            const index = mockFaqs.findIndex(x => x.id === id);
            if (index !== -1) {
                mockFaqs[index] = { ...mockFaqs[index], ...updatedFaq };
            } else {
                mockFaqs.push({ id, ...updatedFaq });
            }
            saveMockFaqs(mockFaqs);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/faqs?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFaq)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update FAQ');
        }

        return true;
    } catch (error) {
        console.error("Error updating FAQ:", error);
        throw error;
    }
};

// Delete a FAQ by ID
export const deleteFaq = async (id) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockFaqs = getMockFaqs();
        if (id.toString().startsWith('mock-faq-')) {
            const updated = mockFaqs.filter(f => f.id !== id);
            saveMockFaqs(updated);
        } else {
            mockFaqs.push({ id, _deleted: true });
            saveMockFaqs(mockFaqs);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/faqs?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete FAQ');
        }

        return true;
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        throw error;
    }
};
