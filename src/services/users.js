import { supabase } from './supabase.js';

export async function getUsers() {
    const { data, error } = await supabase()
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

// Admin-only operations are implemented as a Supabase Edge Function
// (supabase/functions/manage-user) so the secret service-role key stays server-side.
async function callManageUser(action, payload) {
    const fnUrl = import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '') + '/functions/v1/manage-user';
    const token = (await supabase().auth.getSession()).data.session?.access_token;

    const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, ...payload }),
    });

    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { msg = (await res.json()).error || msg; } catch {}
        throw new Error(msg);
    }

    return res.json();
}

export async function createUser({ email, password, name, is_admin, section }) {
    const data = await callManageUser('create', { email, password, name, is_admin, section });
    return data.user;
}

export async function updateUser(id, { name, is_admin, section, password = null }) {
    return callManageUser('update', { id, name, is_admin, section, password });
}

export async function deleteUser(id) {
    return callManageUser('delete', { id });
}