// ─── Checkout Page ────────────────────────────────────────
const summaryEl = document.getElementById('checkout-summary');
const totalEl = document.getElementById('checkout-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const checkoutMsg = document.getElementById('checkout-message');

function renderCheckoutSummary() {
  const cart = getCart();

  if (!summaryEl) return;

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p>Your cart is empty.</p>';
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  summaryEl.innerHTML = cart
    .map(
      (item) => `
      <div class="checkout-item">
        <span>${item.product_name} ${item.color ? '(' + item.color : ''}${item.size ? ', ' + item.size + ')' : ')'}</span>
        <span>x${item.quantity}</span>
        <span>₱${(item.price * item.quantity).toFixed(2)}</span>
      </div>`
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
}

async function placeOrder() {
  const token = getToken();

  if (!token) {
    window.location.href = '/login';
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    checkoutMsg.textContent = 'Your cart is empty.';
    return;
  }

  // Validate stock first
  const validateRes = await fetch('/api/cart/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })) }),
  });

  const validateData = await validateRes.json();

  if (!validateRes.ok) {
    const issues = validateData.issues.map((i) => i.message).join(', ');
    checkoutMsg.textContent = `Stock issue: ${issues}`;
    return;
  }

  // Place order
  const orderRes = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: cart.map((i) => ({
        variant_id: i.variant_id,
        quantity: i.quantity,
        price_at_purchase: i.price,
      })),
    }),
  });

  const orderData = await orderRes.json();

  if (orderRes.ok) {
    localStorage.removeItem('cart');
    checkoutMsg.textContent = `Order placed! Order #${orderData.order_id}. Thank you!`;
    if (placeOrderBtn) placeOrderBtn.disabled = true;
  } else {
    checkoutMsg.textContent = orderData.message;
  }
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', placeOrder);
}

renderCheckoutSummary();
