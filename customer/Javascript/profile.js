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

let avatarInput = document.getElementById("avatarInput");
let avatarImage = document.getElementById("avatarImage");
let avatarStatus = document.getElementById("avatarStatus");
let removeAvatarButton = document.getElementById("removeAvatar");

function renderAvatar() {
  avatarImage.src = profile.avatarDataUrl || "";
  avatarImage.hidden = !profile.avatarDataUrl;
  removeAvatarButton.disabled = !profile.avatarDataUrl;
}

function saveAvatar(avatarDataUrl) {
  let updatedProfile = { ...profile, avatarDataUrl };
  try {
    localStorage.setItem("customerProfile", JSON.stringify(updatedProfile));
    profile = updatedProfile;
    renderAvatar();
    window.refreshCustomerAvatar?.();
    avatarStatus.innerText = avatarDataUrl
      ? "Ảnh đại diện đã được cập nhật."
      : "Đã gỡ ảnh đại diện.";
  } catch {
    avatarStatus.innerText =
      "Không thể lưu ảnh này. Hãy chọn ảnh khác có dung lượng nhỏ hơn.";
  }
}

renderAvatar();

avatarInput.addEventListener("change", function () {
  let file = avatarInput.files?.[0];
  avatarInput.value = "";
  avatarStatus.innerText = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    avatarStatus.innerText = "Vui lòng chọn một tệp hình ảnh.";
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    avatarStatus.innerText = "Ảnh gốc cần nhỏ hơn 8 MB.";
    return;
  }

  let reader = new FileReader();
  reader.onerror = function () {
    avatarStatus.innerText = "Không thể đọc tệp ảnh này.";
  };
  reader.onload = function () {
    let sourceImage = new Image();
    sourceImage.onerror = function () {
      avatarStatus.innerText = "Tệp ảnh không đọc được. Hãy chọn ảnh khác.";
    };
    sourceImage.onload = function () {
      let maxSide = 512;
      let scale = Math.min(
        1,
        maxSide / Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight),
      );
      let canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sourceImage.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(sourceImage.naturalHeight * scale));
      let context = canvas.getContext("2d");
      if (!context) {
        avatarStatus.innerText = "Trình duyệt không xử lý được ảnh này.";
        return;
      }
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
      try {
        saveAvatar(canvas.toDataURL("image/jpeg", 0.84));
      } catch {
        avatarStatus.innerText =
          "Không thể xử lý ảnh này. Hãy chọn ảnh JPG hoặc PNG khác.";
      }
    };
    sourceImage.src = String(reader.result || "");
  };
  reader.readAsDataURL(file);
});

removeAvatarButton.addEventListener("click", function () {
  saveAvatar("");
});

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let formData = new FormData(profileForm);
  let updatedProfile = {
    username: profile.username || "",
    fullName: formData.get("fullName").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
    avatarDataUrl: profile.avatarDataUrl || "",
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
  window.refreshCustomerAvatar?.();
  profileStatus.innerText = "Thông tin đã được lưu trên trình duyệt này.";
});
