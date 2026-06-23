import { config } from '../config';
import { getSession } from './auth';

// Helper to get mock items from localStorage
const getMockData = () => {
    try {
        const stored = localStorage.getItem('mock_marketplace_items');
        if (stored) return JSON.parse(stored);

        const initial = [
            {
                id: 'mock-initial-1',
                category: 'sale',
                title: 'Premium Marine Cargo Vessel',
                description: 'High-capacity cargo container vessel in excellent operational condition. Equipped with modern navigation systems, efficient propulsion, and certified cargo holds. Fully vetted and ready for international transit.',
                gallery: ['/images/ads-gallery-1.webp', '/images/ads-gallery-2.webp'],
                price: '1250000',
                position: 'Immediate',
                created_at: new Date(Date.now() - 36000000).toISOString(),
                is_active: true
            },
            {
                id: 'mock-initial-2',
                category: 'sale',
                title: 'Bala Mulu Escort Vessel',
                description: 'Fast marine security escort vessel equipped with radar, defense communication systems, and high-speed twin diesel engines. Ideal for offshore support, crew changes, and naval patrol duties.',
                gallery: ['/images/security-escort.webp', '/images/security-patrol.webp'],
                price: '780000',
                position: 'Immediate',
                created_at: new Date(Date.now() - 72000000).toISOString(),
                is_active: true
            },
            {
                id: 'mock-initial-3',
                category: 'hire',
                title: 'Offshore Tug Support Vessel',
                description: 'High-bollard pull tugboat suitable for offshore oil rig towing, positioning, and supply logistics. Features robust winch systems, fire-fighting monitors, and ample deck space.',
                gallery: ['/images/ads-gallery-2.webp', '/images/ads-gallery-3.webp'],
                price: '15000',
                position: 'In 2 weeks',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                is_active: true
            },
            {
                id: 'mock-initial-4',
                category: 'scrap',
                title: 'Scrap Steel Cargo Hull',
                description: 'Decommissioned heavy steel bulk carrier hull ready for dismantling and recycling. Offers high-grade marine steel plating and structures. Available for towing to shipyard.',
                gallery: ['/images/ads-gallery-3.webp'],
                price: '45000',
                position: 'Immediate',
                created_at: new Date(Date.now() - 259200000).toISOString(),
                is_active: true
            }
        ];
        localStorage.setItem('mock_marketplace_items', JSON.stringify(initial));
        return initial;
    } catch {
        return [];
    }
};

const saveMockData = (data) => {
    localStorage.setItem('mock_marketplace_items', JSON.stringify(data));
};

export const fetchMarketplaceItems = async () => {
    try {
        const token = getSession();
        
        // Fetch real items first
        const headers = {
            'apikey': config.supabaseAnonKey,
            'Content-Type': 'application/json'
        };

        if (token && token !== 'mock_token') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${config.supabaseUrl}/rest/v1/marketplace_items?select=*&order=created_at.desc`, {
            method: 'GET',
            headers: headers
        });

        let data = [];
        if (response.ok) {
            data = await response.json();
        } else {
            console.warn("Failed to fetch live marketplace items, falling back to mock only");
        }

        // Apply mock overlays if we are in mock session
        if (token === 'mock_token') {
            const mockItems = getMockData();
            
            // 1. Filter out deleted items
            const deletedIds = new Set(mockItems.filter(item => item._deleted).map(item => item.id));
            data = data.filter(item => !deletedIds.has(item.id));

            // 2. Overlay modified items
            const modifiedMap = new Map(
                mockItems.filter(item => !item._deleted && !item._isNew).map(item => [item.id, item])
            );
            data = data.map(item => {
                if (modifiedMap.has(item.id)) {
                    return { ...item, ...modifiedMap.get(item.id) };
                }
                return item;
            });

            // 3. Prepend new items
            const newItems = mockItems.filter(item => item._isNew);
            data = [...newItems, ...data];
        }

        return data;
    } catch (error) {
        console.error("Error fetching marketplace items:", error);
        // Fallback to mock data on error so the marketplace page isn't blank
        return getMockData().filter(item => !item._deleted);
    }
};

export const addMarketplaceItem = async (item) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockItems = getMockData();
        const newItem = {
            ...item,
            id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            is_active: true,
            _isNew: true
        };
        mockItems.push(newItem);
        saveMockData(mockItems);
        return newItem;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/marketplace_items`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add marketplace item');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding marketplace item:", error);
        throw error;
    }
};

export const deleteMarketplaceItem = async (id) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockItems = getMockData();
        // If it was a mock-created item, just remove it
        if (id.toString().startsWith('mock-')) {
            const updated = mockItems.filter(item => item.id !== id);
            saveMockData(updated);
        } else {
            // If it's a real item, mark it as deleted
            mockItems.push({ id, _deleted: true });
            saveMockData(mockItems);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/marketplace_items?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete marketplace item');
        }

        return true;
    } catch (error) {
        console.error("Error deleting marketplace item:", error);
        throw error;
    }
};

export const updateMarketplaceItem = async (id, item) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        const mockItems = getMockData();
        if (id.toString().startsWith('mock-')) {
            // Edit the mock-created item in place
            const index = mockItems.findIndex(x => x.id === id);
            if (index !== -1) {
                mockItems[index] = { ...mockItems[index], ...item };
                saveMockData(mockItems);
            }
        } else {
            // Edit a real item: check if we already have an overlay
            const index = mockItems.findIndex(x => x.id === id);
            if (index !== -1) {
                mockItems[index] = { ...mockItems[index], ...item };
            } else {
                mockItems.push({ id, ...item });
            }
            saveMockData(mockItems);
        }
        return true;
    }

    try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/marketplace_items?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update marketplace item');
        }

        return true;
    } catch (error) {
        console.error("Error updating marketplace item:", error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    const token = getSession();
    if (!token) throw new Error('No authentication token found');

    if (token === 'mock_token') {
        // Return a local placeholder image so it always renders in dev mode
        const mockImages = [
            '/images/hero-v3.webp',
            '/images/ads-gallery-1.webp',
            '/images/ads-gallery-2.webp',
            '/images/ads-gallery-3.webp',
            '/images/ads-gallery-4.webp'
        ];
        // Pick a deterministic image based on filename hash
        const hash = file.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return mockImages[hash % mockImages.length];
    }

    try {
        const sanitizedName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
        const fileName = `${Date.now()}_${sanitizedName}`;
        const response = await fetch(`${config.supabaseUrl}/storage/v1/object/marketplace/${fileName}`, {
            method: 'POST',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Content-Type': file.type
            },
            body: file
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload image');
        }

        const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/marketplace/${fileName}`;
        return publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
