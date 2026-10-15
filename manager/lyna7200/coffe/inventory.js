document.addEventListener("DOMContentLoaded", () => {
  const inventoryList = document.getElementById("inventoryList");
  const emptyState = document.getElementById("emptyState");
  const totalCount = document.getElementById("totalCount");
  const lowStockCount = document.getElementById("lowStockCount");
  const resultCount = document.getElementById("resultCount");
  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetBtn");

  const dialog = document.getElementById("inventoryDialog");
  const form = document.getElementById("inventoryForm");
  const addBtn = document.getElementById("addBtn");
  const closeBtn = document.getElementById("closeBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const modalTitle = document.getElementById("modalTitle");

  let inventory = JSON.parse(localStorage.getItem("coffee_inventory")) || [
    { id: "NL01", name: "Hạt cà phê Arabica", quantity: 15, unit: "Kg" },
    { id: "NL02", name: "Sữa tươi thanh trùng", quantity: 3, unit: "Hộp" },
    { id: "NL03", name: "Sữa đặc", quantity: 20, unit: "Lon" },
  ];

  function saveData() {
    localStorage.setItem("coffee_inventory", JSON.stringify(inventory));
  }

  function render() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(query),
    );

    if (totalCount) totalCount.textContent = inventory.length;
    if (lowStockCount)
      lowStockCount.textContent = inventory.filter(
        (i) => i.quantity <= 5,
      ).length;
    if (resultCount) resultCount.textContent = `${filtered.length} nguyên liệu`;

    if (filtered.length === 0) {
      inventoryList.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    inventoryList.innerHTML = filtered
      .map((i) => {
        const isLow = i.quantity <= 5;
        const statusText = isLow ? "Sắp hết" : "Bình thường";
        const badgeClass = isLow ? "badge-warning" : "badge-normal";

        return `
                <tr>
                    <td><strong>${i.id}</strong></td>
                    <td>${i.name}</td>
                    <td><strong>${i.quantity}</strong></td>
                    <td>${i.unit}</td>
                    <td><span class="${badgeClass}">${statusText}</span></td>
                    <td>
                        <button onclick="editInventory('${i.id}')" class="btn-secondary" style="padding: 4px 8px; margin-right: 4px;">Sửa</button>
                        <button onclick="deleteInventory('${i.id}')" class="btn-secondary" style="padding: 4px 8px; color: #e74c3c; border-color: #e74c3c;">Xóa</button>
                    </td>
                </tr>
            `;
      })
      .join("");
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (form) form.reset();
      document.getElementById("inventoryId").value = "";
      if (modalTitle) modalTitle.textContent = "Thêm nguyên liệu";
      if (dialog) dialog.showModal();
    });
  }

  const closeModal = () => dialog && dialog.close();
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("inventoryId").value;
      const name = document.getElementById("itemName").value.trim();
      const quantity = Number(document.getElementById("quantity").value);
      const unit = document.getElementById("unit").value.trim();

      if (id) {
        const idx = inventory.findIndex((i) => i.id === id);
        if (idx !== -1) inventory[idx] = { id, name, quantity, unit };
      } else {
        const newId = "NL" + String(inventory.length + 1).padStart(2, "0");
        inventory.push({ id: newId, name, quantity, unit });
      }

      saveData();
      render();
      closeModal();
    });
  }

  window.editInventory = (id) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    document.getElementById("inventoryId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("unit").value = item.unit;

    if (modalTitle) modalTitle.textContent = "Cập nhật nguyên liệu";
    if (dialog) dialog.showModal();
  };

  window.deleteInventory = (id) => {
    if (confirm("Xóa nguyên liệu này khỏi kho?")) {
      inventory = inventory.filter((i) => i.id !== id);
      saveData();
      render();
    }
  };

  if (searchInput) searchInput.addEventListener("input", render);
  if (resetBtn)
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      render();
    });

  saveData();
  render();
});
