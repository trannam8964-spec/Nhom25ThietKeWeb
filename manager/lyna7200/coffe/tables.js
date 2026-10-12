document.addEventListener("DOMContentLoaded", () => {
  const tableList = document.getElementById("tableList");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetBtn");

  document.getElementById("addBtn")?.remove();

  function readTables() {
    return window.CoffeeData.readArray("tables");
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
          char
        ],
    );
  }

  function render() {
    const tables = readTables();
    const query = searchInput.value.trim().toLocaleLowerCase("vi");
    const filtered = tables.filter((table) =>
      `${table.name} ${table.area}`.toLocaleLowerCase("vi").includes(query),
    );

    document.getElementById("totalCount").textContent = tables.length;
    document.getElementById("emptyCount").textContent = tables.filter(
      (table) => table.status === "Trống",
    ).length;
    document.getElementById("usingCount").textContent = tables.filter(
      (table) => table.status === "Đang sử dụng",
    ).length;
    document.getElementById("resultCount").textContent = `${filtered.length} bàn`;
    emptyState.style.display = filtered.length ? "none" : "block";

    tableList.innerHTML = filtered
      .map((table) => {
        const badgeClass =
          table.status === "Đang sử dụng"
            ? "badge-using"
            : table.status === "Đặt trước"
              ? "badge-reserved"
              : "badge-empty";
        return `
          <tr>
            <td><strong>${escapeHTML(table.id)}</strong></td>
            <td>${escapeHTML(table.name)}</td>
            <td>${escapeHTML(table.area)}</td>
            <td><span class="${badgeClass}">${escapeHTML(table.status)}</span></td>
            <td>
              <select aria-label="Trạng thái ${escapeHTML(table.name)}" data-table-id="${escapeHTML(table.id)}">
                <option value="Trống" ${table.status === "Trống" ? "selected" : ""}>Trống</option>
                <option value="Đang sử dụng" ${table.status === "Đang sử dụng" ? "selected" : ""}>Đang sử dụng</option>
                <option value="Đặt trước" ${table.status === "Đặt trước" ? "selected" : ""}>Đặt trước</option>
              </select>
            </td>
          </tr>`;
      })
      .join("");
  }

  tableList.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-table-id]");
    if (!select) return;
    const tables = readTables();
    const table = tables.find((item) => item.id === select.dataset.tableId);
    if (!table) return;
    table.status = select.value;
    window.CoffeeData.writeArray("tables", tables);
    render();
  });

  searchInput.addEventListener("input", render);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    render();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "tables") render();
  });
  window.addEventListener("coffee:datachange", (event) => {
    if (event.detail === "tables") render();
  });

  render();
});
