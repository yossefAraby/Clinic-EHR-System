import en from '../locales/en.json';
import ar from '../locales/ar.json';

const dictionaries = { en, ar };

let currentLocale = 'en';
let translations = dictionaries[currentLocale];

export async function initI18n() {
    const saved = localStorage.getItem('locale') || 'en';
    await setLocale(saved);
}

export async function setLocale(locale) {
    currentLocale = dictionaries[locale] ? locale : 'en';
    translations = dictionaries[currentLocale];
    localStorage.setItem('locale', currentLocale);

    document.documentElement.lang = currentLocale;
    document.documentElement.dir = translations.direction || (currentLocale === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    window.localeChanged?.();
}

export function getLocale() {
    return currentLocale;
}

export function t(key, params = {}) {
    let text = translations[key] ?? key;

    Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`:${k}`, v);
    });

    return text;
}