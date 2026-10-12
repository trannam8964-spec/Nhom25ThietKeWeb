let profileForm = document.getElementById("profileForm");
let profileStatus = document.getElementById("profileStatus");
let profile = {};

try {
  profile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
} catch {
  profile = {};
}

let savedName = profile.fullName || localStorage.getItem("username") || "";
document.getElementById("fullName").value =
  savedName === "Khách hàng" ? "" : savedName;
document.getElementById("email").value = profile.email || "";
document.getElementById("phone").value = profile.phone || "";
document.getElementById("address").value = profile.address || "";
document.getElementById("customerName").innerText = savedName || "Khách hàng";

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let formData = new FormData(profileForm);
  let updatedProfile = {
    fullName: formData.get("fullName").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
  };

  localStorage.setItem("customerProfile", JSON.stringify(updatedProfile));
  localStorage.setItem("username", updatedProfile.fullName);
  let authSession = {};
  try {
    authSession = JSON.parse(localStorage.getItem("authSession") || "{}");
  } catch {
    authSession = {};
  }
  if (window.CoffeeData) {
    window.CoffeeData.upsertCustomer(updatedProfile, authSession.username);
    let accounts = [];
    try {
      accounts = JSON.parse(
        localStorage.getItem("registeredCustomers") || "[]",
      );
    } catch {
      accounts = [];
    }
    const account = accounts.find(
      (item) => item.username === authSession.username,
    );
    if (account) {
      account.displayName = updatedProfile.fullName;
      account.email = updatedProfile.email;
      account.phone = updatedProfile.phone;
      account.address = updatedProfile.address;
      localStorage.setItem("registeredCustomers", JSON.stringify(accounts));
    }
  }
  document.getElementById("customerName").innerText = updatedProfile.fullName;
  profileStatus.innerText = "Thông tin đã được lưu trên trình duyệt này.";
});
