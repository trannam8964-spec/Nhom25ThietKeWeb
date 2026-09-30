(function () {
  let username = localStorage.getItem("username");

  if (!username) {
    try {
      let profile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
      username = profile.fullName;
    } catch {
      username = "";
    }
  }

  if (!username) {
    return;
  }

  let customerName = document.getElementById("customerName");
  if (customerName) {
    customerName.textContent = username;
  }
})();
