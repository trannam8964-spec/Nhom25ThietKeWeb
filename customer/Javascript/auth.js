const demoRoleAccounts = {
  admin: { password: "admin123", role: "admin", displayName: "Quản trị viên" },
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

  try {
    existingProfile = JSON.parse(
      localStorage.getItem("customerProfile") || "{}",
    );
  } catch {
    existingProfile = {};
  }

  if (localStorage.getItem("username") !== customer.displayName) {
    existingProfile = {};
  }

  localStorage.setItem("username", customer.displayName);
  localStorage.setItem(
    "customerProfile",
    JSON.stringify({
      fullName: customer.displayName,
      email: customer.email || existingProfile.email || "",
      phone: existingProfile.phone || "",
      address: existingProfile.address || "",
    }),
  );
}

function createSalt() {
  let bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, function (byte) {
    return byte.toString(16).padStart(2, "0");
  }).join("");
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
      window.location.href = "/" + demoAccount.role + "/index.html";
      return;
    }

    let customers = readRegisteredCustomers();
    let registeredCustomer = customers.find(function (customer) {
      return customer.username.toLowerCase() === normalizedUsername;
    });

    if (registeredCustomer) {
      if (!password) {
        showAuthMessage(
          loginMessage,
          "Tài khoản này cần mật khẩu. Nếu quên, hãy đăng ký bằng tên khác trong bản demo.",
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
        return customer.username.toLowerCase() === normalizedUsername;
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
        salt: salt,
        passwordHash: passwordHash,
      };

      customers.push(customer);
      localStorage.setItem("registeredCustomers", JSON.stringify(customers));
      setCustomerProfile({ displayName: displayName, email: email });
      setAuthSession("customer", username, displayName);
      window.location.href = "/customer/Dashboard/customer1.html";
    } catch {
      showAuthMessage(
        registerMessage,
        "Không thể tạo tài khoản trong môi trường hiện tại. Hãy mở trang bằng localhost hoặc HTTPS.",
      );
    }
  });
}
