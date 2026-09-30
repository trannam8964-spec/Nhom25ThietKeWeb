(function () {
  let cartLinks = document.querySelectorAll('a[href*="cart.html"]');
  let badges = [];

  for (let link of cartLinks) {
    let badge = link.querySelector(".cart-count");

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      link.appendChild(badge);
    }

    Object.assign(badge.style, {
      marginLeft: "auto",
      minWidth: "24px",
      height: "24px",
      padding: "0 6px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      borderRadius: "999px",
      backgroundColor: "#d99a58",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "700",
      lineHeight: "1",
    });

    badges.push(badge);
  }

  function updateCartCount() {
    let cart = [];

    try {
      let storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(storedCart)) {
        cart = storedCart;
      }
    } catch {
      cart = [];
    }

    let total = cart.reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);

    for (let badge of badges) {
      badge.textContent = total;
      badge.setAttribute("aria-label", total + " món trong giỏ hàng");
    }
  }

  window.updateCartCount = updateCartCount;

  window.addEventListener("storage", function (event) {
    if (event.key === "cart" || event.key === null) {
      updateCartCount();
    }
  });

  window.addEventListener("pageshow", updateCartCount);
  updateCartCount();
})();
