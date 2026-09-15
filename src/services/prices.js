import { supabase } from './supabase.js';

export async function getPriceStats(isSuperAdmin = false, userSection = null) {
    let query = supabase().from('patients').select('section, source_of_money, price');
    
    if (!isSuperAdmin && userSection) {
        query = query.eq('section', userSection);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const sectionTotals = {};
    const sourceTotals = {};
    
    data.forEach(p => {
        const price = parseFloat(p.price) || 0;
        
        if (p.section) {
            if (!sectionTotals[p.section]) {
                sectionTotals[p.section] = {
                    label: p.section === 'agamy' ? 'Agamy' : 'Dekhila',
                    total: 0,
                    count: 0,
                };
            }
            sectionTotals[p.section].total += price;
            sectionTotals[p.section].count += 1;
        }
        
        if (p.source_of_money) {
            if (!sourceTotals[p.source_of_money]) {
                sourceTotals[p.source_of_money] = {
                    label: p.source_of_money === 'charity' ? 'Charity' : 'Country',
                    total: 0,
                    count: 0,
                };
            }
            sourceTotals[p.source_of_money].total += price;
            sourceTotals[p.source_of_money].count += 1;
        }
    });
    
    const grandTotal = data.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    
    return { sectionTotals, sourceTotals, grandTotal, totalPatients: data.length };
}

export const SECTION_COLORS = { agamy: 'success', dekhila: 'info' };
export const SECTION_ICONS = { agamy: 'bi-pin-map-fill', dekhila: 'bi-geo-alt-fill' };
export const SOURCE_COLORS = { charity: 'warning', country: 'danger' };
export const SOURCE_ICONS = { charity: 'bi-heart-fill', country: 'bi-flag-fill' };