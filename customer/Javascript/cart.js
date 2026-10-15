// LẤY CÁC PHẦN TỬ HTML

let cartItems = document.getElementById("cartItems");
let subtotal = document.getElementById("subtotal");
let serviceFee = document.getElementById("serviceFee");
let promotionNameElement = document.getElementById("promotionName");
let promotionDiscountElement = document.getElementById("promotionDiscount");
let totalPrice = document.getElementById("totalPrice");

// LẤY TÊN KHÁCH HÀNG

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// LẤY GIỎ HÀNG

// Nếu chưa có cart thì tạo mảng rỗng
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// HIỂN THỊ GIỎ HÀNG

function hienThiGioHang() {
  // Xóa nội dung cũ
  cartItems.innerHTML = "";

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>Giỏ hàng đang trống</h2>

                <p>Hãy chọn một món trong Menu.</p>

            </div>
        `;

    tinhTongTien();

    return;
  }

  // Hiển thị từng sản phẩm
  for (let item of cart) {
    cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p>${item.category}</p>

                    <div class="cart-price">
                        ${item.price.toLocaleString("vi-VN")}đ
                    </div>

                </div>


                <div class="quantity">

                    <button onclick="giamSoLuong('${item.id}')">
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button onclick="tangSoLuong('${item.id}')">
                        +
                    </button>

                </div>


                <button
                    class="delete-btn"
                    onclick="xoaSanPham('${item.id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;
  }

  // Tính tiền
  tinhTongTien();
}

// TĂNG SỐ LƯỢNG

function tangSoLuong(id) {
  let item = cart.find(function (product) {
    return product.id === id;
  });

  if (item) {
    item.quantity++;
  }

  luuGioHang();

  hienThiGioHang();
}

// GIẢM SỐ LƯỢNG

function giamSoLuong(id) {
  let item = cart.find(function (product) {
    return product.id === id;
  });

  if (item) {
    item.quantity--;

    // Nếu số lượng còn 0
    // thì xóa sản phẩm khỏi giỏ
    if (item.quantity <= 0) {
      cart = cart.filter(function (product) {
        return product.id !== id;
      });
    }
  }

  luuGioHang();

  hienThiGioHang();
}

// XÓA SẢN PHẨM

function xoaSanPham(id) {
  cart = cart.filter(function (product) {
    return product.id !== id;
  });

  luuGioHang();

  hienThiGioHang();
}
// LƯU GIỎ HÀNG

function luuGioHang() {
  localStorage.setItem("cart", JSON.stringify(cart));

  if (window.updateCartCount) {
    window.updateCartCount();
  }
}

// TÍNH TỔNG TIỀN

function tinhTongTien() {
  let tong = 0;

  for (let item of cart) {
    tong += item.price * item.quantity;
  }

  // Phí dịch vụ hiện tại = 0
  let phiDichVu = 0;

  let promotion = window.tinhKhuyenMai
    ? window.tinhKhuyenMai(cart)
    : { name: "Chưa áp dụng", discount: 0 };
  let uuDai = promotion.discount;
  let tongCong = tong + phiDichVu - uuDai;

  subtotal.innerText = tong.toLocaleString("vi-VN") + "đ";

  serviceFee.innerText = phiDichVu.toLocaleString("vi-VN") + "đ";

  promotionNameElement.innerText = promotion.name;

  promotionDiscountElement.innerText =
    "-" + uuDai.toLocaleString("vi-VN") + "đ";

  totalPrice.innerText = tongCong.toLocaleString("vi-VN") + "đ";
}

// CHẠY KHI MỞ TRANG

hienThiGioHang();

function tienHanhDatHang() {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống!");

    return;
  }

  window.location.href = "order.html";
}
