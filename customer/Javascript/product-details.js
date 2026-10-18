const productParams = new URLSearchParams(window.location.search);
const productId = productParams.get("id");
const product = products.find((item) => String(item.id) === String(productId));
const detailElements = {
  name: document.getElementById("productName"),
  category: document.getElementById("productCategory"),
  image: document.getElementById("productImage"),
  description: document.getElementById("productDescription"),
  price: document.getElementById("productPrice"),
  rating: document.getElementById("productRating"),
  stars: document.getElementById("productStars"),
  sold: document.getElementById("productSold"),
  reviewCount: document.getElementById("reviewCount"),
  breadcrumb: document.getElementById("breadcrumbProduct"),
  flavorTags: document.getElementById("flavorTags"),
  ingredientDescription: document.getElementById("ingredientDescription"),
  ingredientTags: document.getElementById("ingredientTags"),
  pairing: document.getElementById("pairingSuggestion"),
  related: document.getElementById("relatedProducts"),
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatMoney(value) {
  return `${(Number(value) || 0).toLocaleString("vi-VN")}đ`;
}

function starsText(value) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLocaleLowerCase("vi");
}

function getFlavorTags(item) {
  const text = normalizeText(`${item.name} ${item.description}`);
  const candidates = [
    [/dam|dang|espresso|rang nong/, "Đậm vị"],
    [/beo|kem|sua|cot dua/, "Béo thơm"],
    [/ngot|caramel|mat ong/, "Ngọt dịu"],
    [/chua|thanh|mat|trai cay|nuoc ep/, "Thanh mát"],
    [/thom|huong hoa|tra /, "Thơm nhẹ"],
    [/gion|xop|dai|mem min/, "Thưởng thức mềm thơm"],
  ];
  const tags = candidates
    .filter(([pattern]) => pattern.test(text))
    .map(([, label]) => label);

  if (!tags.length) tags.push(item.category || "Món được yêu thích");
  return [...new Set(tags)].slice(0, 3);
}

const ingredientKeywords = [
  ["Cà phê", /cà phê|espresso/i],
  ["Sữa đặc", /sữa đặc/i],
  ["Sữa", /sữa/i],
  ["Kem muối", /kem muối/i],
  ["Chocolate", /chocolate|socola/i],
  ["Cốt dừa", /cốt dừa/i],
  ["Trứng", /trứng/i],
  ["Bơ", /bơ/i],
  ["Trà", /trà/i],
  ["Xoài", /xoài/i],
  ["Vải", /vải/i],
  ["Tắc", /tắc/i],
  ["Đào", /đào/i],
  ["Cam", /cam/i],
  ["Sả", /sả/i],
  ["Sen", /sen/i],
  ["Việt quất", /việt quất/i],
  ["Matcha", /matcha/i],
  ["Trân châu", /trân châu/i],
  ["Caramel", /caramel/i],
  ["Gà", /gà/i],
  ["Bò khô", /bò khô/i],
  ["Hạt hướng dương", /hướng dương/i],
];

function getMentionedIngredients(item) {
  const text = `${item.name || ""} ${item.description || ""}`;
  return ingredientKeywords
    .filter(([, pattern]) => pattern.test(text))
    .map(([label]) => label)
    .filter((label) => label !== "Sữa" || !/sữa đặc/i.test(text))
    .filter((label, index, labels) => labels.indexOf(label) === index)
    .slice(0, 6);
}

function isFood(item) {
  return normalizeText(item.category).includes("do an");
}

function renderProduct() {
  if (!product) {
    detailElements.name.textContent = "Không tìm thấy món";
    detailElements.description.textContent =
      "Món này không còn trong thực đơn. Hãy quay lại menu để chọn món khác.";
    document.getElementById("addCartBtn").disabled = true;
    document.getElementById("drinkCustomization").hidden = true;
    detailElements.related.innerHTML = `
      <div class="not-found">
        <p>Thực đơn có thể đã được cập nhật.</p>
        <a href="/customer/menu/menu.html">Quay lại thực đơn</a>
      </div>`;
    return;
  }

  const description = String(product.description || "").trim();
  const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
  detailElements.name.textContent = product.name || "Món Coffee House";
  detailElements.category.textContent = product.category || "Thực đơn";
  detailElements.breadcrumb.textContent = product.name || "Chi tiết món";
  detailElements.description.textContent =
    description || "Quán chưa bổ sung mô tả cho món này.";
  detailElements.price.textContent = formatMoney(product.price);
  detailElements.rating.textContent = rating.toFixed(1).replace(".", ",");
  detailElements.stars.textContent = starsText(rating);
  detailElements.stars.setAttribute("aria-label", `${rating.toFixed(1)} trên 5 sao`);
  detailElements.sold.textContent = (Number(product.sold) || 0).toLocaleString("vi-VN");
  detailElements.image.src = product.image || "";
  detailElements.image.alt = product.name || "Ảnh món Coffee House";

  detailElements.flavorTags.innerHTML = getFlavorTags(product)
    .map((tag) => `<span class="flavor-tag"><i class="fa-solid fa-sparkles" aria-hidden="true"></i>${escapeHTML(tag)}</span>`)
    .join("");

  detailElements.ingredientDescription.textContent = description
    ? `Điểm nổi bật được giới thiệu trong thực đơn: ${description}`
    : "Quán chưa cung cấp thông tin về thành phần và hương vị của món này.";
  detailElements.ingredientTags.innerHTML = getMentionedIngredients(product)
    .map((ingredient) => `<span class="ingredient-tag">${escapeHTML(ingredient)}</span>`)
    .join("");

  const customization = document.getElementById("drinkCustomization");
  customization.hidden = isFood(product);
  detailElements.pairing.textContent = getPairingSuggestion(product);
  renderRelatedProducts();
  renderReviews();
}

