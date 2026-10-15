const demoRoleAccounts = {
  admin: { password: "123456", role: "manager", displayName: "Quản trị viên" },
  staff: { password: "staff123", role: "staff", displayName: "Nhân viên" },
};

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
    JSON.stringify({
      role: role,
      username: username,
      displayName: displayName,
    }),
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
  return Array.from(bytes, function (byte) {
    return byte.toString(16).padStart(2, "0");
  }).join("");
}

function normalizePhone(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/^\+84/, "0");
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

  return Array.from(new Uint8Array(derivedBits), function (byte) {
    return byte.toString(16).padStart(2, "0");
  }).join("");
}

function showAuthMessage(element, message, isSuccess) {
  element.textContent = message;
  element.classList.toggle("success", Boolean(isSuccess));
}

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  let loginUsername = document.getElementById("loginUsername");
  let loginPassword = document.getElementById("loginPassword");
  let loginMessage = document.getElementById("loginMessage");
  loginUsername.value = localStorage.getItem("username") || "";
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

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = loginUsername.value.trim();
    let password = loginPassword.value;
    let normalizedUsername = username.toLowerCase();
    let demoAccount = demoRoleAccounts[normalizedUsername];

    if (demoAccount) {
      if (password !== demoAccount.password) {
        showAuthMessage(
          loginMessage,
          "Tên đăng nhập hoặc mật khẩu không đúng.",
        );
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
          : demoAccount.role === "manager"
            ? "/manager/lyna7200/coffe/coffe.html"
            : "/customer/Dashboard/customer1.html";
      window.location.href = destination;
      return;
    }

    let customers = readRegisteredCustomers();
    let registeredCustomer = customers.find(function (customer) {
      return (
        String(customer.username || "").toLowerCase() === normalizedUsername
      );
    });

    if (registeredCustomer) {
      if (!password) {
        showAuthMessage(
          loginMessage,
          "Tài khoản này cần mật khẩu. Nếu quên, hãy chọn Quên mật khẩu để khôi phục.",
        );
        return;
      }

      try {
        let passwordHash = await hashPassword(
          password,
          registeredCustomer.salt,
        );
        if (passwordHash !== registeredCustomer.passwordHash) {
          showAuthMessage(
            loginMessage,
            "Tên đăng nhập hoặc mật khẩu không đúng.",
          );
          return;
        }
      } catch {
        showAuthMessage(
          loginMessage,
          "Không thể xác thực trong môi trường hiện tại. Hãy mở trang bằng localhost hoặc HTTPS.",
        );
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
      return;
    }

    if (password) {
      showAuthMessage(
        loginMessage,
        "Chưa có tài khoản này. Hãy đăng ký hoặc để trống mật khẩu để vào nhanh với tên khách.",
      );
      return;
    }

    setCustomerProfile({ displayName: username });
    setAuthSession("customer", normalizedUsername, username);
    window.location.href = "/customer/Dashboard/customer1.html";
  });
}

let registerForm = document.getElementById("registerForm");
if (registerForm) {
  let registerMessage = document.getElementById("registerMessage");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(registerForm);
    let displayName = formData.get("fullName").trim();
    let username = formData.get("username").trim();
    let normalizedUsername = username.toLowerCase();
    let email = formData.get("email").trim();
    let phone = formData.get("phone").trim();
    let password = formData.get("password");
    let confirmPassword = formData.get("confirmPassword");

    if (demoRoleAccounts[normalizedUsername]) {
      showAuthMessage(
        registerMessage,
        "Tên đăng nhập này dành riêng cho tài khoản demo.",
      );
      return;
    }

    if (password !== confirmPassword) {
      showAuthMessage(registerMessage, "Mật khẩu nhập lại chưa khớp.");
      return;
    }

    let customers = readRegisteredCustomers();
    if (
      customers.some(function (customer) {
        return (
          String(customer.username || "").toLowerCase() ===
            normalizedUsername ||
          String(customer.email || "").toLowerCase() === email.toLowerCase() ||
          String(customer.phone || "").replace(/\s/g, "") ===
            phone.replace(/\s/g, "")
        );
      })
    ) {
      showAuthMessage(registerMessage, "Tên đăng nhập đã được sử dụng.");
      return;
    }

    try {
      let salt = createSalt();
      let passwordHash = await hashPassword(password, salt);
      let customer = {
        username: username,
        displayName: displayName,
        email: email,
        phone: phone,
        salt: salt,
        passwordHash: passwordHash,
      };

      customers.push(customer);
      localStorage.setItem("registeredCustomers", JSON.stringify(customers));
      window.location.replace(
        "/register/login.html?registered=1&username=" +
          encodeURIComponent(username),
      );
    } catch {
      showAuthMessage(
        registerMessage,
        "Không thể tạo tài khoản trong môi trường hiện tại. Hãy mở trang bằng localhost hoặc HTTPS.",
      );
    }
  });
}

let forgotPasswordForm = document.getElementById("forgotPasswordForm");
if (forgotPasswordForm) {
  let forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

  forgotPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("recoveryUsername").value.trim();
    let email = document
      .getElementById("recoveryEmail")
      .value.trim()
      .toLowerCase();
    let phone = normalizePhone(
      document.getElementById("recoveryPhone").value,
    );
    let password = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmNewPassword").value;

    if (password !== confirmPassword) {
      showAuthMessage(
        forgotPasswordMessage,
        "Mật khẩu mới nhập lại chưa khớp.",
      );
      return;
    }

    let customers = readRegisteredCustomers();
    let accountIndex = customers.findIndex(
      (customer) =>
        String(customer.username || "").toLowerCase() === username.toLowerCase() &&
        String(customer.email || "").trim().toLowerCase() === email &&
        normalizePhone(customer.phone) === phone,
    );

    if (accountIndex < 0) {
      showAuthMessage(
        forgotPasswordMessage,
        "Thông tin không khớp với tài khoản đã đăng ký. Vui lòng kiểm tra lại.",
      );
      return;
    }

    try {
      let salt = createSalt();
      let passwordHash = await hashPassword(password, salt);
      customers[accountIndex] = {
        ...customers[accountIndex],
        salt: salt,
        passwordHash: passwordHash,
      };
      localStorage.setItem("registeredCustomers", JSON.stringify(customers));
      let loginUrl =
        "/register/login.html?reset=success&username=" +
        encodeURIComponent(customers[accountIndex].username);
      window.location.replace(loginUrl);
    } catch {
      showAuthMessage(
        forgotPasswordMessage,
        "Không thể đổi mật khẩu trong môi trường này. Hãy mở trang bằng localhost hoặc HTTPS.",
      );
    }
  });
}
