let contactForm = document.getElementById("contactForm");
let contactStatus = document.getElementById("contactStatus");
let profileForContact = {};

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

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

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
  contactStatus.innerText =
    "Lời nhắn đã được lưu trên trình duyệt này, chưa được gửi đến cửa hàng.";
});
