
const STORAGE_KEY = "hoiAnCoffeeCustomers";
const customerList = document.getElementById("customerList");
const totalCount = document.getElementById("totalCount");
const newCount = document.getElementById("newCount");
const resultCount = document.getElementById("resultCount");

const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");

const customerDialog = document.getElementById("customerDialog");
const customerForm = document.getElementById("customerForm");
const modalTitle = document.getElementById("modalTitle");

const customerId = document.getElementById("customerId");
const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

const formError = document.getElementById("formError");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Đọc dữ liệu khách hàng
function loadCustomers() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

// Lưu dữ liệu khách hàng
function saveCustomers(customers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

// Chuyển ký tự đặc biệt thành HTML an toàn
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

// Tạo mã khách hàng
function generateCustomerId() {
    const customers = loadCustomers();

    let number = customers.length + 1;
    let id = "";

    do {
        id = "KH" + String(number).padStart(3, "0");
        number++;
    } while (customers.some(customer => customer.id === id));

    return id;
}

// Định dạng ngày
function formatDate(dateString) {
    if (!dateString) return "--";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("vi-VN");
}

// Kiểm tra khách hàng mới trong 7 ngày
function isNewCustomer(customer) {
    if (!customer.createdAt) return false;

    const createdDate = new Date(customer.createdAt);
    const now = new Date();

    const difference = now.getTime() - createdDate.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return difference >= 0 && difference <= sevenDays;
}

// Hiển thị danh sách khách hàng
function renderCustomers() {
    const customers = loadCustomers();

    const keyword = (searchInput?.value || "")
        .trim()
        .toLowerCase();

    const filteredCustomers = customers.filter(customer => {
        const searchableText = [
            customer.id,
            customer.name,
            customer.phone,
            customer.address
        ].join(" ").toLowerCase();

        return searchableText.includes(keyword);
    });

    // Cập nhật số liệu thống kê
    if (totalCount) {
        totalCount.textContent = customers.length;
    }

    if (newCount) {
        newCount.textContent = customers.filter(isNewCustomer).length;
    }

    if (resultCount) {
        resultCount.textContent = filteredCustomers.length;
    }

    // Hiển thị thông báo khi không có dữ liệu
    const emptyState = document.getElementById("emptyState");

    if (customerList) {
        customerList.innerHTML = filteredCustomers.map((customer, index) => `
            <tr>
                <td>${escapeHTML(customer.id)}</td>
                <td>
                    <strong>${escapeHTML(customer.name)}</strong>
                </td>
                <td>${escapeHTML(customer.phone)}</td>
                <td>${escapeHTML(customer.address || "--")}</td>
                <td>${formatDate(customer.createdAt)}</td>
                <td>
                    <button
                        type="button"
                        class="btn-secondary"
                        data-action="edit"
                        data-id="${escapeHTML(customer.id)}">
                        Sửa
                    </button>

                    <button
                        type="button"
                        class="btn-danger"
                        data-action="delete"
                        data-id="${escapeHTML(customer.id)}">
                        Xóa
                    </button>
                </td>
            </tr>
        `).join("");
    }

    if (emptyState) {
        emptyState.style.display =
            filteredCustomers.length === 0 ? "block" : "none";

        emptyState.textContent = keyword
            ? "Không tìm thấy khách hàng phù hợp."
            : "Chưa có khách hàng nào.";
    }
}

// Mở form thêm khách hàng
function openAddDialog() {
    if (!customerDialog || !customerForm) return;

    customerForm.reset();

    if (customerId) {
        customerId.value = "";
    }

    if (modalTitle) {
        modalTitle.textContent = "Thêm khách hàng";
    }

    if (formError) {
        formError.textContent = "";
    }

    if (customerDialog.showModal) {
        customerDialog.showModal();
    } else {
        customerDialog.setAttribute("open", "");
    }
}

// Mở form sửa khách hàng
function openEditDialog(id) {
    const customers = loadCustomers();
    const customer = customers.find(item => item.id === id);

    if (!customer || !customerDialog || !customerForm) return;

    customerForm.reset();

    if (customerId) customerId.value = customer.id;
    if (customerName) customerName.value = customer.name;
    if (phone) phone.value = customer.phone;
    if (address) address.value = customer.address || "";

    if (modalTitle) {
        modalTitle.textContent = "Cập nhật khách hàng";
    }

    if (formError) {
        formError.textContent = "";
    }

    if (customerDialog.showModal) {
        customerDialog.showModal();
    } else {
        customerDialog.setAttribute("open", "");
    }
}

// Đóng form
function closeDialog() {
    if (!customerDialog) return;

    if (customerDialog.close) {
        customerDialog.close();
    } else {
        customerDialog.removeAttribute("open");
    }

    if (customerForm) customerForm.reset();
    if (formError) formError.textContent = "";
}

// Kiểm tra số điện thoại
function isValidPhone(value) {
    return /^(0|\+84)[0-9]{9}$/.test(value.replace(/\s/g, ""));
}

// Thêm hoặc cập nhật khách hàng
if (customerForm) {
    customerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = customerId?.value.trim() || "";
        const name = customerName?.value.trim() || "";
        const phoneValue = phone?.value.trim() || "";
        const addressValue = address?.value.trim() || "";

        if (formError) formError.textContent = "";

        if (!name || !phoneValue) {
            if (formError) {
                formError.textContent =
                    "Vui lòng nhập đầy đủ tên và số điện thoại.";
            }
            return;
        }

        if (!isValidPhone(phoneValue)) {
            if (formError) {
                formError.textContent =
                    "Số điện thoại không hợp lệ. Hãy nhập số điện thoại Việt Nam.";
            }
            return;
        }

        const customers = loadCustomers();

        // Không cho phép trùng số điện thoại
        const duplicatedPhone = customers.some(customer =>
            customer.phone.replace(/\s/g, "") === phoneValue.replace(/\s/g, "")
            && customer.id !== id
        );

        if (duplicatedPhone) {
            if (formError) {
                formError.textContent =
                    "Số điện thoại này đã tồn tại.";
            }
            return;
        }

        if (id) {
            // Cập nhật khách hàng cũ
            const index = customers.findIndex(customer => customer.id === id);

            if (index === -1) return;

            customers[index] = {
                ...customers[index],
                name: name,
                phone: phoneValue,
                address: addressValue
            };
        } else {
            // Thêm khách hàng mới
            customers.push({
                id: generateCustomerId(),
                name: name,
                phone: phoneValue,
                address: addressValue,
                createdAt: new Date().toISOString()
            });
        }

        saveCustomers(customers);
        closeDialog();
        renderCustomers();
    });
}

// Nút thêm khách hàng
if (addBtn) {
    addBtn.addEventListener("click", openAddDialog);
}

// Nút đóng và hủy
if (closeBtn) {
    closeBtn.addEventListener("click", closeDialog);
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", closeDialog);
}

// Tìm kiếm khách hàng
if (searchInput) {
    searchInput.addEventListener("input", renderCustomers);
}

// Đặt lại tìm kiếm
if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        renderCustomers();
    });
}

// Xử lý nút Sửa và Xóa trong bảng
if (customerList) {
    customerList.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "edit") {
            openEditDialog(id);
        }

        if (action === "delete") {
            const customers = loadCustomers();
            const customer = customers.find(item => item.id === id);

            if (!customer) return;

            const confirmed = confirm(
                `Bạn có chắc muốn xóa khách hàng "${customer.name}" không?`
            );

            if (!confirmed) return;

            const updatedCustomers = customers.filter(
                item => item.id !== id
            );

            saveCustomers(updatedCustomers);
            renderCustomers();
        }
    });
}
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        console.log("Menu collapsed:", sidebar.classList.contains("collapsed"));
    });
}
renderCustomers();
