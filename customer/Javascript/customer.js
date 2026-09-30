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

// Tổng số đơn hàng

let totalOrders = orders.length;

// Đếm số đơn đang chuẩn bị

let preparingOrders = orders.filter(function (order) {
  return order.status === "Đang chuẩn bị";
}).length;

// Đếm số đơn đã hoàn thành

let completedOrders = orders.filter(function (order) {
  return order.status === "Đã hoàn thành";
}).length;

// Hiển thị lên trang chủ

document.getElementById("totalOrders").innerText = totalOrders;

document.getElementById("preparingOrders").innerText = preparingOrders;

document.getElementById("completedOrders").innerText = completedOrders;
