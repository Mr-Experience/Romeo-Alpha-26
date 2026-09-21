import { config } from '../config';
import { getSession } from './auth';

const SUPABASE_URL = config.supabaseUrl;
const API_KEY = config.supabaseAnonKey;

const getHeaders = () => {
    const token = getSession();
    return {
        'apikey': API_KEY,
        'Authorization': `Bearer ${token && token !== 'mock_token' ? token : API_KEY}`,
        'Content-Type': 'application/json'
    };
};

export const getCertifications = async () => {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/certifications?select=*&order=created_at.asc`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch certifications');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching certifications:', error);
        throw error;
    }
};

export const addCertification = async (data) => {
    const token = getSession();
    if (token === 'mock_token') {
        return { ...data, id: `mock-cert-${Date.now()}` };
    }
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/certifications`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to add certification');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding certification:', error);
        throw error;
    }
};

export const updateCertification = async (id, data) => {
    const token = getSession();
    if (token === 'mock_token') return true;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/certifications?id=eq.${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update certification');
        }

        return true;
    } catch (error) {
        console.error('Error updating certification:', error);
        throw error;
    }
};

export const deleteCertification = async (id) => {
    const token = getSession();
    if (token === 'mock_token') return true;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/certifications?id=eq.${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete certification');
        }

        return true;
    } catch (error) {
        console.error('Error deleting certification:', error);
        throw error;
    }
};

export const uploadCertificationImage = async (file) => {
    const token = getSession();
    if (token === 'mock_token') {
        return '/images/cac-certificate.webp'; // Mock placeholder
    }
    try {
        // Use the same storage bucket or create a new one, here we assume "images" bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `certifications/${fileName}`;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${filePath}`, {
            method: 'POST',
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const data = await response.json();
        
        // Return the public URL
        return `${SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
