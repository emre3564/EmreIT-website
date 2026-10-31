/**
 * Catalog Module: Interactive Category Filtering and Keyword Search
 */
import { CATALOG_DATA } from './data.js';
import { escapeHtml } from './utils.js';

export function initCatalogFilter() {
  const catalogContainer = document.getElementById('catalogContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('catalogSearch');

  if (!catalogContainer) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function renderItems() {
    const filtered = CATALOG_DATA.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.badge.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      catalogContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
          <svg style="margin: 0 auto 1rem; width: 48px; height: 48px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-muted);">No services or equipment found</p>
          <p style="font-size: 0.9rem;">Try adjusting your search criteria or switching categories.</p>
        </div>
      `;
      return;
    }

    catalogContainer.innerHTML = filtered.map(item => `
      <div class="catalog-item" data-category="${escapeHtml(item.category)}">
        <div class="item-category">${escapeHtml(item.category.toUpperCase())}</div>
        <h4 class="item-title">${escapeHtml(item.title)}</h4>
        <p class="item-desc">${escapeHtml(item.desc)}</p>
        <div class="item-meta">
          <span class="item-badge">${escapeHtml(item.badge)}</span>
          <span style="color: var(--accent-cyan); font-weight: 600; font-size: 0.8rem;">${escapeHtml(item.status)}</span>
        </div>
      </div>
    `).join('');
  }

  // Filter button click listener
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      renderItems();
    });
  });

  // Search input debounced listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderItems();
    });
  }

  // Initial render
  renderItems();
}

