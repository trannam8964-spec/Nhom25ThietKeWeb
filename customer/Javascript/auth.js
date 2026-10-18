const demoRoleAccounts = {
  admin: { password: "Admin@123", role: "manager", displayName: "Quản trị viên" },
  staff: { password: "Staff@123", role: "staff", displayName: "Nhân viên" },
};

const usernamePattern = /^[A-Za-z0-9_.-]{3,30}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const phonePattern = /^0[0-9]{9}$/;

function passwordValidationMessage(password) {
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  if (!/[A-Z]/.test(password)) return "Mật khẩu cần có ít nhất một chữ hoa.";
  if (!/[a-z]/.test(password)) return "Mật khẩu cần có ít nhất một chữ thường.";
  if (!/[0-9]/.test(password)) return "Mật khẩu cần có ít nhất một chữ số.";
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Mật khẩu cần có ít nhất một ký tự đặc biệt, ví dụ: !, @, #.";
  }
  return "";
}

function readRegisteredCustomers() {
  try {
    let customers = JSON.parse(
      localStorage.getItem("registeredCustomers") || "[]",
    );
    return Array.isArray(customers) ? customers : [];
  } catch {
    return [];
  }
}

function setAuthSession(role, username, displayName) {
  localStorage.setItem(
    "authSession",
    JSON.stringify({ role, username, displayName }),
  );
}

function setCustomerProfile(customer) {
  let existingProfile = {};
  let profileUsername = String(customer.username || customer.displayName || "");

  try {
    existingProfile = JSON.parse(
      localStorage.getItem("customerProfile") || "{}",
    );
  } catch {
    existingProfile = {};
  }

  if (
    localStorage.getItem("username") !== customer.displayName ||
    (existingProfile.username &&
      String(existingProfile.username).toLowerCase() !==
        profileUsername.toLowerCase())
  ) {
    existingProfile = {};
  }

  localStorage.setItem("username", customer.displayName);
  localStorage.setItem(
    "customerProfile",
    JSON.stringify({
      username: profileUsername,
      fullName: customer.displayName,
      email: customer.email || existingProfile.email || "",
      phone: customer.phone || existingProfile.phone || "",
      address: existingProfile.address || "",
      avatarDataUrl: existingProfile.avatarDataUrl || "",
    }),
  );
  if (window.CoffeeData) {
    window.CoffeeData.upsertCustomer(
      {
        fullName: customer.displayName,
        email: customer.email || existingProfile.email || "",
        phone: customer.phone || existingProfile.phone || "",
        address: existingProfile.address || "",
      },
      customer.username || localStorage.getItem("username"),
    );
  }
}

function createSalt() {
  let bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length === 11) {
    digits = `0${digits.slice(2)}`;
  }
  return digits;
}

