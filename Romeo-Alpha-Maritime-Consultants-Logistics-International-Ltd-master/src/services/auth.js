import { config } from '../config';

// Step 1: Login Request
export const loginUser = async (email, password) => {
    // Test Account Bypass
    if (email === 'admin@romeoalpha.test' && password === 'admin123') {
        return {
            access_token: 'mock_token',
            user: { id: 'test-admin-id', email: 'admin@romeoalpha.test', user_metadata: { full_name: 'Test Admin' }, role: 'admin' }
        };
    }

    const response = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': config.supabaseAnonKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.msg || 'Login failed');
    }

    // Return access_token and user info
    return data;
};

// Step 3 & 4: Get User Role and Verify
export const verifyAdminRole = async (userId, accessToken) => {
    if (userId === 'test-admin-id' || accessToken === 'mock_token') {
        return { isAdmin: true, full_name: 'Test Admin' };
    }
    
    try {
        // Fetch user details from the 'User' table finding by id (which user copies from auth.users)
        const response = await fetch(`${config.supabaseUrl}/rest/v1/User?id=eq.${userId}&select=role,full_name`, {
            method: 'GET',
            headers: {
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch user role');
        }

        if (data.length === 0) {
            throw new Error('User record not found');
        }

        const userRecord = data[0];
        const isAdmin = userRecord.role === 'admin';

        // Check if role is admin
        return { isAdmin, full_name: userRecord.full_name };
    } catch (error) {
        console.error("Role Verification Error:", error);
        return { isAdmin: false, full_name: null };
    }
};

// Helper to save session
export const saveSession = (accessToken, user) => {
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_user', JSON.stringify(user));
};

export const clearSession = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
};

// Returns the expiry time (ms) of a JWT, or null if it can't be read.
const getTokenExpiry = (token) => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return typeof json.exp === 'number' ? json.exp * 1000 : null;
    } catch {
        return null;
    }
};

/**
 * Returns the saved admin token, or null when there is none or it has expired.
 * An expired token is cleared so it can't be sent to Supabase: an expired JWT
 * makes every request fail with 401, which left public pages (marketplace,
 * certifications) empty for anyone who had once logged in as admin.
 */
export const getSession = () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token || token === 'mock_token') return token;
    const expiresAt = getTokenExpiry(token);
    if (expiresAt && expiresAt <= Date.now() + 30_000) {
        clearSession();
        return null;
    }
    return token;
};
