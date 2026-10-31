/**
 * Language Switcher Handler
 */
import { TRANSLATIONS } from './i18n.js';

export function initLanguage() {
  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('emreit_lang') || 'tr';

  if (langSelect) {
    langSelect.value = savedLang;
    setLanguage(savedLang);

    langSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      setLanguage(selected);
      localStorage.setItem('emreit_lang', selected);
    });
  }
}

export function setLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.tr;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });
}

