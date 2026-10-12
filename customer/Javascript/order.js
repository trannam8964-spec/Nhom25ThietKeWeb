// LẤY ELEMENT

let orderItems = document.getElementById("orderItems");

let subtotal = document.getElementById("subtotal");

let serviceFee = document.getElementById("serviceFee");

let promotionNameElement = document.getElementById("promotionName");

let promotionDiscountElement = document.getElementById("promotionDiscount");

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

  let promotion = getPromotionForOrder();

  let uuDai = promotion.discount;

  let tongCong = tong + phiDichVu - uuDai;

  subtotal.innerText = tong.toLocaleString("vi-VN") + "đ";

  serviceFee.innerText = phiDichVu.toLocaleString("vi-VN") + "đ";

  promotionNameElement.innerText = promotion.name;

  promotionDiscountElement.innerText =
    "-" + uuDai.toLocaleString("vi-VN") + "đ";

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
    const table = window.CoffeeData.readArray("tables").find(
      (item) => item.id === tableNumber,
    );
    if (!tableNumber || !table || table.status !== "Trống") {
      alert("Bàn vừa được chọn không còn trống. Vui lòng chọn bàn khác.");
      return;
    }
  }

  // Tạo thông tin đơn hàng

  let customerProfile = {};
  let authSession = {};
  try {
    customerProfile = JSON.parse(
      localStorage.getItem("customerProfile") || "{}",
    );
    authSession = JSON.parse(localStorage.getItem("authSession") || "{}");
  } catch {
    customerProfile = {};
    authSession = {};
  }
  const customer = window.CoffeeData?.upsertCustomer(
    {
      fullName: customerProfile.fullName || username,
      email: customerProfile.email || "",
      phone: customerProfile.phone || "",
      address: customerProfile.address || "",
    },
    authSession.username || username,
  );
  const createdAt = new Date().toISOString();
  let order = {
    id: "DH" + Date.now(),
    customerId: customer?.id || "",
    username: authSession.username || username,
    customerName: customerProfile.fullName || username,
    customerEmail: customerProfile.email || "",
    customerPhone: customerProfile.phone || "",
    items: cart.map((item) => ({
      ...item,
      productId: item.productId || item.id,
    })),
    receiveMethod,
    tableNumber,
    paymentMethod,
    orderType: receiveMethod === "table" ? "onsite" : "takeaway",
    subtotal: tinhTongTruocUuDai(),
    promotionName: getPromotionForOrder().name,
    promotionDiscount: getPromotionForOrder().discount,
    total: tinhTongDonHang(),
    status: "pending",
    createdAt,
    date: createdAt,
  };

  // Lấy các đơn hàng cũ

  let orders = window.CoffeeData.readArray("orders");

  // Thêm đơn mới

  orders.push(order);

  // Lưu lại

  window.CoffeeData.writeArray("orders", orders);

  if (receiveMethod === "table" && tableNumber) {
    const tables = window.CoffeeData.readArray("tables");
    const table = tables.find((item) => item.id === tableNumber);
    if (table) {
      table.status = "Đang sử dụng";
      window.CoffeeData.writeArray("tables", tables);
    }
  }

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
  return tinhTongTruocUuDai() - getPromotionForOrder().discount;
}

function tinhTongTruocUuDai() {
  let tong = 0;

  for (let item of cart) {
    tong += item.price * item.quantity;
  }

  return tong;
}

function getPromotionForOrder() {
  return window.tinhKhuyenMai
    ? window.tinhKhuyenMai(cart)
    : { name: "Chưa áp dụng", discount: 0 };
}

//  QUAY LẠI GIỎ HÀNG

function quayLaiGioHang() {
  window.location.href = "cart.html";
}

//  CHẠY KHI MỞ TRANG

hienThiDonHang();
