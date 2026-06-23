import { config } from '../config';

export const fetchTeam = async () => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/staff_team?select=*&order=display_order.asc`, {
        headers: {
            'apikey': config.supabaseAnonKey
        }
    });
    if (!response.ok) throw new Error('Failed to fetch team');
    return response.json();
};


export const addTeamMember = async (member) => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/staff_team`, {
        method: 'POST',
        headers: {
            'apikey': config.supabaseAnonKey,
            'Authorization': `Bearer ${localStorage.getItem('supabaseToken')}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(member)
    });
    if (!response.ok) throw new Error('Failed to add team member');
    return response.json();
};

export const updateTeamMember = async (id, member) => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/staff_team?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'apikey': config.supabaseAnonKey,
            'Authorization': `Bearer ${localStorage.getItem('supabaseToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
    });
    if (!response.ok) throw new Error('Failed to update team member');
    return response.json();
};

export const deleteTeamMember = async (id) => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/staff_team?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            'apikey': config.supabaseAnonKey,
            'Authorization': `Bearer ${localStorage.getItem('supabaseToken')}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete team member');
    return true;
};
