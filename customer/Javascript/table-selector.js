(function () {
  const select = document.getElementById("tableNumber");
  const board = document.getElementById("customerTableStatusBoard");
  if (!select || !window.CoffeeData) return;

  function renderTables() {
    const selectedId = select.value;
    const tables = window.CoffeeData.readArray("tables");
    select.replaceChildren(new Option("Chọn bàn", ""));
    board?.replaceChildren();

    tables.forEach((table) => {
      const status = window.CoffeeData.normalizeTableStatus(table.status);
      const option = new Option(`${table.name} — ${status}`, table.id);
      option.disabled = status !== "Trống";
      select.add(option);

      if (board) {
        const tile = document.createElement("span");
        tile.className = "customer-table-tile";
        if (status === "Đang sử dụng") tile.classList.add("busy");
        if (status === "Đặt trước") tile.classList.add("reserved");
        tile.textContent = `${table.name}: ${status}`;
        board.append(tile);
      }
    });
    if (tables.some((table) => table.id === selectedId)) {
      select.value = selectedId;
    }
  }

  renderTables();
  window.addEventListener("storage", (event) => {
    if (event.key === "tables") renderTables();
  });
  window.addEventListener("coffee:datachange", (event) => {
    if (event.detail === "tables") renderTables();
  });
})();
