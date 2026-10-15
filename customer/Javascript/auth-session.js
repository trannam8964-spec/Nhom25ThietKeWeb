(function () {
  let requiredRole = document.body.dataset.requiredRole;
  let session = null;

  try {
    session = JSON.parse(localStorage.getItem("authSession") || "null");
  } catch {
    session = null;
  }

  if (!session || session.role !== requiredRole) {
    window.location.replace("/register/login.html");
    return;
  }

  function refreshCustomerAvatar() {
    let profile = {};
    try {
      profile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
    } catch {
      profile = {};
    }

    document
      .querySelectorAll(".user i.fa-circle-user, .user-info i.fa-circle-user")
      .forEach((icon) => {
        const iconStyle = getComputedStyle(icon);
        const originalSize = iconStyle.fontSize || "35px";
        const wrapper = document.createElement("span");
        wrapper.className = "customer-avatar-slot";
        wrapper.style.cssText = `position:relative;display:inline-flex;flex:0 0 ${originalSize};width:${originalSize};height:${originalSize};align-items:center;justify-content:center;`;

        const placeholder = icon.cloneNode(true);
        placeholder.style.fontSize = originalSize;
        placeholder.style.color = iconStyle.color;
        placeholder.style.lineHeight = "1";

        const image = document.createElement("img");
        image.className = "customer-avatar-image";
        image.alt = "Ảnh đại diện";
        image.src = profile.avatarDataUrl || "";
        image.hidden = !profile.avatarDataUrl;
        image.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:cover;";

        wrapper.append(placeholder, image);
        icon.replaceWith(wrapper);
      });

    document.querySelectorAll(".customer-avatar-image").forEach((image) => {
      image.src = profile.avatarDataUrl || "";
      image.hidden = !profile.avatarDataUrl;
    });
  }

  if (requiredRole === "customer") {
    window.refreshCustomerAvatar = refreshCustomerAvatar;
    refreshCustomerAvatar();
    window.addEventListener("storage", (event) => {
      if (event.key === "customerProfile") refreshCustomerAvatar();
    });
  }

  document.addEventListener("click", function (event) {
    let link = event.target.closest("a");
    if (!link || !link.textContent.includes("Đăng xuất")) {
      return;
    }

    event.preventDefault();
    localStorage.removeItem("authSession");
    window.location.replace("/register/login.html");
  });
})();
