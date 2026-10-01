(function () {
  let drinkCategories = new Set(["Cà phê", "Trà", "Trà sữa", "Nước ép"]);

  window.tinhKhuyenMai = function (items) {
    let drinkQuantity = 0;
    let drinkSubtotal = 0;
    let coffeeQuantity = 0;
    let foodQuantity = 0;
    let orderSubtotal = 0;

    for (let item of Array.isArray(items) ? items : []) {
      let quantity = Math.max(0, Number(item.quantity) || 0);
      let price = Math.max(0, Number(item.price) || 0);
      let itemSubtotal = price * quantity;
      orderSubtotal += itemSubtotal;

      if (drinkCategories.has(item.category)) {
        drinkQuantity += quantity;
        drinkSubtotal += itemSubtotal;
      }

      if (item.category === "Cà phê") {
        coffeeQuantity += quantity;
      }

      if (item.category === "Đồ ăn") {
        foodQuantity += quantity;
      }
    }

    let bestOffer = { name: "Chưa áp dụng", discount: 0 };

    function considerOffer(name, discount) {
      if (discount > bestOffer.discount) {
        bestOffer = { name: name, discount: discount };
      }
    }

    if (drinkQuantity >= 2) {
      considerOffer("Combo đi đôi", Math.round(drinkSubtotal * 0.1));
    }

    if (drinkQuantity >= 3) {
      considerOffer("Combo nhóm 3 ly", Math.round(drinkSubtotal * 0.15));
    }

    if (coffeeQuantity >= 1 && foodQuantity >= 1) {
      considerOffer("Combo cà phê & món ăn", Math.min(10000, orderSubtotal));
    }

    return bestOffer;
  };

  window.tinhUuDaiComboDoi = function (items) {
    return window.tinhKhuyenMai(items).discount;
  };
})();
