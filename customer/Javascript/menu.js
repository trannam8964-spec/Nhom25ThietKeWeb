const menuProducts = document.getElementById("menuProducts");
const searchInput = document.getElementById("searchInput");
const categoryButtons = [...document.querySelectorAll(".category-btn")];
let activeCategory = "Tất cả";

function normalizeMenuText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLocaleLowerCase("vi")
    .trim();
}

function escapeMenuHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function hienThiSanPham(danhSach) {
  if (!danhSach.length) {
    menuProducts.innerHTML = '<p class="menu-empty">Không tìm thấy món phù hợp.</p>';
    return;
  }

  menuProducts.innerHTML = danhSach.map((product) => `
    <div class="product-card" data-product-id="${escapeMenuHTML(product.id)}">
      <div class="product-image">
        <img src="${escapeMenuHTML(product.image)}" alt="${escapeMenuHTML(product.name)}">
      </div>
      <div class="product-info">
        <h3>${escapeMenuHTML(product.name)}</h3>
        <p class="product-category">${escapeMenuHTML(product.category)}</p>
        <div class="product-bottom">
          <span class="product-price">${(Number(product.price) || 0).toLocaleString("vi-VN")}đ</span>
          <button class="add-cart" type="button" aria-label="Thêm ${escapeMenuHTML(product.name)} vào giỏ hàng">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function locSanPham() {
  const query = normalizeMenuText(searchInput.value);
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Tất cả" || product.category === activeCategory;
    const searchableText = [product.name, product.category, product.description].join(" ");
    return matchesCategory && normalizeMenuText(searchableText).includes(query);
  });
  hienThiSanPham(filteredProducts);
}

const requestedSearch = new URLSearchParams(window.location.search).get("search");
if (requestedSearch) searchInput.value = requestedSearch;

searchInput.addEventListener("input", locSanPham);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    locSanPham();
  });
});

menuProducts.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;

  const productId = card.dataset.productId;
  if (event.target.closest(".add-cart")) {
    themVaoGio(productId);
    return;
  }

  xemChiTiet(productId);
});

function themVaoGio(id) {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) return;

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }

  const cartItem = cart.find((item) => String(item.id) === String(id));
  if (cartItem) {
    cartItem.quantity = (Number(cartItem.quantity) || 0) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  if (window.updateCartCount) window.updateCartCount();
  alert("Đã thêm " + product.name + " vào giỏ hàng!");
}

function xemChiTiet(id) {
  window.location.href = "product-details.html?id=" + encodeURIComponent(id);
}

locSanPham();

window.addEventListener("storage", (event) => {
  if (event.key === "hoianCoffeeProducts" && window.loadCoffeeProducts) {
    products = window.loadCoffeeProducts();
    locSanPham();
  }
});
