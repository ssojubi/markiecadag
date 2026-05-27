// ─── Shop Page ────────────────────────────────────────────
const productList = document.getElementById('product-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentCategory = '';

async function loadProducts(category = '') {
  const url = category ? `/api/products?category=${category}` : '/api/products';
  const res = await fetch(url);
  const products = await res.json();

  if (!productList) return;

  if (products.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }

  productList.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <a href="/product?id=${p.id}">
          <img src="${p.image ? '/uploads/' + p.image : '/images/placeholder.jpg'}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p class="price">₱${parseFloat(p.price).toFixed(2)}</p>
        </a>
      </div>`
    )
    .join('');
}

// Filter buttons
if (filterBtns.length > 0) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      loadProducts(currentCategory);
    });
  });
  loadProducts();
}

// ─── Product Detail Page ──────────────────────────────────
const productDetail = document.getElementById('product-detail');

if (productDetail) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    productDetail.innerHTML = '<p>Product not found.</p>';
  } else {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((product) => {
        // Build color and size options from variants
        const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
        const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];

        productDetail.innerHTML = `
          <div class="product-image">
            <img src="${product.image ? '/uploads/' + product.image : '/images/placeholder.jpg'}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">₱${parseFloat(product.price).toFixed(2)}</p>
            <p>${product.description || ''}</p>

            ${colors.length > 0 ? `
              <label>Color:</label>
              <select id="color-select">
                ${colors.map((c) => `<option value="${c}">${c}</option>`).join('')}
              </select>` : ''}

            ${sizes.length > 0 ? `
              <label>Size:</label>
              <select id="size-select">
                ${sizes.map((s) => `<option value="${s}">${s}</option>`).join('')}
              </select>` : ''}

            <p id="stock-info"></p>
            <button class="btn" id="add-to-cart-btn">Add to Cart</button>
            <p id="add-message"></p>
          </div>
        `;

        function getSelectedVariant() {
          const color = document.getElementById('color-select')?.value || null;
          const size = document.getElementById('size-select')?.value || null;
          return product.variants.find(
            (v) => v.color === color && v.size === size
          ) || product.variants[0];
        }

        function updateStock() {
          const variant = getSelectedVariant();
          const stockEl = document.getElementById('stock-info');
          if (stockEl) {
            stockEl.textContent = variant
              ? `${variant.stock} items left`
              : 'Out of stock';
          }
        }

        updateStock();

        document.getElementById('color-select')?.addEventListener('change', updateStock);
        document.getElementById('size-select')?.addEventListener('change', updateStock);

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
          const variant = getSelectedVariant();
          const msg = document.getElementById('add-message');

          if (!variant || variant.stock === 0) {
            msg.textContent = 'This variant is out of stock.';
            return;
          }

          addToCart({
            variant_id: variant.id,
            product_name: product.name,
            color: variant.color,
            size: variant.size,
            price: product.price,
            image: product.image,
          });

          msg.textContent = 'Added to cart!';
          setTimeout(() => (msg.textContent = ''), 2000);
        });
      })
      .catch(() => {
        productDetail.innerHTML = '<p>Failed to load product.</p>';
      });
  }
}
