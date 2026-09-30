let menuProducts = document.getElementById("menuProducts");

function hienThiSanPham(danhSach) {
  menuProducts.innerHTML = "";

  for (let product of danhSach) {
    menuProducts.innerHTML += `
            <div class="product-card"
                 onclick="xemChiTiet('${product.id}')">

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

                        <button class="add-cart"
                                onclick="event.stopPropagation(); themVaoGio('${product.id}')">

                            <i class="fa-solid fa-cart-plus"></i>

                        </button>

                    </div>

                </div>

            </div>
        `;
  }
}

// Hiện tất cả món khi mới mở trang
hienThiSanPham(products);

// Lấy tất cả nút danh mục
let categoryButtons = document.querySelectorAll(".category-btn");

// Khi bấm vào một danh mục
for (let button of categoryButtons) {
  button.addEventListener("click", function () {
    let category = button.dataset.category;

    if (category === "Tất cả") {
      hienThiSanPham(products);
    } else {
      let filteredProducts = products.filter(function (product) {
        return product.category === category;
      });

      hienThiSanPham(filteredProducts);
    }
  });
}

function themVaoGio(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Tìm sản phẩm trong data.js
  let product = products.find(function (item) {
    return item.id === id;
  });

  // Không tìm thấy sản phẩm
  if (!product) {
    return;
  }

  // Kiểm tra món đã có trong giỏ chưa
  let cartItem = cart.find(function (item) {
    return item.id === id;
  });

  if (cartItem) {
    // Đã có → tăng số lượng
    cartItem.quantity++;
  } else {
    // Chưa có → thêm món mới
    cart.push({
      id: product.id,

      name: product.name,

      price: product.price,

      category: product.category,

      image: product.image,

      quantity: 1,
    });
  }

  // Lưu lại giỏ hàng
  localStorage.setItem("cart", JSON.stringify(cart));

  if (window.updateCartCount) {
    window.updateCartCount();
  }

  alert("Đã thêm " + product.name + " vào giỏ hàng!");
}

function xemChiTiet(id) {
  window.location.href = "product-details.html?id=" + id;
}
