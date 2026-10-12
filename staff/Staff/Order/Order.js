function refreshStaffPage() {
  StaffData.updateStaffName();
  drawOrders();
}

function drawOrders() {
  const body = document.getElementById("ordersTableBody");
  if (!body) return;

  const search = document
    .getElementById("orderSearch")
    .value.trim()
    .toLocaleLowerCase("vi");
  const filter = document.getElementById("orderFilter").value;
  const orders = StaffData.orders().filter((order) => {
    const status = StaffData.orderStatus(order);
    const searchable = [order.id, StaffData.orderCustomer(order)]
      .join(" ")
      .toLocaleLowerCase("vi");
    return searchable.includes(search) && (!filter || status === filter);
  });

  body.innerHTML = orders.length
    ? orders
        .map((order) => {
          const status = StaffData.orderStatus(order);
          const transitions = {
            pending: ["preparing", "Bắt đầu chuẩn bị"],
            preparing: ["delivering", "Chuyển sang giao"],
            delivering: ["completed", "Hoàn thành đơn"],
          };
          const transition = transitions[status];
          const action = transition
            ? `<button class="btn" data-id="${StaffData.escape(order.id)}" data-status="${transition[0]}">${transition[1]}</button>`
            : "";
          const cancel = ["completed", "cancelled"].includes(status)
            ? ""
            : `<button class="btn btn-danger" data-id="${StaffData.escape(order.id)}" data-status="cancelled">Hủy</button>`;
          return `
            <tr>
              <td><strong>${StaffData.escape(order.id)}</strong></td>
              <td>${StaffData.escape(StaffData.orderCustomer(order))}<br><small>${StaffData.escape(order.customerPhone || "")}</small></td>
              <td>${StaffData.escape(StaffData.orderTime(order) || order.createdAt || "")}</td>
              <td>${StaffData.orderItems(order).map(StaffData.escape).join("<br>")}</td>
              <td><strong>${StaffData.money(order.total)}</strong></td>
              <td>${StaffData.badge(status)}</td>
              <td>${action} ${cancel}</td>
            </tr>`;
        })
        .join("")
    : '<tr><td colspan="7" class="empty-state">Chưa có đơn hàng phù hợp</td></tr>';
}

document.addEventListener("DOMContentLoaded", () => {
  StaffData.updateStaffName();
  document.getElementById("orderSearch").addEventListener("input", drawOrders);
  document.getElementById("orderFilter").addEventListener("change", drawOrders);
  document
    .getElementById("ordersTableBody")
    .addEventListener("click", (event) => {
      const button = event.target.closest("button[data-id][data-status]");
      if (!button) return;
      const orders = StaffData.orders();
      const order = orders.find(
        (item) => String(item.id) === button.dataset.id,
      );
      if (!order) return;
      order.status = button.dataset.status;
      order.updatedAt = new Date().toISOString();
      if (order.status === "completed") order.paid = true;
      if (order.status === "cancelled") order.paid = false;
      StaffData.saveOrders(orders);
      if (
        order.tableNumber &&
        ["completed", "cancelled"].includes(order.status)
      ) {
        const tables = window.CoffeeData.readArray("tables");
        const table = tables.find(
          (item) =>
            item.id === order.tableNumber || item.name === order.tableNumber,
        );
        if (table) {
          table.status = "Trống";
          window.CoffeeData.writeArray("tables", tables);
        }
      }
      refreshStaffPage();
    });
  refreshStaffPage();
});
