// ─── Cart Page ────────────────────────────────────────────
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

function renderCart() {
  const cart = getCart();

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty. <a href="/shop">Continue shopping</a></p>';
    if (cartTotalEl) cartTotalEl.textContent = '₱0.00';
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <img src="${item.image ? '/uploads/' + item.image : '/images/placeholder.jpg'}" alt="${item.product_name}" />
        <div class="cart-item-info">
          <h3>${item.product_name}</h3>
          <p>${item.color ? 'Color: ' + item.color : ''} ${item.size ? '| Size: ' + item.size : ''}</p>
          <p>₱${parseFloat(item.price).toFixed(2)}</p>
          <div class="quantity-controls">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>`
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartTotalEl) cartTotalEl.textContent = `₱${total.toFixed(2)}`;
}

function changeQty(index, delta) {
  const cart = getCart();
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

if (cartItemsEl) renderCart();
