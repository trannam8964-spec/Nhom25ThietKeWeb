let orders = read(KEYS.orders),
  customers = read(KEYS.customers),
  products = read(KEYS.products);
const dialog = $("orderDialog"),
  form = $("orderForm");
const saleTypeLabel = (type) =>
  type === "takeaway" ? "Mang về" : "Bán tại chỗ";
function releaseTableForOrder(order) {
  if (!order?.tableNumber || !window.CoffeeData) return;
  const tables = window.CoffeeData.readArray("tables");
  const table = tables.find(
    (item) =>
      String(item.id) === String(order.tableNumber) ||
      item.name === order.tableNumber,
  );
  if (!table) return;
  table.status = "Trống";
  window.CoffeeData.writeArray("tables", tables);
}
function total(order) {
  return (
    Number(order.total) ||
    (order.items || []).reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    )
  );
}
function orderItemLabel(item) {
  if (typeof item === "string") return safe(item);
  const customization = item.customization || {};
  const options = [customization.sweetness, customization.ice]
    .filter(Boolean)
    .map(safe)
    .join(" · ");
  return `${safe(item.name || "Sản phẩm")}${options ? `<br><small>${options}</small>` : ""} × ${Number(item.quantity) || 1}`;
}
function orderTimestamp(order) {
  const timestamp = Date.parse(
    order.createdAt || order.orderDate || order.date || order.time || "",
  );
  return Number.isFinite(timestamp) ? timestamp : 0;
}
function fillOptions() {
  products = read(KEYS.products);
  const select = $("orderProduct"),
    previous = select.value;
  select.innerHTML =
    '<option value="">Chọn món</option>' +
    products
      .filter((p) => p.active !== false)
      .map(
        (p) =>
          `<option value="${safe(p.id)}">${safe(p.name)} — ${money(p.price)}</option>`,
      )
      .join("");
  if (previous) select.value = previous;
  updateFormTotal();
}
function render() {
  orders = read(KEYS.orders);
  customers = read(KEYS.customers);
  const query = $("orderSearch").value.trim().toLocaleLowerCase("vi"),
    status = $("orderStatusFilter").value;
  const list = orders
    .filter(
      (o) =>
        (!status || normalizeOrderStatus(o.status) === status) &&
        [
          o.id,
          o.customerName || "Khách lẻ",
          ...(o.items || []).map((i) => i.name),
        ]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(query),
    )
    .sort((a, b) => orderTimestamp(b) - orderTimestamp(a));
  $("orderTotalCount").textContent = orders.length;
  $("orderCompletedCount").textContent = orders.filter(
    (o) => normalizeOrderStatus(o.status) === "completed",
  ).length;
  $("orderRevenue").textContent = money(
    orders
      .filter((o) => normalizeOrderStatus(o.status) === "completed")
      .reduce((sum, o) => sum + total(o), 0),
  );
  $("orderOpenCount").textContent = orders.filter((o) =>
    ["pending", "preparing", "delivering"].includes(
      normalizeOrderStatus(o.status),
    ),
  ).length;
  $("orderResultCount").textContent = `${list.length} đơn hàng`;
  $("orderRows").innerHTML = list.length
    ? list
        .map(
          (o) =>
            `<tr><td><strong>${safe(o.id)}</strong></td><td>${safe(o.customerName || "Khách lẻ")}<br><small>${safe(o.customerPhone || "")}</small></td><td>${(o.items || []).map(orderItemLabel).join("<br>")}</td><td>${saleTypeLabel(o.orderType || o.saleType)}</td><td>${new Date(o.createdAt).toLocaleString("vi-VN")}</td><td><strong>${money(total(o))}</strong></td><td><select aria-label="Trạng thái ${safe(o.id)}" data-status-id="${safe(o.id)}" class="status-pill ${statusClass(o.status)}">${[
              ["pending", "Chờ nhân viên xác nhận"],
              ["preparing", "Đang chuẩn bị"],
              ["delivering", "Đang giao"],
              ["completed", "Hoàn thành"],
              ["cancelled", "Đã hủy"],
            ]
              .map(
                ([v, l]) =>
                  `<option value="${v}" ${normalizeOrderStatus(o.status) === v ? "selected" : ""}>${l}</option>`,
              )
              .join(
                "",
              )}</select></td><td><div class="inline-actions"><button class="secondary-btn" data-edit="${safe(o.id)}">Sửa</button><button class="danger-btn" data-delete="${safe(o.id)}">Xóa</button></div></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="8" class="empty-row">Chưa có đơn hàng. Nhấn “Tạo đơn hàng” để thêm đơn mới.</td></tr>';
}
function updateFormTotal() {
  const product = products.find((p) => p.id === $("orderProduct").value);
  const quantity = Math.max(1, Number($("orderQuantity").value) || 1);
  $("orderFormTotal").textContent = money(
    (Number(product?.price) || 0) * quantity,
  );
}
function openDialog(order) {
  form.reset();
  $("orderId").value = order?.id || "";
  $("orderDialogTitle").textContent = order
    ? "Chỉnh sửa đơn hàng"
    : "Tạo đơn hàng";
  fillOptions();
  if (order) {
    $("orderProduct").value = order.items?.[0]?.productId || "";
    $("orderQuantity").value = order.items?.[0]?.quantity || 1;
    $("orderType").value = order.orderType || order.saleType || "onsite";
    $("orderStatus").value = order.status || "pending";
    $("orderNote").value = order.note || "";
  } else {
    $("orderStatus").value = "pending";
    $("orderQuantity").value = 1;
    $("orderType").value = "onsite";
  }
  $("orderFormError").textContent = "";
  updateFormTotal();
  dialog.showModal();
}
$("addOrderBtn").addEventListener("click", () => openDialog());
$("cancelOrder").addEventListener("click", () => dialog.close());
$("orderProduct").addEventListener("change", updateFormTotal);
$("orderQuantity").addEventListener("input", updateFormTotal);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  products = read(KEYS.products);
  const id = $("orderId").value,
    product = products.find((p) => p.id === $("orderProduct").value),
    quantity = Number($("orderQuantity").value);
  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    $("orderFormError").textContent = "Hãy chọn món và nhập số lượng hợp lệ.";
    return;
  }
  const existing = orders.find((o) => o.id === id);
  const order = {
    ...existing,
    id: id || "DH" + Date.now().toString().slice(-8),
    customerId: existing?.customerId || "",
    customerName: existing?.customerName || "Khách lẻ",
    customerPhone: existing?.customerPhone || "",
    items: [
      {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price) || 0,
        quantity,
      },
    ],
    total: (Number(product.price) || 0) * quantity,
    orderType: $("orderType").value,
    status: $("orderStatus").value,
    note: $("orderNote").value.trim(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (id) orders = orders.map((o) => (o.id === id ? order : o));
  else orders.push(order);
  write(KEYS.orders, orders);
  if (
    existing &&
    ["completed", "cancelled"].includes(normalizeOrderStatus(order.status))
  ) {
    releaseTableForOrder(order);
  }
  dialog.close();
  render();
});
$("orderRows").addEventListener("click", (e) => {
  const edit = e.target.closest("[data-edit]"),
    remove = e.target.closest("[data-delete]");
  if (edit) {
    const order = orders.find((o) => o.id === edit.dataset.edit);
    if (order) openDialog(order);
  }
  if (remove && confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
    const order = orders.find((item) => item.id === remove.dataset.delete);
    releaseTableForOrder(order);
    orders = orders.filter((o) => o.id !== remove.dataset.delete);
    write(KEYS.orders, orders);
    render();
  }
});
$("orderRows").addEventListener("change", (e) => {
  const id = e.target.dataset.statusId;
  if (!id) return;
  const changedOrder = read(KEYS.orders).find((order) => order.id === id);
  if (!changedOrder) return;
  changedOrder.status = e.target.value;
  changedOrder.updatedAt = new Date().toISOString();
  orders = orders.map((order) => (order.id === id ? changedOrder : order));
  write(KEYS.orders, orders);
  if (["completed", "cancelled"].includes(normalizeOrderStatus(changedOrder.status))) {
    releaseTableForOrder(changedOrder);
  }
  render();
});
$("orderSearch").addEventListener("input", render);
$("orderStatusFilter").addEventListener("change", render);
$("resetOrderFilters").addEventListener("click", () => {
  $("orderSearch").value = "";
  $("orderStatusFilter").value = "";
  render();
});
$("exportOrders").addEventListener("click", () =>
  downloadCSV("don-hang-coffee-house.csv", [
    [
      "Mã đơn",
      "Khách hàng",
      "Điện thoại",
      "Sản phẩm",
      "Hình thức bán",
      "Ngày đặt",
      "Tổng tiền",
      "Trạng thái",
    ],
    ...orders.map((o) => [
      o.id,
      o.customerName || "Khách lẻ",
      o.customerPhone,
      (o.items || []).map((i) => `${i.name} x${i.quantity}`).join("; "),
      saleTypeLabel(o.orderType || o.saleType),
      new Date(o.createdAt).toLocaleString("vi-VN"),
      total(o),
      statusLabel(o.status),
    ]),
  ]),
);
window.addEventListener("storage", (e) => {
  if ([KEYS.orders, KEYS.customers, KEYS.products].includes(e.key)) {
    fillOptions();
    render();
  }
});
window.addEventListener("hoian:datachange", () => {
  fillOptions();
  render();
});
fillOptions();
render();
