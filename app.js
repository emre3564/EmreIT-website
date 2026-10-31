/**
 * EmreIT Corporate Website - Main JavaScript Entrypoint (ES Module)
 */
import { initTheme } from './modules/theme.js';
import { initLanguage } from './modules/langManager.js';
import { initNavigation, initScrollSpy } from './modules/navigation.js';
import { initCatalogFilter } from './modules/catalog.js';
import { initConfigurator } from './modules/configurator.js';
import { initContactForm } from './modules/form.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavigation();
  initCatalogFilter();
  initConfigurator();
  initContactForm();
  initScrollSpy();
});
