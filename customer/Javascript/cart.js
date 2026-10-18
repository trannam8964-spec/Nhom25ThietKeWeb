const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const serviceFee = document.getElementById("serviceFee");
const promotionNameElement = document.getElementById("promotionName");
const promotionDiscountElement = document.getElementById("promotionDiscount");
const totalPrice = document.getElementById("totalPrice");

let username = localStorage.getItem("username") || "Khách hàng";
try {
  const profile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
  username = profile.fullName || username;
} catch {
  // Keep the name saved by the existing customer pages.
}
document.getElementById("customerName").textContent = username;

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let cart = readCart();

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function customizationLabel(item) {
  const customization = item.customization || {};
  return [customization.sweetness, customization.ice].filter(Boolean).join(" · ");
}

function hienThiGioHang() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
        <h2>Giỏ hàng đang trống</h2>
        <p>Hãy chọn một món trong Menu.</p>
      </div>`;
    tinhTongTien();
    return;
  }

  cartItems.innerHTML = cart
    .map((item, index) => {
      const options = customizationLabel(item);
      return `
        <article class="cart-item">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" />
          <div class="cart-info">
            <h3>${escapeHTML(item.name)}</h3>
            <p>${escapeHTML(item.category || "")}</p>
            ${options ? `<small class="cart-options">${escapeHTML(options)}</small>` : ""}
            <div class="cart-price">${(Number(item.price) || 0).toLocaleString("vi-VN")}đ</div>
          </div>
          <div class="quantity" aria-label="Số lượng ${escapeHTML(item.name)}">
            <button type="button" data-cart-action="decrease" data-cart-index="${index}" aria-label="Giảm số lượng">−</button>
            <span>${Number(item.quantity) || 1}</span>
            <button type="button" data-cart-action="increase" data-cart-index="${index}" aria-label="Tăng số lượng">+</button>
          </div>
          <button class="delete-btn" type="button" data-cart-action="remove" data-cart-index="${index}" aria-label="Xóa ${escapeHTML(item.name)} khỏi giỏ hàng">
            <i class="fa-solid fa-trash" aria-hidden="true"></i>
          </button>
        </article>`;
    })
    .join("");

  tinhTongTien();
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const index = Number(button.dataset.cartIndex);
  const item = cart[index];
  if (!item) return;

  if (button.dataset.cartAction === "increase") {
    item.quantity = (Number(item.quantity) || 0) + 1;
  } else if (button.dataset.cartAction === "decrease") {
    item.quantity = (Number(item.quantity) || 0) - 1;
    if (item.quantity <= 0) cart.splice(index, 1);
  } else if (button.dataset.cartAction === "remove") {
    cart.splice(index, 1);
  }

  luuGioHang();
  hienThiGioHang();
});

function luuGioHang() {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.updateCartCount?.();
}

function tinhTongTien() {
  const tong = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const phiDichVu = 0;
  const promotion = window.tinhKhuyenMai
    ? window.tinhKhuyenMai(cart)
    : { name: "Chưa áp dụng", discount: 0 };
  const uuDai = Number(promotion.discount) || 0;
  const tongCong = tong + phiDichVu - uuDai;

  subtotal.textContent = `${tong.toLocaleString("vi-VN")}đ`;
  serviceFee.textContent = `${phiDichVu.toLocaleString("vi-VN")}đ`;
  promotionNameElement.textContent = promotion.name || "Khuyến mãi";
  promotionDiscountElement.textContent = `-${uuDai.toLocaleString("vi-VN")}đ`;
  totalPrice.textContent = `${tongCong.toLocaleString("vi-VN")}đ`;
}

hienThiGioHang();

function tienHanhDatHang() {
  if (!cart.length) {
    alert("Giỏ hàng đang trống!");
    return;
  }
  window.location.href = "order.html";
}
