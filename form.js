/**
 * Form Module: Real-time validation, XSS sanitization, online submission & ticket simulation
 */
import { sanitizeInput, showToast } from './utils.js';

export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const serviceSelect = document.getElementById('serviceSelect');
  const messageInput = document.getElementById('message');
  const formAlert = document.getElementById('formAlert');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Full Name
    const nameVal = fullNameInput.value.trim();
    if (nameVal.length < 2) {
      setError(fullNameInput, 'Please provide your valid full name (min 2 characters).');
      isValid = false;
    } else {
      clearError(fullNameInput);
    }

    // Validate Email Address
    const emailVal = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      setError(emailInput, 'Please enter a valid work or corporate email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate Service Selection
    if (!serviceSelect.value) {
      setError(serviceSelect, 'Please select the required service domain.');
      isValid = false;
    } else {
      clearError(serviceSelect);
    }

    // Validate Message Details
    const msgVal = messageInput.value.trim();
    if (msgVal.length < 10) {
      setError(messageInput, 'Please provide project details (minimum 10 characters).');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const sanitizedPayload = {
        name: sanitizeInput(nameVal),
        email: sanitizeInput(emailVal),
        phone: sanitizeInput(phoneInput.value.trim()),
        service: sanitizeInput(serviceSelect.value),
        message: sanitizeInput(msgVal),
        submittedAt: new Date().toISOString(),
        referenceId: `EIT-${Math.floor(100000 + Math.random() * 900000)}`
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="4" stroke="rgba(255,255,255,0.2)"></circle>
          <path d="M4 12a8 8 0 018-8" stroke-width="4" stroke="currentColor"></path>
        </svg> Submitting to NOC Portal...
      `;

      try {
        // Online form API dispatch simulation (ready for Formspree, Formkeep or custom endpoint)
        await new Promise(resolve => setTimeout(resolve, 850));

        // Save submitted ticket locally for offline/session resilience
        try {
          const tickets = JSON.parse(localStorage.getItem('emreit_inquiries') || '[]');
          tickets.push(sanitizedPayload);
          localStorage.setItem('emreit_inquiries', JSON.stringify(tickets));
        } catch {
          // Local storage disabled or full
        }

        form.reset();
        showToast('Online request received! Solution Architect will respond within 2 hours.');

        if (formAlert) {
          formAlert.innerHTML = `
            <div style="display: flex; gap: 0.8rem; align-items: flex-start;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="flex-shrink:0;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong>Online Request Dispatched Successfully!</strong><br>
                Thank you <em>${sanitizedPayload.name}</em>. Your ticket for <strong>${sanitizedPayload.service}</strong> has been registered.<br>
                <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan);">Ticket Reference: #${sanitizedPayload.referenceId}</span>
              </div>
            </div>
          `;
          formAlert.className = 'form-alert success';
          formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (error) {
        showToast('Network error occurred. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  // Real-time error removal on input
  [fullNameInput, emailInput, phoneInput, serviceSelect, messageInput].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', () => clearError(elem));
      elem.addEventListener('change', () => clearError(elem));
    }
  });
}

function setError(inputElement, message) {
  inputElement.classList.add('error');
  const errorSpan = inputElement.parentElement.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
  }
}

function clearError(inputElement) {
  inputElement.classList.remove('error');
  const errorSpan = inputElement.parentElement.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.classList.remove('show');
  }
}

