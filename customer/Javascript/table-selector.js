(function () {
  const select = document.getElementById("tableNumber");
  if (!select || !window.CoffeeData) return;

  function renderTables() {
    const selectedId = select.value;
    const tables = window.CoffeeData.readArray("tables");
    select.replaceChildren(new Option("Chọn bàn", ""));
    tables.forEach((table) => {
      const option = new Option(`${table.name} — ${table.status}`, table.id);
      option.disabled = table.status !== "Trống";
      select.add(option);
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
