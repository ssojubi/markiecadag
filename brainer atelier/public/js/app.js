const CART_KEY = 'mc_cart';
const APPOINTMENTS_KEY = 'mc_appointments';
const ORDERS_KEY = 'mc_orders';
const CHAT_KEY = 'mc_chat_open';

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function peso(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(value);
}

function getCart() {
  return readJson(CART_KEY, []);
}

function saveCart(cart) {
  writeJson(CART_KEY, cart);
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + (item.qty || 0), 0);
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = String(count);
  });
}

function addStoreItem(item) {
  const cart = getCart();
  const existing = cart.find(
    (entry) =>
      entry.sku === item.sku &&
      entry.size === item.size &&
      (entry.color || '') === (item.color || '')
  );

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  return cart;
}

function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
}

function getCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return {
    cart,
    subtotal,
    total: subtotal,
  };
}

function initAppointmentForm() {
  const form = document.querySelector('[data-appointment-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const appointments = readJson(APPOINTMENTS_KEY, []);
    appointments.push({
      ...data,
      createdAt: new Date().toISOString(),
      id: `APT-${Date.now()}`,
    });
    writeJson(APPOINTMENTS_KEY, appointments);
    form.reset();
    const message = document.querySelector('[data-appointment-message]');
    if (message) {
      message.textContent =
        'Consultation request saved. The atelier team can now confirm your fitting schedule.';
    }
  });
}

function initChatWidget() {
  const button = document.querySelector('.chat-btn');
  const panel = document.querySelector('.chat-panel');
  const close = document.querySelector('[data-chat-close]');
  if (!button || !panel) return;

  const sync = () => {
    const open = localStorage.getItem(CHAT_KEY) === 'true';
    panel.hidden = !open;
  };

  button.addEventListener('click', () => {
    const open = localStorage.getItem(CHAT_KEY) === 'true';
    localStorage.setItem(CHAT_KEY, open ? 'false' : 'true');
    sync();
  });

  if (close) {
    close.addEventListener('click', () => {
      localStorage.setItem(CHAT_KEY, 'false');
      sync();
    });
  }

  sync();
}

function initSupportForm() {
  const form = document.querySelector('[data-support-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]').value || 'Client';
    const reply = document.querySelector('[data-support-reply]');
    if (reply) {
      reply.textContent =
        `${name}, support request received. Our team will reply about courier status, couture booking, or RTW sizing within one business day.`;
    }
    form.reset();
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.navbar-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initAppointmentForm();
  initChatWidget();
  initSupportForm();
  initMobileMenu();
});

window.openLegalModal = async function(type, event) {
  if(event) event.preventDefault();
  
  let modal = document.getElementById('legal-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'legal-modal';
    modal.className = 'legal-modal-backdrop';
    modal.innerHTML = `
      <div class="legal-modal-panel">
        <div class="legal-modal-header">
          <h3 id="legal-modal-title">Loading...</h3>
          <button class="legal-modal-close" onclick="closeLegalModal()">&times;</button>
        </div>
        <div class="legal-modal-body" id="legal-modal-content">
          <p>Loading policy details...</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if(e.target === modal) closeLegalModal();
    });
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const titleEl = document.getElementById('legal-modal-title');
  const contentEl = document.getElementById('legal-modal-content');
  titleEl.textContent = type === 'privacy' ? 'Privacy Policy' : type === 'shipping' ? 'Shipping Policy' : 'Terms & Conditions';
  contentEl.innerHTML = '<p>Loading policy details...</p>';

  try {
    const url = type === 'privacy' ? '/privacy.html' : type === 'shipping' ? '/shipping.html' : '/terms.html';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load');
    const htmlText = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const container = doc.querySelector('.container') || doc.body;
    
    const mainHeading = container.querySelector('h1');
    if(mainHeading) mainHeading.remove();
    const eyebrow = container.querySelector('.section-eyebrow');
    if(eyebrow) eyebrow.remove();
    
    contentEl.innerHTML = container.innerHTML;
  } catch (error) {
    contentEl.innerHTML = '<p>Error loading policy. Please try again later.</p>';
  }
};

window.closeLegalModal = function() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
