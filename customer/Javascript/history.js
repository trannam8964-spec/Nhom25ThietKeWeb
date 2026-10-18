// ================= LẤY TÊN KHÁCH HÀNG =================

let username = localStorage.getItem("username");
let customerSession = {};
let customerProfile = {};
try {
  customerSession = JSON.parse(localStorage.getItem("authSession") || "{}");
  customerProfile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
} catch {
  customerSession = {};
  customerProfile = {};
}

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// ================= LẤY ĐƠN HÀNG =================

let orders = window.CoffeeData.readArray("orders");

let orderHistory = document.getElementById("orderHistory");
let clearHistoryButton = document.getElementById("clearHistoryBtn");

function getCustomerOrders() {
  return orders.filter(function (order) {
    return (
      order.username === (customerSession.username || username) ||
      order.customerName === (customerProfile.fullName || username)
    );
  });
}

function orderTimestamp(order) {
  const value = order.createdAt || order.orderDate || order.date || order.time;
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

// ================= HIỂN THỊ LỊCH SỬ =================

function hienThiLichSu() {
  orderHistory.innerHTML = "";
  let customerOrders = getCustomerOrders().sort(
    (first, second) => orderTimestamp(second) - orderTimestamp(first),
  );
  clearHistoryButton.disabled = customerOrders.length === 0;

  // Không có đơn hàng
  if (customerOrders.length === 0) {
    orderHistory.innerHTML = `
            <div class="empty-history">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <h3>Chưa có đơn hàng</h3>

                <p>Bạn chưa đặt đơn hàng nào.</p>

            </div>
        `;

    return;
  }

  // Duyệt từng đơn hàng
  for (let order of customerOrders) {
    let productsHTML = "";

    // Duyệt các món trong đơn
    for (let item of Array.isArray(order.items) ? order.items : []) {
      if (typeof item === "string") {
        productsHTML += `
                <div class="order-product">
                    <div class="product-info">
                        <h3>${escapeHtml(item)}</h3>
                    </div>
                </div>
            `;
        continue;
      }

      // Tìm lại sản phẩm trong data.js
      let product = products.find(function (product) {
        return product.id === item.id || product.name === item.name;
      });

      // Nếu dữ liệu trong order bị thiếu
      // thì lấy từ products
      let image = item.image;

      if (!image && product) {
        image = product.image;
      }

      let category = item.category;

      if (!category && product) {
        category = product.category;
      }

      let price = item.price;

      if (!price && product) {
        price = product.price;
      }

      let thanhTien = price * item.quantity;
      let customization = item.customization || {};
      let customizationLabel = [customization.sweetness, customization.ice]
        .filter(Boolean)
        .join(" · ");

      productsHTML += `

                <div class="order-product">

                    <img
                        src="${image}"
                        alt="${item.name}"
                    >

                    <div class="product-info">

                        <h3>${item.name}</h3>

                        <p>${category || "Không có danh mục"}</p>
                        ${customizationLabel ? `<small class="order-customization">${escapeHtml(customizationLabel)}</small>` : ""}

                    </div>


                    <div class="product-quantity">

                        x${item.quantity}

                    </div>


                    <div class="product-price">

                        ${thanhTien.toLocaleString("vi-VN")}đ

                    </div>

                </div>

            `;
    }

    // Nếu đơn cũ không có ngày
    let orderDate = order.date || "Không có ngày";

    // Nếu đơn cũ dùng Completed
    // vẫn hiển thị bình thường
    let status =
      {
        pending: "Chờ nhân viên xác nhận",
        preparing: "Đang chuẩn bị",
        delivering: "Đang giao",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
      }[window.CoffeeData.normalizeStatus(order.status)] || order.status;

    // Tạo đơn hàng

    orderHistory.innerHTML += `

            <div class="order-card">

                <div class="order-header">

                    <div>

                        <div class="order-id">

                            Mã đơn: ${order.id}

                        </div>

                        <div class="order-date">

                            ${orderDate}

                        </div>

                    </div>

                    <button
                        class="delete-order-btn"
                        type="button"
                        data-order-id="${order.id}"
                        title="Xóa đơn hàng này"
                        aria-label="Xóa đơn hàng ${order.id}"
                    >
                        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    </button>

                </div>


                <div class="order-body">

                    ${productsHTML}

                </div>


                <div class="order-footer">

                    <span class="order-status">

                        ${status}

                    </span>


                    <div class="order-total">
                      ${Number(order.promotionDiscount) > 0 ? `<span class="order-discount">${order.promotionName || "Ưu đãi"}: -${Number(order.promotionDiscount).toLocaleString("vi-VN")}đ</span>` : ""}
                      <span>Tổng: ${(Number(order.total) || 0).toLocaleString("vi-VN")}đ</span>

                    </div>

                </div>

            </div>

        `;
  }
}

function luuLichSuDonHang() {
  window.CoffeeData.writeArray("orders", orders);
}

function releaseReservedTable(order) {
  if (!order.tableNumber) return;
  const tables = window.CoffeeData.readArray("tables");
  const table = tables.find(
    (item) => item.id === order.tableNumber || item.name === order.tableNumber,
  );
  if (table && table.status === "Đặt trước") {
    table.status = "Trống";
    window.CoffeeData.writeArray("tables", tables);
  }
}

function xoaDonHang(orderId) {
  const orderToRemove = getCustomerOrders().find(function (order) {
    return String(order.id) === orderId && order.status === "pending";
  });

  if (
    !orderToRemove ||
    !confirm("Bạn có chắc muốn xóa đơn hàng này khỏi lịch sử?")
  ) {
    return;
  }

  releaseReservedTable(orderToRemove);
  orders = orders.filter((order) => String(order.id) !== orderId);

  luuLichSuDonHang();
  hienThiLichSu();
}

clearHistoryButton.addEventListener("click", function () {
  let customerOrders = getCustomerOrders();

  if (
    customerOrders.length === 0 ||
    !confirm("Bạn có chắc muốn xóa toàn bộ lịch sử đơn hàng của mình?")
  ) {
    return;
  }

  const pendingIds = new Set(
    customerOrders
      .filter((order) => order.status === "pending")
      .map((order) => String(order.id)),
  );
  customerOrders
    .filter((order) => pendingIds.has(String(order.id)))
    .forEach(releaseReservedTable);
  orders = orders.filter((order) => !pendingIds.has(String(order.id)));

  luuLichSuDonHang();
  hienThiLichSu();
});

orderHistory.addEventListener("click", function (event) {
  let button = event.target.closest(".delete-order-btn");

  if (button) {
    xoaDonHang(button.dataset.orderId);
  }
});

window.addEventListener("storage", function (event) {
  if (!["orders", "customerProfile", "authSession"].includes(event.key)) {
    return;
  }

  try {
    orders = window.CoffeeData.readArray("orders");
    hienThiLichSu();
  } catch (error) {
    console.error("Không thể cập nhật lịch sử đơn hàng.", error);
  }
});

window.addEventListener("coffee:datachange", (event) => {
  if (event.detail === "orders") {
    orders = window.CoffeeData.readArray("orders");
    hienThiLichSu();
  }
});

// ================= CHẠY =================

hienThiLichSu();
