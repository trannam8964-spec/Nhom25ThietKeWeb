const STORAGE_KEY = "hoianCoffeeProducts";
const initialProducts = [
  ["P001", "Americano", "Cà phê", 30000, "1_americano.jpg"],
  ["P002", "Bạc Xỉu", "Cà phê", 32000, "2_bacxiu.jpg"],
  ["P003", "Capuchino", "Cà phê", 40000, "3_capuchinno.jpg"],
  ["P004", "Cà Phê Cốt Dừa", "Cà phê", 42000, "4_cotdua.jpg"],
  ["P005", "Cà Phê Đen", "Cà phê", 25000, "5_den.jpg"],
  ["P006", "Espresso", "Cà phê", 30000, "6_espresso.jpg"],
  ["P007", "Cà Phê Kem Trứng", "Cà phê", 45000, "7_kemtrung.jpg"],
  ["P008", "Cà Phê Mocha", "Cà phê", 45000, "8_mocha.jpg"],
  ["P009", "Cà Phê Muối", "Cà phê", 35000, "9_muoi.jpg"],
  ["P010", "Cà Phê Nâu", "Cà phê", 29000, "10_nau.jpg"],
  [
    "P011",
    "Bánh Bông Lan Trứng Muối",
    "Đồ ăn",
    35000,
    "11_bonglantrungmuoi.jpg",
  ],
  ["P012", "Cơm Cháy Chà Bông", "Đồ ăn", 25000, "12_comchaychabong.jpg"],
  ["P013", "Bánh Croissant Bơ Tỏi", "Đồ ăn", 30000, "13_croissantBoToi.jpg"],
  ["P014", "Bánh Flan Caramel", "Đồ ăn", 20000, "14_flanCaramel.jpg"],
  ["P015", "Hạt Hướng Dương", "Đồ ăn", 15000, "15_HuongDuong.jpg"],
  ["P016", "Khô Bò", "Đồ ăn", 40000, "16_khobo.jpg"],
  ["P017", "Khô Gà Lá Chanh", "Đồ ăn", 35000, "17_Khoga.jpg"],
  ["P018", "Nước Ép Cam", "Nước ép", 38000, "18_cam.jpg"],
  ["P019", "Nước Ép Dứa", "Nước ép", 38000, "19_dua.jpg"],
  ["P020", "Nước Ép Dưa Hấu", "Nước ép", 35000, "20_duahau.jpg"],
  ["P021", "Hồng Trà Việt Quất", "Trà", 38000, "21_hongtravietquat.jpg"],
  ["P022", "Trà Sen Vàng", "Trà", 45000, "22_senvang.jpg"],
  ["P023", "Trà Đào Cam Sả", "Trà", 40000, "23_tradaocamsa.jpg"],
  ["P024", "Trà Mãng Cầu", "Trà", 38000, "24_tramangcau.jpg"],
  ["P025", "Trà Tắc Xí Muội", "Trà", 32000, "25_tratacximuoi.jpg"],
  ["P026", "Trà Vải Hoa Lài", "Trà", 38000, "26_travaihoalai.jpg"],
  ["P027", "Trà Xoài", "Trà", 38000, "27_traxoai.jpg"],
  [
    "P028",
    "Trà Sữa Trân Châu Đường Đen",
    "Trà sữa",
    42000,
    "28_tranchauduongden.jpg",
  ],
  ["P029", "Trà Sữa Chanh Leo", "Trà sữa", 38000, "29_tsChanhLeo.jpg"],
  ["P030", "Trà Sữa Matcha", "Trà sữa", 40000, "30_tsmatcha.jpg"],
  ["P031", "Trà Sữa Socola", "Trà sữa", 40000, "31_tsSocola.jpg"],
  ["P032", "Trà Sữa Việt Quất", "Trà sữa", 42000, "32_tsvietquat.jpg"],
].map((item) => ({
  id: item[0],
  name: item[1],
  category: item[2],
  price: item[3],
  image: "/manager/lyna7200/coffe/product_images/" + item[4],
  description: "",
  active: true,
}));
let products = loadProducts();
const getProductElement = (id) => document.getElementById(id);
const productList = getProductElement("productList");
const productDialog = getProductElement("productDialog");
const productForm = getProductElement("productForm");
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    const seeded = structuredClone(initialProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch (error) {
    return structuredClone(initialProducts);
  }
}
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}
function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + " đ";
}
function nextProductId() {
  const maxId = products.reduce((max, product) => {
    const number = Number(String(product.id).replace(/\D/g, "")) || 0;
    return Math.max(max, number);
  }, 0);
  return "P" + String(maxId + 1).padStart(3, "0");
}
function renderProducts() {
  const keyword = getProductElement("searchInput").value.trim().toLocaleLowerCase("vi");
  const category = getProductElement("categoryFilter").value;
  const status = getProductElement("statusFilter").value;
  const filtered = products.filter((product) => {
    const matchesKeyword =
      product.name.toLocaleLowerCase("vi").includes(keyword) ||
      product.id.toLocaleLowerCase("vi").includes(keyword);
    const matchesCategory = !category || product.category === category;
    const matchesStatus =
      !status ||
      (status === "active" && product.active) ||
      (status === "inactive" && !product.active);
    return matchesKeyword && matchesCategory && matchesStatus;
  });
  productList.innerHTML = filtered
    .map(
      (product) => `
        <tr>
            <td><span class="product-code">${escapeHTML(product.id)}</span></td>
            <td>
                <div class="product-info">
                    <img
                        class="product-image"
                        src="${escapeHTML(product.image || "")}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='';this.style.visibility='hidden';"
                    >
                    <div>
                        <div class="product-name">${escapeHTML(product.name)}</div>
                        ${
                          product.description
                            ? `<div class="product-description">${escapeHTML(product.description)}</div>`
                            : ""
                        }
                    </div>
                </div>
            </td>

            <td>
                <span class="category-badge">${escapeHTML(product.category)}</span>
            </td>

            <td><span class="price">${formatPrice(product.price)}</span></td>

            <td>
                <span class="status ${product.active ? "active" : "inactive"}">
                    ${product.active ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                </span>
            </td>

            <td>
                <div class="actions">
                    <button class="action-btn" data-action="edit" data-id="${escapeHTML(product.id)}" title="Sửa">✎</button>
                    <button class="action-btn delete" data-action="delete" data-id="${escapeHTML(product.id)}" title="Xóa">⌫</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("");

  getProductElement("emptyState").hidden = filtered.length > 0;
  getProductElement("resultCount").textContent = `${filtered.length} sản phẩm`;

  updateStatistics();
}

function updateStatistics() {
  getProductElement("totalCount").textContent = products.length;
  getProductElement("activeCount").textContent = products.filter((p) => p.active).length;
  getProductElement("inactiveCount").textContent = products.filter((p) => !p.active).length;
  getProductElement("categoryCount").textContent = new Set(
    products.map((p) => p.category),
  ).size;
}

function openAddDialog() {
  productForm.reset();
  getProductElement("productId").value = "";
  getProductElement("dialogTitle").textContent = "Thêm sản phẩm";
  getProductElement("productActive").checked = true;
  getProductElement("formError").textContent = "";
  productDialog.showModal();
}

function openEditDialog(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  getProductElement("productId").value = product.id;
  getProductElement("productName").value = product.name;
  getProductElement("productCategory").value = product.category;
  getProductElement("productPrice").value = product.price;
  getProductElement("productImage").value = product.image || "";
  getProductElement("productDescription").value = product.description || "";
  getProductElement("productActive").checked = product.active;
  getProductElement("dialogTitle").textContent = "Chỉnh sửa sản phẩm";
  getProductElement("formError").textContent = "";

  productDialog.showModal();
}

function closeDialog() {
  productDialog.close();
  getProductElement("formError").textContent = "";
}

function saveProduct(event) {
  event.preventDefault();

  const id = getProductElement("productId").value;
  const name = getProductElement("productName").value.trim();
  const category = getProductElement("productCategory").value;
  const price = Number(getProductElement("productPrice").value);
  const image = getProductElement("productImage").value.trim();
  const description = getProductElement("productDescription").value.trim();
  const active = getProductElement("productActive").checked;

  if (!name || !category || !Number.isFinite(price) || price < 0) {
    getProductElement("formError").textContent = "Vui lòng nhập đầy đủ thông tin hợp lệ.";
    return;
  }

  const duplicate = products.some(
    (p) =>
      p.name.toLocaleLowerCase("vi") === name.toLocaleLowerCase("vi") &&
      p.id !== id,
  );

  if (duplicate) {
    getProductElement("formError").textContent = "Tên sản phẩm đã tồn tại.";
    return;
  }

  if (id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return;

    products[index] = {
      ...products[index],
      name,
      category,
      price,
      image,
      description,
      active,
    };
  } else {
    products.push({
      id: nextProductId(),
      name,
      category,
      price,
      description,
      active,
      image,
    });
  }

  saveProducts();
  renderProducts();
  closeDialog();
}

function deleteProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  if (!confirm(`Bạn có chắc muốn xóa "${product.name}" không?`)) return;

  products = products.filter((p) => p.id !== id);
  saveProducts();
  renderProducts();
}

function exportCSV() {
  const keyword = getProductElement("searchInput").value.trim().toLocaleLowerCase("vi");
  const category = getProductElement("categoryFilter").value;
  const status = getProductElement("statusFilter").value;

  const rows = products.filter((product) => {
    const matchesKeyword =
      product.name.toLocaleLowerCase("vi").includes(keyword) ||
      product.id.toLocaleLowerCase("vi").includes(keyword);

    const matchesCategory = !category || product.category === category;

    const matchesStatus =
      !status ||
      (status === "active" && product.active) ||
      (status === "inactive" && !product.active);

    return matchesKeyword && matchesCategory && matchesStatus;
  });

  const header = [
    "Mã sản phẩm",
    "Tên sản phẩm",
    "Danh mục",
    "Giá bán",
    "Trạng thái",
    "Mô tả",
  ];

  const csvCell = (value) =>
    '"' + String(value ?? "").replace(/"/g, '""') + '"';

  const csv =
    "\uFEFF" +
    [
      header,
      ...rows.map((p) => [
        p.id,
        p.name,
        p.category,
        p.price,
        p.active ? "Đang kinh doanh" : "Ngừng kinh doanh",
        p.description || "",
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "danh-sach-san-pham-hoi-an-coffee.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* SỰ KIỆN */
getProductElement("addBtn").addEventListener("click", openAddDialog);
getProductElement("closeBtn").addEventListener("click", closeDialog);
getProductElement("cancelBtn").addEventListener("click", closeDialog);
productForm.addEventListener("submit", saveProduct);

getProductElement("searchInput").addEventListener("input", renderProducts);
getProductElement("categoryFilter").addEventListener("change", renderProducts);
getProductElement("statusFilter").addEventListener("change", renderProducts);

getProductElement("resetBtn").addEventListener("click", () => {
  getProductElement("searchInput").value = "";
  getProductElement("categoryFilter").value = "";
  getProductElement("statusFilter").value = "";
  renderProducts();
});

getProductElement("exportBtn").addEventListener("click", exportCSV);

productList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "edit") {
    openEditDialog(id);
  } else if (button.dataset.action === "delete") {
    deleteProduct(id);
  }
});

productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) closeDialog();
});

/* KHỞI TẠO */
if (!localStorage.getItem(STORAGE_KEY)) saveProducts();
renderProducts();

// Một bộ xử lý menu duy nhất, dùng chung với trang chủ.
const menuToggle = document.getElementById("menuToggle");
function updateMenuButton() {
  if (!menuToggle) return;
  const mobile = window.innerWidth <= 760;
  const open = mobile
    ? document.body.classList.contains("mobile-open")
    : !document.body.classList.contains("sidebar-collapsed");
  menuToggle.setAttribute("aria-expanded", String(open));
}
menuToggle?.addEventListener("click", () => {
  if (window.innerWidth <= 760) document.body.classList.toggle("mobile-open");
  else document.body.classList.toggle("sidebar-collapsed");
  updateMenuButton();
});
window.addEventListener("resize", updateMenuButton);
document.addEventListener("click", (event) => {
  if (
    window.innerWidth <= 760 &&
    document.body.classList.contains("mobile-open") &&
    !event.target.closest(".sidebar") &&
    !event.target.closest("#menuToggle")
  ) {
    document.body.classList.remove("mobile-open");
    updateMenuButton();
  }
});
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    products = loadProducts();
    renderProducts();
  }
});
function announceDataChange() {
  window.dispatchEvent(new Event("hoian:datachange"));
}
const originalSaveProducts = saveProducts;
saveProducts = function () {
  originalSaveProducts();
  announceDataChange();
};
updateMenuButton();
