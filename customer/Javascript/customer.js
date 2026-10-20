//  TÊN KHÁCH HÀNG

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

document.getElementById("welcomeName").innerText = username;

//  MÓN NỔI BẬT

// Lấy khu vực hiển thị món nổi bật

let featuredProducts = document.getElementById("featuredProducts");

// Sắp xếp món theo số lượng đã bán

let featured = [...products].sort(function (a, b) {
  return b.sold - a.sold;
});

// Lấy 4 món bán chạy nhất

featured = featured.slice(0, 4);

// Hiển thị từng món

for (let product of featured) {
  featuredProducts.innerHTML += `

        <div class="product-card">

            <a class="product-image featured-product-link"
               href="/customer/menu/menu.html?search=${encodeURIComponent(product.name)}"
               aria-label="Xem ${product.name} trong menu">
                <img src="${product.image}" alt="${product.name}">
            </a>


            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="product-category">
                    ${product.category}
                </p>


                <div class="product-bottom">

                    <span class="product-price">
                        ${product.price.toLocaleString("vi-VN")}đ
                    </span>


                    <button class="add-cart" type="button"
                            data-product-id="${product.id}"
                            aria-label="Đặt ${product.name}">

                        <i class="fa-solid fa-cart-plus"></i>

                    </button>

                </div>

            </div>

        </div>

    `;
}

featuredProducts.addEventListener("click", function (event) {
  const addButton = event.target.closest(".add-cart[data-product-id]");
  if (!addButton) return;

  event.preventDefault();
  event.stopPropagation();

  const product = products.find(
    (item) => String(item.id) === String(addButton.dataset.productId),
  );
  if (!product) return;

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }

  const cartItem = cart.find(
    (item) =>
      String(item.id) === String(product.id) &&
      String(item.cartKey || item.id) === String(product.id),
  );
  if (cartItem) {
    cartItem.quantity = (Number(cartItem.quantity) || 0) + 1;
  } else {
    cart.push({
      id: product.id,
      cartKey: String(product.id),
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "/customer/GioHang/cart.html";
});

//  THỐNG KÊ ĐƠN HÀNG

// Lấy danh sách đơn hàng từ localStorage

let orders = window.CoffeeData.readArray("orders");

function normalizeCustomerName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

let authSession = {};
let customerProfile = {};

try {
  authSession = JSON.parse(localStorage.getItem("authSession") || "{}");
} catch {
  authSession = {};
}

try {
  customerProfile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
} catch {
  customerProfile = {};
}

let customerIdentifiers = new Set(
  [
    username,
    authSession.username,
    authSession.displayName,
    customerProfile.fullName,
  ]
    .map(normalizeCustomerName)
    .filter(Boolean),
);

let customerOrders = orders.filter(function (order) {
  let owner = order.username || order.customerName || order.customer;
  return owner && customerIdentifiers.has(normalizeCustomerName(owner));
});

let ordersHaveOwners = orders.some(function (order) {
  return order.username || order.customerName || order.customer;
});

if (customerOrders.length === 0 && !ordersHaveOwners) {
  customerOrders = orders;
}

// Tổng số đơn hàng của khách hiện tại

let totalOrders = customerOrders.length;

// Đếm số đơn đang chuẩn bị

let preparingOrders = customerOrders.filter(function (order) {
  return window.CoffeeData.normalizeStatus(order.status) === "preparing";
}).length;

let pendingOrders = customerOrders.filter(function (order) {
  return window.CoffeeData.normalizeStatus(order.status) === "pending";
}).length;

let deliveringOrders = customerOrders.filter(function (order) {
  return window.CoffeeData.normalizeStatus(order.status) === "delivering";
}).length;

// Đếm số đơn đã hoàn thành

let completedOrders = customerOrders.filter(function (order) {
  return window.CoffeeData.normalizeStatus(order.status) === "completed";
}).length;

let cancelledOrders = customerOrders.filter(function (order) {
  return window.CoffeeData.normalizeStatus(order.status) === "cancelled";
}).length;

let totalSpending = customerOrders.reduce(function (total, order) {
  let savedTotal = Number(order.total);

  if (Number.isFinite(savedTotal) && savedTotal > 0) {
    return total + savedTotal;
  }

  let itemsTotal = (Array.isArray(order.items) ? order.items : []).reduce(
    function (itemsSum, item) {
      return (
        itemsSum + (Number(item.price) || 0) * (Number(item.quantity) || 0)
      );
    },
    0,
  );

  return total + itemsTotal;
}, 0);

// Hiển thị lên trang chủ

document.getElementById("totalOrders").innerText = totalOrders;

document.getElementById("preparingOrders").innerText = preparingOrders;

document.getElementById("pendingOrders").innerText = pendingOrders;

document.getElementById("deliveringOrders").innerText = deliveringOrders;

document.getElementById("completedOrders").innerText = completedOrders;

document.getElementById("cancelledOrders").innerText = cancelledOrders;

document.getElementById("totalSpending").innerText =
  totalSpending.toLocaleString("vi-VN") + "đ";

function refreshCustomerOrderStats() {
  orders = window.CoffeeData.readArray("orders");
  const latestOrders = orders.filter((order) => {
    const owner = order.username || order.customerName || order.customer;
    return owner && customerIdentifiers.has(normalizeCustomerName(owner));
  });
  customerOrders =
    latestOrders.length || ordersHaveOwners ? latestOrders : orders;
  totalOrders = customerOrders.length;
  preparingOrders = customerOrders.filter(
    (order) => window.CoffeeData.normalizeStatus(order.status) === "preparing",
  ).length;
  pendingOrders = customerOrders.filter(
    (order) => window.CoffeeData.normalizeStatus(order.status) === "pending",
  ).length;
  deliveringOrders = customerOrders.filter(
    (order) => window.CoffeeData.normalizeStatus(order.status) === "delivering",
  ).length;
  completedOrders = customerOrders.filter(
    (order) => window.CoffeeData.normalizeStatus(order.status) === "completed",
  ).length;
  cancelledOrders = customerOrders.filter(
    (order) => window.CoffeeData.normalizeStatus(order.status) === "cancelled",
  ).length;
  totalSpending = customerOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );
  document.getElementById("totalOrders").innerText = totalOrders;
  document.getElementById("pendingOrders").innerText = pendingOrders;
  document.getElementById("preparingOrders").innerText = preparingOrders;
  document.getElementById("deliveringOrders").innerText = deliveringOrders;
  document.getElementById("completedOrders").innerText = completedOrders;
  document.getElementById("cancelledOrders").innerText = cancelledOrders;
  document.getElementById("totalSpending").innerText =
    totalSpending.toLocaleString("vi-VN") + "đ";
}

window.addEventListener("storage", (event) => {
  if (event.key === "orders") refreshCustomerOrderStats();
});
window.addEventListener("coffee:datachange", (event) => {
  if (event.detail === "orders") refreshCustomerOrderStats();
});

window.addEventListener("focus", refreshCustomerOrderStats);
window.addEventListener("pageshow", refreshCustomerOrderStats);