function getPairingSuggestion(item) {
  const food = isFood(item);
  const candidates = products
    .filter((candidate) => candidate.id !== item.id)
    .filter((candidate) => isFood(candidate) !== food)
    .sort((first, second) => (Number(second.sold) || 0) - (Number(first.sold) || 0));

  if (!candidates.length) {
    return "Bạn có thể chọn thêm một món khác trong thực đơn để dùng cùng.";
  }
  const suggestion = candidates[0];
  return food
    ? `Có thể dùng kèm ${suggestion.name} để hoàn chỉnh bữa ăn nhẹ.`
    : `Có thể gọi thêm ${suggestion.name} nếu bạn muốn dùng kèm một món ăn nhẹ.`;
}

function renderRelatedProducts() {
  const sameCategory = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .sort((first, second) => (Number(second.sold) || 0) - (Number(first.sold) || 0));
  const recommendations = sameCategory.length
    ? sameCategory.slice(0, 3)
    : products.filter((item) => item.id !== product.id).slice(0, 3);

  detailElements.related.innerHTML = recommendations.length
    ? recommendations
        .map(
          (item) => `
            <article class="related-card">
              <button type="button" data-product-id="${escapeHTML(item.id)}" aria-label="Xem ${escapeHTML(item.name)}">
                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
                <span class="related-card-info">
                  <span>${escapeHTML(item.category || "Coffee House")}</span>
                  <h3>${escapeHTML(item.name)}</h3>
                  <span class="related-card-bottom">
                    <span>${formatMoney(item.price)}</span>
                    <span class="rating-stars" aria-label="${Number(item.rating) || 0} sao">${starsText(item.rating)}</span>
                  </span>
                </span>
              </button>
            </article>`
        )
        .join("")
    : '<div class="not-found">Chưa có món liên quan trong thực đơn.</div>';
}

function reviewStorage() {
  return readArray("coffeeProductReviews");
}

function renderReviews() {
  const reviews = reviewStorage()
    .filter((review) => String(review.productId) === String(product.id))
    .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  const list = document.getElementById("reviewList");
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;
  const shownRating = reviews.length ? average : Number(product.rating) || 0;

  detailElements.reviewCount.textContent = reviews.length.toLocaleString("vi-VN");
  detailElements.rating.textContent = shownRating.toFixed(1).replace(".", ",");
  detailElements.stars.textContent = starsText(shownRating);
  detailElements.stars.setAttribute(
    "aria-label",
    `${shownRating.toFixed(1)} trên 5 sao`,
  );
  document.getElementById("reviewAverage").textContent = reviews.length
    ? average.toFixed(1).replace(".", ",")
    : "—";
  document.getElementById("reviewAverageStars").textContent = starsText(average);
  document.getElementById("reviewAverageCount").textContent = reviews.length
    ? `${reviews.length} nhận xét`
    : "Chưa có nhận xét";

  if (!reviews.length) {
    list.innerHTML = `
      <div class="review-empty">
        <i class="fa-regular fa-comment-dots" aria-hidden="true"></i>
        <p>Món này chưa có nhận xét.</p>
        <p>Chia sẻ cảm nhận của bạn để khách khác dễ chọn món hơn.</p>
      </div>`;
    return;
  }

  list.innerHTML = reviews
    .slice(0, 6)
    .map((review) => {
      const date = new Date(review.createdAt);
      const dateLabel = Number.isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
      return `
        <article class="review-item">
          <div class="review-item-head">
            <span class="review-author">
              <strong>${escapeHTML(review.displayName || "Khách hàng")}</strong>
              <time>${escapeHTML(dateLabel)}</time>
            </span>
            <span class="rating-stars" aria-label="${Number(review.rating) || 0} trên 5 sao">${starsText(review.rating)}</span>
          </div>
          <p>${escapeHTML(review.comment)}</p>
        </article>`;
    })
    .join("");
}

