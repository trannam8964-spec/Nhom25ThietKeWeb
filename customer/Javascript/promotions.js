(function () {
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("vi")
      .trim();
  }

  function activePromotions() {
    if (!window.CoffeeData) return [];
    const today = new Date().toISOString().slice(0, 10);
    return window.CoffeeData.readPromotions().filter(
      (promotion) =>
        promotion.status === "active" &&
        (!promotion.expiryDate || promotion.expiryDate >= today),
    );
  }

  function discountLabel(promotion) {
    const value = Number(promotion.discountValue) || 0;
    return promotion.discountType === "fixed"
      ? `${value.toLocaleString("vi-VN")}đ`
      : `${value}%`;
  }

  function promotionDescription(promotion) {
    if (promotion.condition === "drink_quantity") {
      return `Mua từ ${promotion.minimumQuantity} đồ uống, giảm ${discountLabel(promotion)} trên tiền đồ uống.`;
    }
    if (promotion.condition === "coffee_food") {
      return `Có cà phê và món ăn trong đơn, giảm ${discountLabel(promotion)}.`;
    }
    return `Giảm ${discountLabel(promotion)} trên đơn hàng.`;
  }

  function renderPromotionCards() {
    const container = document.getElementById("customerPromotions");
    if (!container) return;
    const icons = {
      drink_quantity: "fa-mug-hot",
      coffee_food: "fa-cookie-bite",
      order: "fa-tags",
    };
    const promotions = activePromotions();
    container.innerHTML = promotions.length
      ? promotions
          .map(
            (promotion) => `
              <article class="promotion-card">
                <div class="promotion-heading">
                  <span class="promotion-icon"><i class="fa-solid ${icons[promotion.condition] || icons.order}" aria-hidden="true"></i></span>
                  <span class="promotion-label">${promotion.condition === "drink_quantity" ? "COMBO ĐỒ UỐNG" : promotion.condition === "coffee_food" ? "CÀ PHÊ & MÓN ĂN" : "ƯU ĐÃI"}</span>
                </div>
                <div class="promotion-content">
                  <h3>${escapeHTML(promotion.name)}</h3>
                  <p>${escapeHTML(promotionDescription(promotion))}</p>
                </div>
                <a class="promotion-button" href="/customer/menu/menu.html">Chọn món <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              </article>`,
          )
          .join("")
      : '<p class="empty-promotions">Hiện chưa có khuyến mãi đang áp dụng.</p>';
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

  window.tinhKhuyenMai = function (items) {
    let drinkQuantity = 0;
    let drinkSubtotal = 0;
    let coffeeQuantity = 0;
    let foodQuantity = 0;
    let orderSubtotal = 0;

    (Array.isArray(items) ? items : []).forEach((item) => {
      const quantity = Math.max(0, Number(item.quantity) || 0);
      const subtotal = Math.max(0, Number(item.price) || 0) * quantity;
      const category = normalizeText(item.category);
      orderSubtotal += subtotal;
      if (["ca phe", "tra", "tra sua", "nuoc ep"].includes(category)) {
        drinkQuantity += quantity;
        drinkSubtotal += subtotal;
      }
      if (category === "ca phe") coffeeQuantity += quantity;
      if (category === "do an") foodQuantity += quantity;
    });

    let bestOffer = { name: "Chưa áp dụng", discount: 0 };
    activePromotions().forEach((promotion) => {
      let eligible = true;
      let discountBase = orderSubtotal;
      if (promotion.condition === "drink_quantity") {
        eligible = drinkQuantity >= Number(promotion.minimumQuantity || 0);
        discountBase = drinkSubtotal;
      } else if (promotion.condition === "coffee_food") {
        eligible = coffeeQuantity > 0 && foodQuantity > 0;
      }
      if (!eligible) return;

      const value = Number(promotion.discountValue) || 0;
      const discount =
        promotion.discountType === "fixed"
          ? Math.min(discountBase, value)
          : Math.round((discountBase * value) / 100);
      if (discount > bestOffer.discount) {
        bestOffer = { name: promotion.name, discount };
      }
    });

    return bestOffer;
  };

  window.tinhUuDaiComboDoi = function (items) {
    return window.tinhKhuyenMai(items).discount;
  };

  renderPromotionCards();
  window.addEventListener("storage", (event) => {
    if (event.key === "coffee_promotions") renderPromotionCards();
  });
  window.addEventListener("coffee:datachange", (event) => {
    if (event.detail === "promotions") renderPromotionCards();
  });
})();
