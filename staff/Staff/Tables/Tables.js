function refreshStaffPage() {
  StaffData.updateStaffName();
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;

  grid.innerHTML = StaffData.tables()
    .map(
      (table) => `
        <article class="table-card">
          <div class="table-card-top">
            <i class="fa-solid fa-chair"></i>
            ${StaffData.badge(table.status)}
          </div>
          <h3>${StaffData.escape(table.name)}</h3>
          <p>${StaffData.escape(table.area)} · ${StaffData.escape(table.status)}</p>
          <label class="visually-hidden" for="table-${table.id}">Trạng thái ${StaffData.escape(table.name)}</label>
          <select class="table-select" id="table-${table.id}" data-table-id="${table.id}">
            <option value="Trống" ${table.status === "Trống" ? "selected" : ""}>Trống</option>
            <option value="Đang sử dụng" ${table.status === "Đang sử dụng" ? "selected" : ""}>Đang sử dụng</option>
            <option value="Đặt trước" ${table.status === "Đặt trước" ? "selected" : ""}>Đặt trước</option>
          </select>
        </article>`,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  StaffData.updateStaffName();
  document.getElementById("tablesGrid").addEventListener("change", (event) => {
    const select = event.target.closest("select[data-table-id]");
    if (!select) return;
    const tables = StaffData.tables();
    const table = tables.find((item) => item.id === select.dataset.tableId);
    if (!table) return;
    table.status = select.value;
    StaffData.saveTables(tables);
    refreshStaffPage();
  });
  refreshStaffPage();
});