function setupReviewForm() {
  const form = document.getElementById("reviewForm");
  const ratingInput = document.getElementById("reviewRating");
  const commentInput = document.getElementById("reviewComment");
  const status = document.getElementById("reviewFeedback");
  const submitButton = form.querySelector(".review-submit");

  function loadCurrentReview() {
    let session = {};
    try {
      session = JSON.parse(localStorage.getItem("authSession") || "{}");
    } catch {
      session = {};
    }
    const username = String(session.username || "").toLowerCase();
    const currentReview = reviewStorage().find(
      (review) =>
        String(review.productId) === String(product?.id) &&
        String(review.username || "").toLowerCase() === username,
    );
    form.dataset.username = username;
    form.dataset.displayName = session.displayName || localStorage.getItem("username") || "Khách hàng";
    form.dataset.reviewId = currentReview?.id || "";
    if (currentReview) {
      ratingInput.value = String(currentReview.rating);
      commentInput.value = currentReview.comment || "";
      submitButton.textContent = "Cập nhật nhận xét";
    } else {
      submitButton.textContent = "Gửi nhận xét";
    }
  }

  loadCurrentReview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.classList.remove("error");
    status.textContent = "";
    const username = form.dataset.username;
    const comment = commentInput.value.trim();
    const rating = Number(ratingInput.value);
    if (!username) {
      status.textContent = "Vui lòng đăng nhập để gửi nhận xét.";
      status.classList.add("error");
      return;
    }
    if (comment.length < 5) {
      status.textContent = "Nhận xét cần có ít nhất 5 ký tự.";
      status.classList.add("error");
      commentInput.focus();
      return;
    }

    const reviews = reviewStorage();
    const existingIndex = reviews.findIndex(
      (review) =>
        String(review.productId) === String(product.id) &&
        String(review.username || "").toLowerCase() === username,
    );
    const review = {
      id: form.dataset.reviewId || `RV${Date.now()}`,
      productId: product.id,
      username,
      displayName: form.dataset.displayName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) reviews[existingIndex] = review;
    else reviews.push(review);

    try {
      localStorage.setItem("coffeeProductReviews", JSON.stringify(reviews));
      form.dataset.reviewId = review.id;
      submitButton.textContent = "Cập nhật nhận xét";
      status.textContent = "Nhận xét của bạn đã được lưu.";
      renderReviews();
    } catch {
      status.textContent = "Không lưu được nhận xét. Hãy thử lại.";
      status.classList.add("error");
    }
  });
}

let username = localStorage.getItem("username") || "Khách hàng";
try {
  const profile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
  username = profile.fullName || username;
} catch {
  // Keep the name saved by the existing customer pages.
}
document.getElementById("customerName").textContent = username;

let quantity = 1;
const quantityElement = document.getElementById("quantity");
document.getElementById("increaseBtn").addEventListener("click", () => {
  quantity += 1;
  quantityElement.value = String(quantity);
  quantityElement.textContent = String(quantity);
});
document.getElementById("decreaseBtn").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  quantityElement.value = String(quantity);
  quantityElement.textContent = String(quantity);
});

document.getElementById("addCartBtn").addEventListener("click", () => {
  if (!product) return;
  let cart = readArray("cart");
  const drink = !isFood(product);
  const sweetness = drink
    ? document.querySelector('input[name="sweetness"]:checked')?.value || "Vừa đường"
    : "";
  const ice = drink
    ? document.querySelector('input[name="ice"]:checked')?.value || "Vừa đá"
    : "";
  const isDefault = !drink || (sweetness === "Vừa đường" && ice === "Vừa đá");
  const cartKey = isDefault
    ? String(product.id)
    : `${product.id}|${encodeURIComponent(sweetness)}|${encodeURIComponent(ice)}`;
  const customization = drink ? { sweetness, ice } : null;
  let cartItem = cart.find(
    (item) =>
      String(item.id) === String(product.id) &&
      String(item.cartKey || item.id) === cartKey,
  );

  if (cartItem) {
    cartItem.quantity = (Number(cartItem.quantity) || 0) + quantity;
    if (customization) cartItem.customization = customization;
  } else {
    cart.push({
      id: product.id,
      productId: product.id,
      cartKey,
      name: product.name,
      price: Number(product.price) || 0,
      category: product.category,
      image: product.image,
      quantity,
      ...(customization ? { customization } : {}),
    });
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.updateCartCount?.();
    const feedback = document.getElementById("cartFeedback");
    feedback.textContent = `Đã thêm ${quantity} ${product.name} vào giỏ hàng.`;
    quantity = 1;
    quantityElement.value = "1";
    quantityElement.textContent = "1";
  } catch {
    document.getElementById("cartFeedback").textContent =
      "Không thể cập nhật giỏ hàng. Vui lòng thử lại.";
  }
});

document.getElementById("relatedProducts").addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  window.location.href = `product-details.html?id=${encodeURIComponent(button.dataset.productId)}`;
});

document.getElementById("reviewJump").addEventListener("click", () => {
  document.getElementById("reviewComment").focus({ preventScroll: true });
});

renderProduct();
if (product) setupReviewForm();

window.addEventListener("storage", (event) => {
  if (event.key === "coffeeProductReviews" && product) renderReviews();
  if (event.key === "hoianCoffeeProducts" && window.loadCoffeeProducts) {
    const refreshedProducts = window.loadCoffeeProducts();
    products = refreshedProducts;
    window.location.reload();
  }
});