async function hashPassword(password, salt) {
  let encoder = new TextEncoder();
  let keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  let derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return Array.from(new Uint8Array(derivedBits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function showAuthMessage(element, message, isSuccess = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("success", Boolean(isSuccess));
}

function setFieldError(input, message) {
  if (!input) return;
  let field = input.closest(".field");
  if (!field) return;

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

function clearFieldError(input) {
  if (!input) return;
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
  input.closest(".field")?.querySelector(".field-error")?.remove();
}

function getAuthFieldError(input) {
  let value = input.value;
  let trimmed = value.trim();

  if (input.required && !trimmed) {
    const requiredMessages = {
      registerName: "Vui lòng nhập họ và tên.",
      registerUsername: "Vui lòng nhập tên đăng nhập.",
      loginUsername: "Vui lòng nhập tên đăng nhập.",
      recoveryUsername: "Vui lòng nhập tên đăng nhập.",
      registerEmail: "Vui lòng nhập email.",
      recoveryEmail: "Vui lòng nhập email.",
      registerPhone: "Vui lòng nhập số điện thoại.",
      recoveryPhone: "Vui lòng nhập số điện thoại.",
      loginPassword: "Vui lòng nhập mật khẩu.",
      registerPassword: "Vui lòng nhập mật khẩu.",
      confirmPassword: "Vui lòng nhập lại mật khẩu.",
      currentPassword: "Vui lòng nhập mật khẩu hiện tại.",
      newPassword: "Vui lòng nhập mật khẩu mới.",
      confirmNewPassword: "Vui lòng nhập lại mật khẩu mới.",
    };
    return requiredMessages[input.id] || "Vui lòng nhập thông tin này.";
  }

  switch (input.id) {
    case "registerName":
      if (trimmed.length < 2) return "Họ và tên cần có ít nhất 2 ký tự.";
      if (trimmed.length > 80) return "Họ và tên không được vượt quá 80 ký tự.";
      break;
    case "registerUsername":
    case "loginUsername":
    case "recoveryUsername":
      if (!usernamePattern.test(trimmed)) {
        return "Tên đăng nhập cần từ 3–30 ký tự; chỉ dùng chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.";
      }
      break;
    case "registerEmail":
    case "recoveryEmail":
      if (!emailPattern.test(trimmed)) {
        return "Nhập email đúng định dạng, ví dụ: abc@gmail.com.";
      }
      break;
    case "registerPhone":
    case "recoveryPhone":
      if (!phonePattern.test(trimmed)) {
        return "Nhập đúng 10 chữ số, bắt đầu bằng số 0; không nhập dấu cách hoặc ký tự khác.";
      }
      break;
    case "loginPassword":
    case "registerPassword":
    case "confirmPassword":
    case "newPassword":
    case "confirmNewPassword": {
      let passwordError = passwordValidationMessage(value);
      if (passwordError) return passwordError;

      let originalPasswordId =
        input.id === "confirmPassword" || input.id === "confirmNewPassword"
          ? input.id === "confirmPassword"
            ? "registerPassword"
            : "newPassword"
          : "";
      if (originalPasswordId) {
        let originalPassword = document.getElementById(originalPasswordId);
        if (originalPassword && value !== originalPassword.value) {
          return "Mật khẩu nhập lại chưa khớp.";
        }
      }
      break;
    }
  }

  return "";
}

function validateAuthForm(form) {
  let firstInvalid = null;
  let inputs = Array.from(form.querySelectorAll("input"));

  inputs.forEach((input) => {
    let message = getAuthFieldError(input);
    if (message) {
      setFieldError(input, message);
      firstInvalid ||= input;
    } else {
      clearFieldError(input);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function attachAuthValidation(form, messageElement) {
  form.addEventListener("focusout", (event) => {
    let input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    let message = getAuthFieldError(input);
    if (message) setFieldError(input, message);
    else clearFieldError(input);
  });

  form.addEventListener("input", (event) => {
    let input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    showAuthMessage(messageElement, "");

    if (input.getAttribute("aria-invalid") === "true") {
      let message = getAuthFieldError(input);
      if (message) setFieldError(input, message);
      else clearFieldError(input);
    }

    let confirmationId =
      input.id === "registerPassword"
        ? "confirmPassword"
        : input.id === "newPassword"
          ? "confirmNewPassword"
          : "";
    let confirmation = confirmationId
      ? document.getElementById(confirmationId)
      : null;
    if (confirmation?.getAttribute("aria-invalid") === "true") {
      let message = getAuthFieldError(confirmation);
      if (message) setFieldError(confirmation, message);
      else clearFieldError(confirmation);
    }
  });
}

function focusFirstInvalid(form) {
  form.querySelector('[aria-invalid="true"]')?.focus();
}

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  let loginUsername = document.getElementById("loginUsername");
  let loginPassword = document.getElementById("loginPassword");
  let loginMessage = document.getElementById("loginMessage");
  let loginParams = new URLSearchParams(window.location.search);
  let noticeUsername = loginParams.get("username");
  if (noticeUsername) loginUsername.value = noticeUsername;

  if (loginParams.get("registered") === "1") {
    showAuthMessage(
      loginMessage,
      "Tạo tài khoản thành công. Hãy đăng nhập bằng mật khẩu vừa đăng ký.",
      true,
    );
  } else if (loginParams.get("reset") === "success") {
    showAuthMessage(
      loginMessage,
      "Đổi mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.",
      true,
    );
  }

  attachAuthValidation(loginForm, loginMessage);
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let usernameError = getAuthFieldError(loginUsername);
    if (usernameError) {
      setFieldError(loginUsername, usernameError);
      showAuthMessage(loginMessage, "Vui lòng kiểm tra tên đăng nhập.");
      loginUsername.focus();
      return;
    }

    let username = loginUsername.value.trim();
    let normalizedUsername = username.toLowerCase();
    let demoAccount = demoRoleAccounts[normalizedUsername];
    let customers = readRegisteredCustomers();
    let registeredCustomer = customers.find(
      (customer) =>
        String(customer.username || "").toLowerCase() === normalizedUsername,
    );

    if (!demoAccount && !registeredCustomer) {
      clearFieldError(loginPassword);
      setFieldError(
        loginUsername,
        "Tài khoản chưa tồn tại. Vui lòng đăng ký tài khoản.",
      );
      showAuthMessage(loginMessage, "Không tìm thấy tài khoản đăng nhập.");
      focusFirstInvalid(loginForm);
      return;
    }

    let passwordError = getAuthFieldError(loginPassword);
    if (passwordError) {
      setFieldError(loginPassword, passwordError);
      showAuthMessage(loginMessage, "Vui lòng nhập mật khẩu đúng định dạng.");
      loginPassword.focus();
      return;
    }
    clearFieldError(loginUsername);
    clearFieldError(loginPassword);
    let password = loginPassword.value;

    if (demoAccount) {
      if (password !== demoAccount.password) {
        setFieldError(loginPassword, "Mật khẩu không đúng. Vui lòng thử lại.");
        showAuthMessage(loginMessage, "Thông tin đăng nhập chưa chính xác.");
        focusFirstInvalid(loginForm);
        return;
      }

      setAuthSession(
        demoAccount.role,
        normalizedUsername,
        demoAccount.displayName,
      );
      if (demoAccount.role === "manager") {
        sessionStorage.setItem("hoiAnCoffeeLoggedIn", "true");
        sessionStorage.setItem("hoiAnCoffeeUsername", demoAccount.displayName);
      }
      let destination =
        demoAccount.role === "staff"
          ? "/staff/Staff/Dashboard/Dashboard.html"
          : "/manager/lyna7200/coffe/coffe.html";
      window.location.href = destination;
      return;
    }

    try {
      let passwordHash = await hashPassword(password, registeredCustomer.salt);
      if (passwordHash !== registeredCustomer.passwordHash) {
        setFieldError(loginPassword, "Mật khẩu không đúng. Vui lòng thử lại.");
        showAuthMessage(loginMessage, "Thông tin đăng nhập chưa chính xác.");
        focusFirstInvalid(loginForm);
        return;
      }

      setCustomerProfile({
        displayName: registeredCustomer.displayName,
        email: registeredCustomer.email,
        phone: registeredCustomer.phone,
        username: registeredCustomer.username,
      });
      setAuthSession(
        "customer",
        registeredCustomer.username,
        registeredCustomer.displayName,
      );
      window.location.href = "/customer/Dashboard/customer1.html";
    } catch {
      showAuthMessage(
        loginMessage,
        "Không thể xác thực. Hãy mở website bằng localhost hoặc HTTPS rồi thử lại.",
      );
    }
  });
}

let registerForm = document.getElementById("registerForm");
if (registerForm) {
  let registerMessage = document.getElementById("registerMessage");
  attachAuthValidation(registerForm, registerMessage);

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateAuthForm(registerForm)) {
      showAuthMessage(registerMessage, "Vui lòng kiểm tra lại thông tin được đánh dấu.");
      return;
    }

    let formData = new FormData(registerForm);
    let displayName = String(formData.get("fullName") || "").trim();
    let username = String(formData.get("username") || "").trim();
    let normalizedUsername = username.toLowerCase();
    let email = String(formData.get("email") || "").trim().toLowerCase();
    let phone = String(formData.get("phone") || "").trim();
    let password = String(formData.get("password") || "");
    let customers = readRegisteredCustomers();

    if (demoRoleAccounts[normalizedUsername]) {
      setFieldError(
        document.getElementById("registerUsername"),
        "Tên đăng nhập này dành riêng cho tài khoản quản trị hoặc nhân viên.",
      );
      focusFirstInvalid(registerForm);
      return;
    }

    let usernameExists = customers.some(
      (customer) =>
        String(customer.username || "").toLowerCase() === normalizedUsername,
    );
    let emailExists = customers.some(
      (customer) => String(customer.email || "").trim().toLowerCase() === email,
    );
    let phoneExists = customers.some(
      (customer) => normalizePhone(customer.phone) === normalizePhone(phone),
    );

    if (usernameExists) {
      setFieldError(
        document.getElementById("registerUsername"),
        "Tên đăng nhập này đã được sử dụng.",
      );
    }
    if (emailExists) {
      setFieldError(
        document.getElementById("registerEmail"),
        "Email này đã được đăng ký.",
      );
    }
    if (phoneExists) {
      setFieldError(
        document.getElementById("registerPhone"),
        "Số điện thoại này đã được đăng ký.",
      );
    }
    if (usernameExists || emailExists || phoneExists) {
      showAuthMessage(registerMessage, "Thông tin đã tồn tại. Hãy kiểm tra các mục được đánh dấu.");
      focusFirstInvalid(registerForm);
      return;
    }

    try {
      let salt = createSalt();
      let passwordHash = await hashPassword(password, salt);
      customers.push({
        username,
        displayName,
        email,
        phone,
        salt,
        passwordHash,
      });
      localStorage.setItem("registeredCustomers", JSON.stringify(customers));
      window.location.replace(
        "/register/login.html?registered=1&username=" +
          encodeURIComponent(username),
      );
    } catch {
      showAuthMessage(
        registerMessage,
        "Không thể tạo tài khoản. Hãy mở website bằng localhost hoặc HTTPS rồi thử lại.",
      );
    }
  });
}

let forgotPasswordForm = document.getElementById("forgotPasswordForm");
if (forgotPasswordForm) {
  let forgotPasswordMessage = document.getElementById("forgotPasswordMessage");
  attachAuthValidation(forgotPasswordForm, forgotPasswordMessage);

  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateAuthForm(forgotPasswordForm)) {
      showAuthMessage(forgotPasswordMessage, "Vui lòng kiểm tra lại thông tin được đánh dấu.");
      return;
    }

    let usernameInput = document.getElementById("recoveryUsername");
    let emailInput = document.getElementById("recoveryEmail");
    let phoneInput = document.getElementById("recoveryPhone");
    let username = usernameInput.value.trim().toLowerCase();
    let email = emailInput.value.trim().toLowerCase();
    let phone = normalizePhone(phoneInput.value);
    let password = document.getElementById("newPassword").value;
    let customers = readRegisteredCustomers();
    let accountIndex = customers.findIndex(
      (customer) => String(customer.username || "").toLowerCase() === username,
    );

    if (accountIndex < 0) {
      setFieldError(
        usernameInput,
        "Không tìm thấy tài khoản. Vui lòng kiểm tra tên đăng nhập hoặc đăng ký tài khoản.",
      );
      showAuthMessage(forgotPasswordMessage, "Không tìm thấy tài khoản cần khôi phục.");
      focusFirstInvalid(forgotPasswordForm);
      return;
    }

    let customer = customers[accountIndex];
    if (String(customer.email || "").trim().toLowerCase() !== email) {
      setFieldError(emailInput, "Email không khớp với tài khoản đã đăng ký.");
    }
    if (normalizePhone(customer.phone) !== phone) {
      setFieldError(phoneInput, "Số điện thoại không khớp với tài khoản đã đăng ký.");
    }
    if (
      String(customer.email || "").trim().toLowerCase() !== email ||
      normalizePhone(customer.phone) !== phone
    ) {
      showAuthMessage(forgotPasswordMessage, "Thông tin xác minh chưa khớp với tài khoản.");
      focusFirstInvalid(forgotPasswordForm);
      return;
    }

    try {
      let salt = createSalt();
      let passwordHash = await hashPassword(password, salt);
      customers[accountIndex] = { ...customer, salt, passwordHash };
      localStorage.setItem("registeredCustomers", JSON.stringify(customers));
      window.location.replace(
        "/register/login.html?reset=success&username=" +
          encodeURIComponent(customer.username),
      );
    } catch {
      showAuthMessage(
        forgotPasswordMessage,
        "Không thể đổi mật khẩu. Hãy mở website bằng localhost hoặc HTTPS rồi thử lại.",
      );
    }
  });
}
