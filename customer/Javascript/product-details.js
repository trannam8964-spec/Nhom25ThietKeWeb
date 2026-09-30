// ================= LẤY THÔNG TIN KHÁCH =================

let username = localStorage.getItem("username");

if (!username) {
  username = "Khách hàng";
}

document.getElementById("customerName").innerText = username;

// ================= LẤY ID MÓN TRÊN URL =================

// Ví dụ:
// product-detail.html?id=CF01

let params = new URLSearchParams(window.location.search);

let productId = params.get("id");

// ================= TÌM SẢN PHẨM =================

let product = products.find(function (item) {
  return item.id === productId;
});

// ================= KIỂM TRA =================

if (!product) {
  document.getElementById("productName").innerText = "Không tìm thấy sản phẩm";

  document.getElementById("productDescription").innerText =
    "Sản phẩm không tồn tại.";
} else {
  // Tên
  document.getElementById("productName").innerText = product.name;

  // Danh mục
  document.getElementById("productCategory").innerText = product.category;

  // Giá
  document.getElementById("productPrice").innerText =
    product.price.toLocaleString("vi-VN") + "đ";

  // Ảnh
  document.getElementById("productImage").src = product.image;

  document.getElementById("productImage").alt = product.name;

  // Mô tả và đánh giá
  document.getElementById("productDescription").innerText = product.description;
  document.getElementById("productRating").innerText =
    "★ " + product.rating.toFixed(1) + " / 5";
}

// ================= SỐ LƯỢNG =================

let quantity = 1;

let quantityElement = document.getElementById("quantity");

document.getElementById("increaseBtn").addEventListener("click", function () {
  quantity++;

  quantityElement.innerText = quantity;
});

document.getElementById("decreaseBtn").addEventListener("click", function () {
  if (quantity > 1) {
    quantity--;

    quantityElement.innerText = quantity;
  }
});

// ================= THÊM VÀO GIỎ =================

document.getElementById("addCartBtn").addEventListener("click", function () {
  if (!product) {
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let cartItem = cart.find(function (item) {
    return item.id === product.id;
  });

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,

      name: product.name,

      price: product.price,

      category: product.category,

      image: product.image,

      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  capNhatSoLuongGioHang();

  alert("Đã thêm " + quantity + " " + product.name + " vào giỏ hàng!");
});

// ================= HIỂN THỊ SỐ GIỎ HÀNG =================

function capNhatSoLuongGioHang() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let totalQuantity = 0;

  for (let item of cart) {
    totalQuantity += item.quantity;
  }

  document.getElementById("cartCount").innerText = totalQuantity;
}

capNhatSoLuongGioHang();

// ================= QUAY LẠI MENU =================

function quayLaiMenu() {
  window.location.href = "menu.html";
}
