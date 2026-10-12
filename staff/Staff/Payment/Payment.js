function refreshStaffPage() {
  StaffData.updateStaffName();
  const body = document.getElementById("paymentTableBody");
  if (!body) return;
  const orders = StaffData.orders().filter((order) =>
    ["delivering", "completed"].includes(StaffData.orderStatus(order)),
  );

  body.innerHTML = orders.length
    ? orders
        .map(
          (order) => `
            <tr>
              <td><strong>${StaffData.escape(order.id)}</strong></td>
              <td>${StaffData.escape(StaffData.orderCustomer(order))}</td>
              <td>${StaffData.escape(StaffData.paymentMethod(order))}</td>
              <td><strong>${StaffData.money(order.total)}</strong></td>
              <td>${StaffData.badge(order.status)}</td>
              <td>${order.paid ? '<span class="muted">Đã xác nhận</span>' : `<button class="btn" data-payment-id="${StaffData.escape(order.id)}">Xác nhận thanh toán</button>`}</td>
            </tr>`,
        )
        .join("")
    : '<tr><td colspan="6" class="empty-state">Chưa có đơn phù hợp để thanh toán</td></tr>';
}

document.addEventListener("DOMContentLoaded", () => {
  StaffData.updateStaffName();
  document
    .getElementById("paymentTableBody")
    .addEventListener("click", (event) => {
      const button = event.target.closest("[data-payment-id]");
      if (!button) return;
      const orders = StaffData.orders();
      const order = orders.find(
        (item) => String(item.id) === button.dataset.paymentId,
      );
      if (!order || order.paid) return;
      order.paid = true;
      order.status = "completed";
      order.updatedAt = new Date().toISOString();
      StaffData.saveOrders(orders);
      refreshStaffPage();
    });
  refreshStaffPage();
});
