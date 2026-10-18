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
  profileStatus.innerText = "Thông tin đã được cập nhật.";
});

const passwordForm = document.getElementById("passwordForm");
const passwordStatus = document.getElementById("passwordStatus");

function showPasswordMessage(message, type = "error") {
  passwordStatus.classList.toggle("success", type === "success");
  passwordStatus.classList.toggle("error", type === "error");
  passwordStatus.textContent = message;
}

function getProfilePasswordError(input) {
  const value = input.value;
  if (input.required && !value) return "Vui lòng nhập mật khẩu.";
  if (input.id === "currentPassword") return "";
  if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  if (!/[A-Z]/.test(value)) return "Mật khẩu cần có ít nhất một chữ hoa.";
  if (!/[a-z]/.test(value)) return "Mật khẩu cần có ít nhất một chữ thường.";
  if (!/[0-9]/.test(value)) return "Mật khẩu cần có ít nhất một chữ số.";
  if (!/[^A-Za-z0-9\s]/.test(value)) {
    return "Mật khẩu cần có ít nhất một ký tự đặc biệt, ví dụ: !, @, #.";
  }
  if (
    input.id === "confirmNewPassword" &&
    value !== document.getElementById("newPassword").value
  ) {
    return "Mật khẩu nhập lại chưa khớp.";
  }
  return "";
}

function setProfilePasswordError(input, message) {
  let field = input.closest(".field");
  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("small");
    error.className = "field-error";
    error.id = `${input.id}Error`;
    error.setAttribute("role", "alert");
    input.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", error.id);
}

function clearProfilePasswordError(input) {
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  input.closest(".field")?.querySelector(".field-error")?.remove();
}

passwordForm.addEventListener("focusout", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const message = getProfilePasswordError(input);
  if (message) setProfilePasswordError(input, message);
  else clearProfilePasswordError(input);
});

passwordForm.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  showPasswordMessage("");
  if (input.getAttribute("aria-invalid") === "true") {
    const message = getProfilePasswordError(input);
    if (message) setProfilePasswordError(input, message);
    else clearProfilePasswordError(input);
  }
  const confirmation = document.getElementById("confirmNewPassword");
  if (
    input.id === "newPassword" &&
    confirmation.getAttribute("aria-invalid") === "true"
  ) {
    const message = getProfilePasswordError(confirmation);
    if (message) setProfilePasswordError(confirmation, message);
    else clearProfilePasswordError(confirmation);
  }
});

function createPasswordSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashCustomerPassword(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

passwordForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  showPasswordMessage("");

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const currentInput = document.getElementById("currentPassword");
  const newInput = document.getElementById("newPassword");
  const confirmationInput = document.getElementById("confirmNewPassword");
  const inputs = [currentInput, newInput, confirmationInput];
  let firstInvalid = null;

  inputs.forEach((input) => {
    clearProfilePasswordError(input);
    const message = getProfilePasswordError(input);
    if (message) {
      setProfilePasswordError(input, message);
      firstInvalid ||= input;
    }
  });
  if (firstInvalid) {
    firstInvalid.focus();
    showPasswordMessage("Vui lòng kiểm tra lại thông tin được đánh dấu.");
    return;
  }

  let session = {};
  try {
    session = JSON.parse(localStorage.getItem("authSession") || "{}");
  } catch {
    session = {};
  }
  if (session.role !== "customer" || !session.username) {
    showPasswordMessage("Không tìm thấy tài khoản Customer đang đăng nhập.");
    return;
  }

  let accounts = [];
  try {
    const storedAccounts = JSON.parse(
      localStorage.getItem("registeredCustomers") || "[]",
    );
    accounts = Array.isArray(storedAccounts) ? storedAccounts : [];
  } catch {
    accounts = [];
  }
  const accountIndex = accounts.findIndex(
    (account) =>
      String(account.username || "").toLowerCase() ===
      String(session.username).toLowerCase(),
  );
  if (
    accountIndex < 0 ||
    !accounts[accountIndex].salt ||
    !accounts[accountIndex].passwordHash
  ) {
    showPasswordMessage(
      "Tài khoản này chưa có mật khẩu đăng ký. Hãy tạo tài khoản trước khi đổi mật khẩu.",
    );
    return;
  }

  try {
    const account = accounts[accountIndex];
    const currentHash = await hashCustomerPassword(
      currentPassword,
      account.salt,
    );
    if (currentHash !== account.passwordHash) {
      setProfilePasswordError(
        currentInput,
        "Mật khẩu hiện tại không đúng. Vui lòng thử lại.",
      );
      showPasswordMessage("Mật khẩu hiện tại không đúng.");
      currentInput.focus();
      return;
    }

    const salt = createPasswordSalt();
    account.salt = salt;
    account.passwordHash = await hashCustomerPassword(newPassword, salt);
    localStorage.setItem("registeredCustomers", JSON.stringify(accounts));
    passwordForm.reset();
    inputs.forEach(clearProfilePasswordError);
    showPasswordMessage(
      "Đổi mật khẩu thành công. Hãy dùng mật khẩu mới ở lần đăng nhập tiếp theo.",
      "success",
    );
  } catch {
    showPasswordMessage(
      "Không thể đổi mật khẩu ở môi trường này. Hãy mở website bằng localhost hoặc HTTPS.",
    );
  }
});
