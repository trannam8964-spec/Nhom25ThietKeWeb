function refreshStaffPage() {
  StaffData.updateStaffName();
  const orders = StaffData.orders();
  const tables = StaffData.tables();
  const count = (status) =>
    orders.filter((order) => StaffData.orderStatus(order) === status).length;

  document.getElementById("newOrderCount").textContent = count("pending");
  document.getElementById("preparingCount").textContent = count("preparing");
  document.getElementById("busyTableCount").textContent = tables.filter(
    (table) => ["Đang sử dụng", "Dang su dung"].includes(table.status),
  ).length;
  document.getElementById("completedCount").textContent = count("completed");
  document.getElementById("pendingCount").textContent = count("pending");
  document.getElementById("preparingSummary").textContent = count("preparing");
  document.getElementById("deliveringCount").textContent = count("delivering");
  document.getElementById("doneSummary").textContent = count("completed");
  document.getElementById("cancelledCount").textContent = count("cancelled");

  const revenue = orders
    .filter((order) => StaffData.orderStatus(order) === "completed")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  document.getElementById("totalRevenue").textContent =
    StaffData.money(revenue);

  const active = orders.filter((order) =>
    ["pending", "preparing", "delivering"].includes(
      StaffData.orderStatus(order),
    ),
  ).sort(
    (first, second) =>
      StaffData.orderTimestamp(second) - StaffData.orderTimestamp(first),
  );
  document.getElementById("dashboardOrders").innerHTML = active.length
    ? active
        .slice(0, 5)
        .map(
          (order) => `
            <tr>
              <td>${StaffData.escape(order.id)}</td>
              <td>${StaffData.escape(StaffData.orderCustomer(order))}</td>
              <td>${StaffData.orderItems(order).map(StaffData.escape).join(", ")}</td>
              <td>${StaffData.money(order.total)}</td>
              <td>${StaffData.badge(order.status)}</td>
            </tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty-state">Không có đơn cần xử lý</td></tr>';

  document.getElementById("dashboardTables").innerHTML = tables
    .map(
      (table) => `
        <div class="dashboard-table-tile ${table.status === "Đang sử dụng" ? "busy" : table.status === "Đặt trước" ? "reserved" : ""}">
          ${StaffData.escape(table.id)}
        </div>`,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", refreshStaffPage);
