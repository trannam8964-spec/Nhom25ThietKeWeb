// ================= TÊN KHÁCH HÀNG =================

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

document.getElementById("welcomeName").innerText = username;

// ================= MÓN NỔI BẬT =================

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

            <div class="product-image">

                <img src="${product.image}" alt="${product.name}">

            </div>


            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="product-category">
                    ${product.category}
                </p>


                <div class="product-bottom">

                    <span class="product-price">
                        ${product.price.toLocaleString("vi-VN")}đ
                    </span>


                    <button class="add-cart">

                        <i class="fa-solid fa-cart-plus"></i>

                    </button>

                </div>

            </div>

        </div>

    `;
}

// ================= THỐNG KÊ ĐƠN HÀNG =================

// Lấy danh sách đơn hàng từ localStorage

let orders = JSON.parse(localStorage.getItem("orders")) || [];

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
  return order.status === "Đang chuẩn bị";
}).length;

// Đếm số đơn đã hoàn thành

let completedOrders = customerOrders.filter(function (order) {
  return order.status === "Đã hoàn thành";
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

document.getElementById("completedOrders").innerText = completedOrders;

document.getElementById("totalSpending").innerText =
  totalSpending.toLocaleString("vi-VN") + "đ";
