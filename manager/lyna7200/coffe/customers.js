const customerRows = document.getElementById("customerRows");
const customerSearch = document.getElementById("customerSearch");
const customerDialog = document.getElementById("customerDialog");
const customerForm = document.getElementById("customerForm");
const customerId = document.getElementById("customerId");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerAddress = document.getElementById("customerAddress");
const customerError = document.getElementById("customerFormError");

function loadCustomers() {
  return window.CoffeeData.readCustomers();
}

function saveCustomers(customers) {
  window.CoffeeData.writeArray("customers", customers);
}

function escapeCustomer(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}

function customerOrders(customer) {
  return window.CoffeeData.readArray("orders").filter((order) => {
    if (customer.id && order.customerId === customer.id) return true;
    if (customer.username && order.username === customer.username) return true;
    return Boolean(
      customer.phone &&
      order.customerPhone &&
      customer.phone === order.customerPhone,
    );
  });
}

function orderTotal(order) {
  return (
    Number(order.total) ||
    (order.items || []).reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    )
  );
}

function renderCustomers() {
  const customers = loadCustomers();
  const query = (customerSearch?.value || "").trim().toLocaleLowerCase("vi");
  const filtered = customers.filter((customer) =>
    [
      customer.id,
      customer.name,
      customer.fullName,
      customer.username,
      customer.phone,
      customer.email,
    ]
      .join(" ")
      .toLocaleLowerCase("vi")
      .includes(query),
  );

  document.getElementById("customerTotalCount").textContent = customers.length;
  document.getElementById("customerResultCount").textContent =
    `${filtered.length} khách hàng`;

  const withOrders = customers.filter(
    (customer) => customerOrders(customer).length,
  );
  document.getElementById("customerWithOrders").textContent = withOrders.length;
  document.getElementById("customerOrderCount").textContent = customers.reduce(
    (sum, customer) =>
      sum +
      customerOrders(customer).filter((order) => order.status !== "cancelled")
        .length,
    0,
  );
  const spend = customers.reduce(
    (sum, customer) =>
      sum +
      customerOrders(customer)
        .filter(
          (order) =>
            window.CoffeeData.normalizeStatus(order.status) === "completed",
        )
        .reduce((orderSum, order) => orderSum + orderTotal(order), 0),
    0,
  );
  document.getElementById("customerSpend").textContent = money(spend);

  customerRows.innerHTML = filtered
    .map((customer) => {
      const orders = customerOrders(customer);
      const completedSpend = orders
        .filter(
          (order) =>
            window.CoffeeData.normalizeStatus(order.status) === "completed",
        )
        .reduce((sum, order) => sum + orderTotal(order), 0);
      return `
        <tr>
          <td>${escapeCustomer(customer.id)}</td>
          <td><strong>${escapeCustomer(customer.name || customer.fullName || "")}</strong></td>
          <td>${escapeCustomer(customer.phone || "—")}</td>
          <td>${escapeCustomer(customer.email || "—")}</td>
          <td>${orders.filter((order) => order.status !== "cancelled").length}</td>
          <td>${money(completedSpend)}</td>
          <td>
            <button class="secondary-btn" data-edit-customer="${escapeCustomer(customer.id)}">Sửa</button>
            <button class="danger-btn" data-delete-customer="${escapeCustomer(customer.id)}" ${customer.username ? 'disabled title="Khách đã có tài khoản đăng ký"' : ""}>Xóa</button>
          </td>
        </tr>`;
    })
    .join("");
}

function openCustomerDialog(customer) {
  customerForm.reset();
  customerId.value = customer?.id || "";
  customerName.value = customer?.name || customer?.fullName || "";
  customerPhone.value = customer?.phone || "";
  customerEmail.value = customer?.email || "";
  customerAddress.value = customer?.address || "";
  customerError.textContent = "";
  document.getElementById("customerDialogTitle").textContent = customer
    ? "Cập nhật khách hàng"
    : "Thêm khách hàng";
  customerDialog.showModal();
}

document
  .getElementById("addCustomerBtn")
  .addEventListener("click", () => openCustomerDialog());
document
  .getElementById("cancelCustomer")
  .addEventListener("click", () => customerDialog.close());
customerSearch.addEventListener("input", renderCustomers);
document.getElementById("resetCustomerSearch").addEventListener("click", () => {
  customerSearch.value = "";
  renderCustomers();
});

customerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = customerId.value;
  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();
  const email = customerEmail.value.trim();
  const address = customerAddress.value.trim();
  if (!name || !phone) {
    customerError.textContent =
      "Vui lòng nhập tên và số điện thoại khách hàng.";
    return;
  }
  const customers = loadCustomers();
  if (
    customers.some(
      (customer) =>
        customer.id !== id &&
        phone.replace(/\s/g, "") ===
          String(customer.phone || "").replace(/\s/g, ""),
    )
  ) {
    customerError.textContent =
      "Số điện thoại này đã được lưu cho khách hàng khác.";
    return;
  }
  const existing = customers.find((customer) => customer.id === id);
  const updated = {
    ...existing,
    id: id || `KH-${Date.now()}`,
    name,
    fullName: name,
    phone,
    email,
    address,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const next = existing
    ? customers.map((customer) => (customer.id === id ? updated : customer))
    : [...customers, updated];
  saveCustomers(next);
  customerDialog.close();
  renderCustomers();
});

customerRows.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-customer]");
  const deleteButton = event.target.closest("[data-delete-customer]");
  const customers = loadCustomers();
  if (editButton) {
    const customer = customers.find(
      (item) => item.id === editButton.dataset.editCustomer,
    );
    if (customer) openCustomerDialog(customer);
  }
  if (deleteButton && confirm("Xóa thông tin khách hàng này?")) {
    saveCustomers(
      customers.filter(
        (item) => item.id !== deleteButton.dataset.deleteCustomer,
      ),
    );
    renderCustomers();
  }
});

document.getElementById("exportCustomers").addEventListener("click", () => {
  const rows = [
    ["Mã khách hàng", "Họ tên", "Số điện thoại", "Email", "Số đơn", "Chi tiêu"],
    ...loadCustomers().map((customer) => {
      const orders = customerOrders(customer);
      const spend = orders
        .filter(
          (order) =>
            window.CoffeeData.normalizeStatus(order.status) === "completed",
        )
        .reduce((sum, order) => sum + orderTotal(order), 0);
      return [
        customer.id,
        customer.name || customer.fullName,
        customer.phone,
        customer.email,
        orders.length,
        spend,
      ];
    }),
  ];
  downloadCSV("khach-hang-hoi-an-coffee.csv", rows);
});

window.addEventListener("storage", (event) => {
  if (
    ["customers", "orders", "registeredCustomers", "customerProfile"].includes(
      event.key,
    )
  ) {
    renderCustomers();
  }
});
window.addEventListener("coffee:datachange", renderCustomers);
renderCustomers();
