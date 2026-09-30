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
