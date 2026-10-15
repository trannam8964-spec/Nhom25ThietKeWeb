function refreshStaffPage() {
  StaffData.updateStaffName();
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;

  grid.innerHTML = StaffData.tables()
    .map((table) => {
      const status = window.CoffeeData.normalizeTableStatus(table.status);
      const statuses = ["Trống", "Đặt trước", "Đang sử dụng"];
      return `
        <article class="table-card">
          <div class="table-card-top">
            <i class="fa-solid fa-chair"></i>
            ${StaffData.badge(status)}
          </div>
          <h3>${StaffData.escape(table.name)}</h3>
          <p>${StaffData.escape(table.area)} · ${StaffData.escape(status)}</p>
          <div class="table-status-actions" role="group" aria-label="Đổi trạng thái ${StaffData.escape(table.name)}">
            ${statuses
              .map(
                (choice) => `
                  <button type="button"
                    class="table-status-button ${status === choice ? "active" : ""}"
                    data-table-id="${StaffData.escape(table.id)}"
                    data-status="${choice}"
                    aria-pressed="${status === choice}">
                    ${choice}
                  </button>`,
              )
              .join("")}
          </div>
        </article>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  StaffData.updateStaffName();
  document.getElementById("tablesGrid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-table-id][data-status]");
    if (!button) return;
    const tables = StaffData.tables();
    const table = tables.find(
      (item) => String(item.id) === String(button.dataset.tableId),
    );
    if (!table) return;
    table.status = window.CoffeeData.normalizeTableStatus(button.dataset.status);
    StaffData.saveTables(tables);
    refreshStaffPage();
  });
  refreshStaffPage();
});
