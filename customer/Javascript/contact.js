let contactForm = document.getElementById("contactForm");
let contactStatus = document.getElementById("contactStatus");
let contactEmailInput = document.getElementById("contactEmail");
let profileForContact = {};

function showContactEmailError(message) {
  let field = contactEmailInput.closest(".field");
  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("small");
    error.className = "field-error";
    error.id = "contactEmailError";
    error.setAttribute("role", "alert");
    contactEmailInput.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
  contactEmailInput.setAttribute("aria-invalid", "true");
  contactEmailInput.setAttribute("aria-describedby", error.id);
}

function clearContactEmailError() {
  contactEmailInput.removeAttribute("aria-invalid");
  contactEmailInput.removeAttribute("aria-describedby");
  contactEmailInput.closest(".field").querySelector(".field-error")?.remove();
}

try {
  profileForContact = JSON.parse(
    localStorage.getItem("customerProfile") || "{}",
  );
} catch {
  profileForContact = {};
}

let defaultName =
  profileForContact.fullName || localStorage.getItem("username") || "";
document.getElementById("customerName").innerText = defaultName || "Khách hàng";
document.getElementById("contactName").value =
  defaultName === "Khách hàng" ? "" : defaultName;
document.getElementById("contactEmail").value = profileForContact.email || "";

contactEmailInput.addEventListener("blur", function () {
  if (
    contactEmailInput.value.trim() &&
    !window.CoffeeEmailValidation.isValid(contactEmailInput.value)
  ) {
    showContactEmailError(
      "Email chưa đúng định dạng. Kiểm tra lại phần sau dấu @, ví dụ: abc@gmail.com.",
    );
  }
});

contactEmailInput.addEventListener("input", function () {
  if (
    !contactEmailInput.value.trim() ||
    window.CoffeeEmailValidation.isValid(contactEmailInput.value)
  ) {
    clearContactEmailError();
  }
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!window.CoffeeEmailValidation.isValid(contactEmailInput.value)) {
    showContactEmailError(
      "Email chưa đúng định dạng. Kiểm tra lại phần sau dấu @, ví dụ: abc@gmail.com.",
    );
    contactStatus.textContent =
      "Vui lòng nhập email hợp lệ trước khi gửi lời nhắn.";
    contactEmailInput.focus();
    return;
  }
  clearContactEmailError();

  let formData = new FormData(contactForm);
  let message = {
    id: Date.now().toString(),
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    topic: formData.get("topic"),
    message: formData.get("message").trim(),
    createdAt: new Date().toISOString(),
  };
  let messages = [];

  try {
    let savedMessages = JSON.parse(
      localStorage.getItem("contactMessages") || "[]",
    );
    if (Array.isArray(savedMessages)) {
      messages = savedMessages;
    }
  } catch {
    messages = [];
  }

  messages.unshift(message);
  localStorage.setItem("contactMessages", JSON.stringify(messages));
  contactForm.elements.message.value = "";
  contactStatus.innerText = "Lời nhắn đã được lưu.";
});
