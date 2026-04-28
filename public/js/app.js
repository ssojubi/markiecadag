const CART_KEY = 'mc_cart';
const VIP_KEY = 'mc_vip_member';
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

function isVipMember() {
  return localStorage.getItem(VIP_KEY) === 'true';
}

function setVipMember(active) {
  localStorage.setItem(VIP_KEY, active ? 'true' : 'false');
  document.querySelectorAll('[data-vip-status]').forEach((el) => {
    el.textContent = active ? 'VIP active: 75% RTW discount applied' : 'Join VIP for 75% off RTW';
  });
}

function addStoreItem(item) {
  const cart = getCart();
  const existing = cart.find(
    (entry) => entry.sku === item.sku && entry.size === item.size
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
  const vip = isVipMember();
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vipDiscount = vip
    ? cart
        .filter((item) => item.category === 'RTW')
        .reduce((sum, item) => sum + item.price * item.qty * 0.75, 0)
    : 0;
  return {
    cart,
    vip,
    subtotal,
    vipDiscount,
    discountedSubtotal: Math.max(0, subtotal - vipDiscount),
  };
}

function initVipToggle() {
  document.querySelectorAll('[data-action="vip-toggle"]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = !isVipMember();
      setVipMember(next);
      button.textContent = next ? 'VIP Enabled' : 'Activate VIP';
      window.dispatchEvent(new Event('mc:vip-change'));
    });
  });
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

function initRegistrationVip() {
  const checkbox = document.querySelector('[name="vip_member"]');
  if (!checkbox) return;
  checkbox.checked = isVipMember();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setVipMember(isVipMember());
  initVipToggle();
  initAppointmentForm();
  initChatWidget();
  initSupportForm();
  initRegistrationVip();
});
