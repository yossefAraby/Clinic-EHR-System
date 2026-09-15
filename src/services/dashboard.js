import { supabase } from './supabase.js';

export async function getDashboardStats(userId, isSuperAdmin, userSection = null) {
    let query = supabase().from('patients').select('*');
    
    if (!isSuperAdmin && userSection) {
        query = query.eq('section', userSection);
    }
    
    const { data: patients, error } = await query;
    if (error) throw error;
    
    const total = patients.length;
    const completed = patients.filter(p => p.is_completed).length;
    const pending = total - completed;
    const agamy = patients.filter(p => p.section === 'agamy').length;
    const dekhila = patients.filter(p => p.section === 'dekhila').length;
    const charity = patients.filter(p => p.source_of_money === 'charity').length;
    const country = patients.filter(p => p.source_of_money === 'country').length;
    const totalRevenue = patients.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    
    return { total, completed, pending, agamy, dekhila, charity, country, totalRevenue };
}

export async function getRecentPatients(userId, isSuperAdmin, userSection = null, limit = 5) {
    let query = supabase()
        .from('patients')
        .select('*, users:user_id(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (!isSuperAdmin && userSection) {
        query = query.eq('section', userSection);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(p => ({
        ...p,
        user_name: p.users?.name || 'Unknown'
    }));
}