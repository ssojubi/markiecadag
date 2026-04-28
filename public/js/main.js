// ─── Auth Helpers ─────────────────────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

function getCustomer() {
  const c = localStorage.getItem('customer');
  return c ? JSON.parse(c) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('customer');
  window.location.href = '/login';
}

// ─── Cart Helpers ─────────────────────────────────────────
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item) {
  // item: { variant_id, product_name, color, size, price, image }
  const cart = getCart();
  const existing = cart.find(
    (c) => c.variant_id === item.variant_id
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  alert(`${item.product_name} added to cart!`);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

// ─── Nav State ────────────────────────────────────────────
function updateNav() {
  const customer = getCustomer();
  const loginLink = document.getElementById('nav-login');
  const logoutLink = document.getElementById('nav-logout');

  if (customer) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) {
      logoutLink.style.display = 'inline';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }
}

// ─── Login Page Logic ─────────────────────────────────────
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const msg = document.getElementById('login-message');

    if (!email || !password) {
      msg.textContent = 'Please fill in all fields.';
      return;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      window.location.href = '/';
    } else {
      msg.textContent = data.message;
    }
  });
}

// ─── Register Page Logic ──────────────────────────────────
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const msg = document.getElementById('register-message');

    if (!name || !email || !password) {
      msg.textContent = 'Name, email, and password are required.';
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = 'Account created! Redirecting to login...';
      setTimeout(() => (window.location.href = '/login'), 1500);
    } else {
      msg.textContent = data.message;
    }
  });
}

// ─── Homepage Featured Products ───────────────────────────
const featuredGrid = document.getElementById('featured-products');
if (featuredGrid) {
  fetch('/api/products')
    .then((res) => res.json())
    .then((products) => {
      const featured = products.slice(0, 4);
      featuredGrid.innerHTML = featured
        .map(
          (p) => `
          <div class="product-card">
            <a href="/product?id=${p.id}">
              <img src="${p.image ? '/uploads/' + p.image : '/images/placeholder.jpg'}" alt="${p.name}" />
              <h3>${p.name}</h3>
              <p>₱${parseFloat(p.price).toFixed(2)}</p>
            </a>
          </div>`
        )
        .join('');
    });
}

// ─── Init ─────────────────────────────────────────────────
updateNav();
updateCartCount();
