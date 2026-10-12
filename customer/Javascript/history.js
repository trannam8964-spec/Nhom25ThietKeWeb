// ================= LẤY TÊN KHÁCH HÀNG =================

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// ================= LẤY ĐƠN HÀNG =================

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let orderHistory = document.getElementById("orderHistory");
let clearHistoryButton = document.getElementById("clearHistoryBtn");

function getCustomerOrders() {
  return orders.filter(function (order) {
    return order.username === username;
  });
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
  let customerOrders = getCustomerOrders();
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

      productsHTML += `

                <div class="order-product">

                    <img
                        src="${image}"
                        alt="${item.name}"
                    >

                    <div class="product-info">

                        <h3>${item.name}</h3>

                        <p>${category || "Không có danh mục"}</p>

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
    let status = order.status || "Không xác định";

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
  localStorage.setItem("orders", JSON.stringify(orders));
}

function xoaDonHang(orderId) {
  let orderExists = getCustomerOrders().some(function (order) {
    return String(order.id) === orderId;
  });

  if (
    !orderExists ||
    !confirm("Bạn có chắc muốn xóa đơn hàng này khỏi lịch sử?")
  ) {
    return;
  }

  orders = orders.filter(function (order) {
    return !(order.username === username && String(order.id) === orderId);
  });

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

  orders = orders.filter(function (order) {
    return order.username !== username;
  });

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
  if (event.key !== "orders") {
    return;
  }

  try {
    let updatedOrders = JSON.parse(event.newValue || "[]");
    orders = Array.isArray(updatedOrders) ? updatedOrders : [];
    hienThiLichSu();
  } catch (error) {
    console.error("Không thể cập nhật lịch sử đơn hàng.", error);
  }
});

// ================= CHẠY =================

hienThiLichSu();
