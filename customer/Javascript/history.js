// ================= LẤY TÊN KHÁCH HÀNG =================

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// ================= LẤY ĐƠN HÀNG =================

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let orderHistory = document.getElementById("orderHistory");

// ================= HIỂN THỊ LỊCH SỬ =================

function hienThiLichSu() {
  orderHistory.innerHTML = "";

  // Không có đơn hàng
  if (orders.length === 0) {
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
  for (let order of orders) {
    let productsHTML = "";

    // Duyệt các món trong đơn
    for (let item of order.items) {
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

                </div>


                <div class="order-body">

                    ${productsHTML}

                </div>


                <div class="order-footer">

                    <span class="order-status">

                        ${status}

                    </span>


                    <div class="order-total">

                        Tổng: ${order.total.toLocaleString("vi-VN")}đ

                    </div>

                </div>

            </div>

        `;
  }
}

// ================= CHẠY =================

hienThiLichSu();
