document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("promotionList");
  const emptyState = document.getElementById("emptyState");
  const dialog = document.getElementById("promotionDialog");
  const form = document.getElementById("promotionForm");
  const searchInput = document.getElementById("searchInput");
  let promotions = window.CoffeeData.readPromotions();

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
    );

  function isActive(promotion) {
    return (
      promotion.status === "active" &&
      (!promotion.expiryDate || promotion.expiryDate >= new Date().toISOString().slice(0, 10))
    );
  }

  function discountLabel(promotion) {
    const value = Number(promotion.discountValue) || 0;
    return promotion.discountType === "fixed"
      ? `${value.toLocaleString("vi-VN")}đ`
      : `${value}%`;
  }

  function conditionLabel(promotion) {
    if (promotion.condition === "drink_quantity") {
      return `Từ ${promotion.minimumQuantity} đồ uống`;
    }
    if (promotion.condition === "coffee_food") return "Cà phê kèm món ăn";
    return "Toàn đơn hàng";
  }

  function render() {
    const query = searchInput.value.trim().toLocaleLowerCase("vi");
    const filtered = promotions.filter((promotion) =>
      `${promotion.name} ${promotion.id}`.toLocaleLowerCase("vi").includes(query),
    );
    document.getElementById("totalCount").textContent = promotions.length;
    document.getElementById("activeCount").textContent = promotions.filter(isActive).length;
    document.getElementById("resultCount").textContent = `${filtered.length} chương trình`;
    emptyState.style.display = filtered.length ? "none" : "block";
    list.innerHTML = filtered
      .map((promotion) => {
        const active = isActive(promotion);
        return `
          <tr>
            <td><strong>${escapeHTML(promotion.id)}</strong></td>
            <td>${escapeHTML(promotion.name)}<br><small>${conditionLabel(promotion)}</small></td>
            <td><strong>${discountLabel(promotion)}</strong></td>
            <td>${escapeHTML(promotion.expiryDate || "Không giới hạn")}</td>
            <td><span class="${active ? "badge-active" : "badge-expired"}">${active ? "Đang áp dụng" : "Hết hạn"}</span></td>
            <td>
              <button class="btn-secondary" data-action="edit" data-id="${escapeHTML(promotion.id)}">Sửa</button>
              <button class="btn-secondary" data-action="delete" data-id="${escapeHTML(promotion.id)}">Xóa</button>
            </td>
          </tr>`;
      })
      .join("");
  }

  function openPromotion(promotion) {
    form.reset();
    document.getElementById("promotionId").value = promotion?.id || "";
    document.getElementById("promoName").value = promotion?.name || "";
    document.getElementById("promoCondition").value = promotion?.condition || "drink_quantity";
    document.getElementById("minimumQuantity").value = promotion?.minimumQuantity ?? 2;
    document.getElementById("discountType").value = promotion?.discountType || "percent";
    document.getElementById("discount").value =
      promotion?.discountValue ?? promotion?.discount ?? "";
    document.getElementById("expiryDate").value = promotion?.expiryDate || "2099-12-31";
    document.getElementById("promoStatus").value = promotion?.status || "active";
    document.getElementById("formError").textContent = "";
    document.getElementById("modalTitle").textContent = promotion
      ? "Sửa chương trình khuyến mãi"
      : "Thêm khuyến mãi";
    dialog.showModal();
  }

  function save() {
    const id = document.getElementById("promotionId").value;
    const condition = document.getElementById("promoCondition").value;
    const minimumQuantity = Number(document.getElementById("minimumQuantity").value) || 0;
    const discountType = document.getElementById("discountType").value;
    const discountValue = Number(document.getElementById("discount").value);
    const error = document.getElementById("formError");

    if (
      !document.getElementById("promoName").value.trim() ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0 ||
      (discountType === "percent" && discountValue > 100) ||
      (condition === "drink_quantity" && minimumQuantity < 1)
    ) {
      error.textContent = "Kiểm tra tên, mức giảm và điều kiện áp dụng.";
      return;
    }

    let nextId = id;
    if (!nextId) {
      let number = 1;
      while (promotions.some((promotion) => promotion.id === `KM${String(number).padStart(2, "0")}`)) number++;
      nextId = `KM${String(number).padStart(2, "0")}`;
    }
    const promotion = {
      id: nextId,
      name: document.getElementById("promoName").value.trim(),
      condition,
      minimumQuantity: condition === "drink_quantity" ? minimumQuantity : 0,
      discountType,
      discountValue,
      expiryDate: document.getElementById("expiryDate").value,
      status: document.getElementById("promoStatus").value,
    };
    const index = promotions.findIndex((item) => item.id === nextId);
    if (index >= 0) promotions[index] = promotion;
    else promotions.push(promotion);
    window.CoffeeData.writePromotions(promotions);
    promotions = window.CoffeeData.readPromotions();
    dialog.close();
    render();
  }

  document.getElementById("addBtn").addEventListener("click", () => openPromotion());
  document.getElementById("closeBtn").addEventListener("click", () => dialog.close());
  document.getElementById("cancelBtn").addEventListener("click", () => dialog.close());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    save();
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const promotion = promotions.find((item) => item.id === button.dataset.id);
    if (!promotion) return;
    if (button.dataset.action === "edit") openPromotion(promotion);
    if (button.dataset.action === "delete" && confirm(`Xóa khuyến mãi “${promotion.name}”?`)) {
      promotions = promotions.filter((item) => item.id !== promotion.id);
      window.CoffeeData.writePromotions(promotions);
      render();
    }
  });
  searchInput.addEventListener("input", render);
  document.getElementById("resetBtn").addEventListener("click", () => {
    searchInput.value = "";
    render();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "coffee_promotions") {
      promotions = window.CoffeeData.readPromotions();
      render();
    }
  });
  window.addEventListener("coffee:datachange", (event) => {
    if (event.detail === "promotions") {
      promotions = window.CoffeeData.readPromotions();
      render();
    }
  });

  render();
});
