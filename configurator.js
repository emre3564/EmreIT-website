/**
 * Server Configurator Module: Interactive pricing estimator & quote transfer
 */
import { showToast } from './utils.js';

export function initConfigurator() {
  const formFactorSelect = document.getElementById('cfgFormFactor');
  const cpuSelect = document.getElementById('cfgCpu');
  const ramSelect = document.getElementById('cfgRam');
  const storageSelect = document.getElementById('cfgStorage');
  const networkSelect = document.getElementById('cfgNetwork');
  const osSelect = document.getElementById('cfgOs');
  const priceDisplay = document.getElementById('cfgTotalPrice');
  const specList = document.getElementById('cfgSpecList');
  const transferBtn = document.getElementById('cfgTransferBtn');

  if (!priceDisplay || !transferBtn) return;

  const elements = [formFactorSelect, cpuSelect, ramSelect, storageSelect, networkSelect, osSelect];

  function calculatePrice() {
    let total = 0;
    const selectedSpecs = [];

    elements.forEach(select => {
      if (select) {
        const selectedOption = select.options[select.selectedIndex];
        const cost = parseFloat(selectedOption.getAttribute('data-price') || '0');
        total += cost;

        const label = select.previousElementSibling ? select.previousElementSibling.textContent.replace('*', '').trim() : '';
        selectedSpecs.push({
          label: label,
          value: selectedOption.textContent.trim(),
          cost: cost
        });
      }
    });

    // Animate price update
    priceDisplay.textContent = `$${total.toLocaleString('en-US')}`;

    // Render spec list
    if (specList) {
      specList.innerHTML = selectedSpecs.map(item => `
        <li style="display: flex; justify-content: space-between; font-size: 0.88rem; padding: 0.4rem 0; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-dim);">${item.label}:</span>
          <strong style="color: var(--text-main);">${item.value}</strong>
        </li>
      `).join('');
    }
  }

  // Recalculate on any dropdown change
  elements.forEach(elem => {
    if (elem) {
      elem.addEventListener('change', calculatePrice);
    }
  });

  // Transfer configuration directly to quote inquiry form
  transferBtn.addEventListener('click', () => {
    const serviceSelect = document.getElementById('serviceSelect');
    const messageInput = document.getElementById('message');
    const contactSection = document.getElementById('contact');

    if (serviceSelect) {
      serviceSelect.value = 'Computer Parts & Hardware Solutions';
    }

    if (messageInput) {
      const configurationSummary = [
        `[Automated Server Configurator Specification]`,
        `Estimated Total: ${priceDisplay.textContent}`,
        `Chassis: ${formFactorSelect.options[formFactorSelect.selectedIndex].text}`,
        `CPU: ${cpuSelect.options[cpuSelect.selectedIndex].text}`,
        `RAM: ${ramSelect.options[ramSelect.selectedIndex].text}`,
        `Storage: ${storageSelect.options[storageSelect.selectedIndex].text}`,
        `Network: ${networkSelect.options[networkSelect.selectedIndex].text}`,
        `OS & SLA: ${osSelect.options[osSelect.selectedIndex].text}`,
        `\nAdditional requirements / delivery notes:`
      ].join('\n');

      messageInput.value = configurationSummary;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      showToast('Server configuration transferred to the consultation form below!');
      setTimeout(() => {
        messageInput?.focus();
      }, 700);
    }
  });

  // Initial calculation
  calculatePrice();
}

