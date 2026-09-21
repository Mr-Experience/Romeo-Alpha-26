import { config } from '../config';
import { getSession } from './auth';

// Helper to get mock ads
const getMockAds = () => {
    try {
        const stored = localStorage.getItem('mock_ads');
        if (stored) return JSON.parse(stored);
        
        const initial = [
            { id: 'mock-ad-1', image_url: '/images/ads-gallery-1.webp', created_at: new Date().toISOString(), is_active: true },
            { id: 'mock-ad-2', image_url: '/images/ads-gallery-2.webp', created_at: new Date().toISOString(), is_active: true },
            { id: 'mock-ad-3', image_url: '/images/ads-gallery-3.webp', created_at: new Date().toISOString(), is_active: true },
            { id: 'mock-ad-4', image_url: '/images/ads-gallery-4.webp', created_at: new Date().toISOString(), is_active: true }
        ];
        localStorage.setItem('mock_ads', JSON.stringify(initial));
        return initial;
    } catch {
        return [];
    }
};

const saveMockAds = (data) => {
    localStorage.setItem('mock_ads', JSON.stringify(data));
};

export const fetchAds = async () => {
    try {
        const token = getSession();
        const headers = {
            'apikey': config.supabaseAnonKey,
            'Content-Type': 'application/json'
        };
        if (token && token !== 'mock_token') headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${config.supabaseUrl}/rest/v1/ads?select=*&order=created_at.desc`, {
            headers: headers
        });
        
        let data = [];
        if (response.ok) {
            data = await response.json();
        }

        if (token === 'mock_token') {
            const mockAds = getMockAds();
            const deletedIds = new Set(mockAds.filter(a => a._deleted).map(a => a.id));
            data = data.filter(ad => !deletedIds.has(ad.id));
            const newAds = mockAds.filter(a => a._isNew);
            data = [...newAds, ...data];
        }

        return data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        // Fallback to mock ads on error so the carousel isn't blank
        return getMockAds().filter(a => !a._deleted);
    }
};

export const addAd = async (adData) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockAds = getMockAds();
        const newAd = {
            ...adData,
            id: `mock-ad-${Date.now()}`,
            created_at: new Date().toISOString(),
            is_active: true,
            _isNew: true
        };
        mockAds.push(newAd);
        saveMockAds(mockAds);
        return newAd;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/ads`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(adData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding ad:', error);
        throw error;
    }
};

export const deleteAd = async (adId) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockAds = getMockAds();
        if (adId.toString().startsWith('mock-ad-')) {
            const updated = mockAds.filter(a => a.id !== adId);
            saveMockAds(updated);
        } else {
            mockAds.push({ id: adId, _deleted: true });
            saveMockAds(mockAds);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/ads?id=eq.${adId}`, {
            method: 'DELETE',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting ad:', error);
        throw error;
    }
};
