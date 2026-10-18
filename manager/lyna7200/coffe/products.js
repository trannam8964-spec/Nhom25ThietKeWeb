const STORAGE_KEY = "hoianCoffeeProducts";
const productDescriptions = {
  P001: "Americano có hương cà phê rang rõ, vị đắng vừa và hậu vị gọn. Đây là lựa chọn nhẹ nhàng cho người thích cà phê nguyên vị mà không muốn uống quá đậm.",
  P002: "Bạc xỉu kết hợp vị cà phê thơm dịu với sữa béo ngọt, tạo cảm giác mềm mại và dễ uống. Món phù hợp với người thích vị sữa nổi bật hơn vị đắng của cà phê.",
  P003: "Cappuccino có lớp cà phê thơm đậm hòa cùng sữa nóng và bọt sữa mịn. Vị cà phê, vị béo và độ ngọt nhẹ cân bằng trong từng ngụm.",
  P004: "Cà phê cốt dừa kết hợp hương cà phê rang với vị dừa béo thơm, tạo nên thức uống sánh mượt và dễ thưởng thức. Vị ngọt dịu giúp món này hợp dùng vào những lúc muốn đổi vị.",
  P005: "Cà phê đen giữ trọn hương rang mộc mạc với vị đắng rõ và hậu vị kéo dài. Món dành cho người yêu thích một ly cà phê đơn giản, đậm vị.",
  P006: "Espresso có hương rang nồng, vị cà phê cô đọng và hậu vị đậm. Một lựa chọn nhỏ gọn cho người muốn thưởng thức nét nguyên bản của cà phê.",
  P007: "Cà phê kem trứng kết hợp nền cà phê đậm với lớp kem trứng béo mịn, thơm dịu. Khi dùng cùng nhau, vị đắng nhẹ của cà phê cân bằng độ ngậy của lớp kem.",
  P008: "Mocha hòa quyện hương cà phê với vị chocolate thơm, thêm nét béo dịu của sữa. Món có vị ngọt vừa phải và hậu vị cacao dễ chịu.",
  P009: "Cà phê muối có vị cà phê rang đậm, đi cùng lớp kem béo và chút mặn nhẹ. Khi khuấy đều, vị đắng, béo và ngọt hòa quyện, tạo nên hương vị khác lạ mà dễ uống.",
  P010: "Cà phê nâu kết hợp cà phê đậm đà với sữa đặc thơm béo. Vị ngọt dịu làm mềm vị đắng, để lại hậu vị quen thuộc và tròn vị.",
  P011: "Bánh bông lan trứng muối có cốt bánh mềm ẩm, vị mặn bùi của trứng muối và lớp sốt béo thơm. Sự cân bằng giữa mặn và ngọt khiến món bánh hợp dùng cùng cà phê hoặc trà.",
  P012: "Cơm cháy chà bông có phần cơm giòn rụm phủ chà bông đậm vị. Món ăn vặt kết hợp độ giòn, vị mặn thơm và chút béo của phần topping.",
  P013: "Croissant bơ tỏi có lớp vỏ vàng giòn, phần ruột mềm xốp và hương bơ tỏi thơm rõ. Món bánh mặn này thích hợp dùng cho bữa ăn nhẹ.",
  P014: "Flan caramel mềm mịn, thơm vị trứng sữa và có lớp caramel ngọt dịu hơi đắng. Kết cấu mềm nhẹ giúp món tráng miệng dễ ăn sau bữa chính.",
  P015: "Hạt hướng dương rang có độ giòn bùi và hương thơm nhẹ. Đây là món nhâm nhi đơn giản, phù hợp khi trò chuyện hoặc thưởng thức cùng đồ uống.",
  P016: "Khô bò có thớ dai mềm, vị mặn ngọt đậm đà và chút cay thơm. Món ăn vặt giàu hương vị, hợp dùng cùng các loại nước uống thanh mát.",
  P017: "Khô gà lá chanh có sợi gà dai mềm, vị đậm vừa và hương lá chanh thơm thoảng. Món nhâm nhi có chút cay nhẹ, hợp dùng trong những buổi gặp gỡ.",
  P018: "Nước ép cam có vị chua ngọt tươi sáng và hương cam thơm mọng. Thức uống mát lành, dễ kết hợp với món ăn nhẹ.",
  P019: "Nước ép dứa nổi bật với hương thơm đặc trưng, vị ngọt đậm xen chút chua dịu. Mỗi ngụm đem lại cảm giác tươi mát và sảng khoái.",
  P020: "Nước ép dưa hấu có vị ngọt thanh, mọng nước và dễ uống. Đây là lựa chọn giải khát nhẹ nhàng trong những ngày nóng.",
  P021: "Hồng trà việt quất kết hợp hương trà đậm với vị trái cây chua ngọt. Hậu vị tươi mới giúp thức uống vừa thơm trà vừa dễ giải khát.",
  P022: "Trà sen vàng có hương trà thanh dịu, điểm vị sen nhẹ nhàng và chút bùi thơm. Thức uống mang lại cảm giác thư thái, phù hợp với người thích vị trà êm.",
  P023: "Trà đào cam sả hòa vị đào ngọt dịu với cam thơm tươi và hương sả thoảng nhẹ. Nền trà thanh giúp tổng thể cân bằng, thơm mát.",
  P024: "Trà mãng cầu có vị trái cây chua ngọt đặc trưng trên nền trà thanh mát. Hương mãng cầu thơm mềm tạo nên thức uống đậm vị nhưng vẫn dễ uống.",
  P025: "Trà tắc xí muội kết hợp vị trà thanh với tắc chua thơm và xí muội mặn ngọt. Hương vị đậm đà, sảng khoái và kích thích vị giác.",
  P026: "Trà vải hoa lài có vị vải ngọt mọng hòa cùng hương hoa lài dịu nhẹ. Thức uống thơm thanh, để lại hậu vị ngọt nhẹ dễ chịu.",
  P027: "Trà xoài kết hợp nền trà thơm dịu với vị xoài chín ngọt đậm và chút chua thanh. Món uống có hương trái cây nổi bật, thích hợp dùng lạnh.",
  P028: "Trà sữa trân châu đường đen có vị trà sữa béo dịu, kết hợp trân châu dai mềm và hương đường đen caramel. Món uống có vị ngọt thơm và cảm giác đầy đặn.",
  P029: "Trà sữa chanh leo kết hợp vị trà sữa béo nhẹ với hương chanh leo chua thơm. Vị chua ngọt cân bằng giúp thức uống tươi mới và không quá ngấy.",
  P030: "Trà sữa matcha có hương trà xanh đặc trưng, vị hơi đắng thanh hòa cùng sữa béo dịu. Tổng thể thơm mượt và cân bằng giữa đắng, béo, ngọt.",
  P031: "Trà sữa socola hòa vị trà sữa béo mượt với hương chocolate đậm thơm. Vị ngọt dịu cùng hậu vị cacao tạo cảm giác đậm đà, dễ thưởng thức.",
  P032: "Trà sữa việt quất kết hợp vị trà sữa dịu béo với hương việt quất chua ngọt. Món có sắc thái trái cây rõ, cân bằng với vị trà thơm nhẹ.",
};
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
  description: productDescriptions[item[0]],
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
    if (Array.isArray(parsed) && parsed.length > 0) {
      let needsSave = false;
      const updated = parsed.map((product) => {
        const description = String(product.description || "").trim()
          ? product.description
          : productDescriptions[product.id] || "";
        if (description !== product.description) needsSave = true;
        return { ...product, description };
      });
      if (needsSave) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
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

  if (!name || !category || !description || !Number.isFinite(price) || price < 0) {
    getProductElement("formError").textContent =
      "Vui lòng nhập tên, danh mục, giá bán hợp lệ và mô tả sản phẩm.";
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
