// LẤY ELEMENT

let orderItems = document.getElementById("orderItems");

let subtotal = document.getElementById("subtotal");

let serviceFee = document.getElementById("serviceFee");

let totalPrice = document.getElementById("totalPrice");

// LẤY TÊN KHÁCH

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// LẤY GIỎ HÀNG

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// HIỂN THỊ ĐƠN HÀNG

function hienThiDonHang() {
  orderItems.innerHTML = "";

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    orderItems.innerHTML = `
            <div class="empty-order">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>Không có sản phẩm</h3>

                <p>Giỏ hàng của bạn đang trống.</p>

            </div>
        `;

    tinhTongTien();

    return;
  }

  // Hiển thị từng sản phẩm

  for (let item of cart) {
    let thanhTien = item.price * item.quantity;

    orderItems.innerHTML += `

            <div class="order-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="order-info">

                    <h3>${item.name}</h3>

                    <p>${item.category}</p>

                </div>

                <div class="order-quantity">

                    x${item.quantity}

                </div>

                <div class="order-price">

                    ${thanhTien.toLocaleString("vi-VN")}đ

                </div>

            </div>

        `;
  }

  tinhTongTien();
}

// TÍNH TIỀN

function tinhTongTien() {
  let tong = 0;

  for (let item of cart) {
    tong += item.price * item.quantity;
  }

  let phiDichVu = 0;

  let tongCong = tong + phiDichVu;

  subtotal.innerText = tong.toLocaleString("vi-VN") + "đ";

  serviceFee.innerText = phiDichVu.toLocaleString("vi-VN") + "đ";

  totalPrice.innerText = tongCong.toLocaleString("vi-VN") + "đ";
}

// CHỌN HÌNH THỨC NHẬN

let receiveMethods = document.querySelectorAll('input[name="receiveMethod"]');

let tableArea = document.getElementById("tableArea");

for (let method of receiveMethods) {
  method.addEventListener("change", function () {
    if (method.value === "table" && method.checked) {
      tableArea.classList.add("show");
    } else {
      tableArea.classList.remove("show");
    }
  });
}

// XÁC NHẬN ĐẶT HÀNG

function xacNhanDatHang() {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống!");

    return;
  }

  // Lấy hình thức nhận hàng

  let receiveMethod = document.querySelector(
    'input[name="receiveMethod"]:checked',
  ).value;

  // Lấy phương thức thanh toán

  let paymentMethod = document.querySelector(
    'input[name="payment"]:checked',
  ).value;

  // Nếu nhận tại bàn thì lấy số bàn

  let tableNumber = "";

  if (receiveMethod === "table") {
    tableNumber = document.getElementById("tableNumber").value;
  }

  // Tạo thông tin đơn hàng

  let order = {
    id: "DH" + Date.now(),

    username: username,

    items: cart,

    receiveMethod: receiveMethod,

    tableNumber: tableNumber,

    paymentMethod: paymentMethod,

    total: tinhTongDonHang(),

    status: "Chờ xác nhận",

    date: new Date().toLocaleString("vi-VN"),
  };

  // Lấy các đơn hàng cũ

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Thêm đơn mới

  orders.push(order);

  // Lưu lại

  localStorage.setItem("orders", JSON.stringify(orders));

  // Xóa giỏ hàng

  localStorage.removeItem("cart");

  if (window.updateCartCount) {
    window.updateCartCount();
  }

  alert("Đặt hàng thành công!");

  // Quay về trang chủ

  window.location.href = "../Dashboard/customer1.html";
}

// TÍNH TỔNG ĐƠN

function tinhTongDonHang() {
  let tong = 0;

  for (let item of cart) {
    tong += item.price * item.quantity;
  }

  return tong;
}

//  QUAY LẠI GIỎ HÀNG

function quayLaiGioHang() {
  window.location.href = "cart.html";
}

//  CHẠY KHI MỞ TRANG

hienThiDonHang();
