const KEYS = {
  products: "hoianCoffeeProducts",
  orders: "orders",
  customers: "customers",
};
const $ = (id) => document.getElementById(id);
let authSession = {};
try {
  authSession = JSON.parse(localStorage.getItem("authSession") || "{}");
} catch {
  authSession = {};
}
if (authSession.role !== "manager") {
  document.documentElement.style.visibility = "hidden";
  window.location.replace("/register/login.html");
}
const money = (n) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    Number(n) || 0,
  ) + "đ";
const safe = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function read(key) {
  if (window.CoffeeData && ["orders", "customers"].includes(key)) {
    return key === "customers"
      ? window.CoffeeData.readCustomers()
      : window.CoffeeData.readArray(key);
  }
  try {
    const x = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
}
function write(key, value) {
  if (window.CoffeeData && ["orders", "customers"].includes(key)) {
    window.CoffeeData.writeArray(key, value);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("hoian:datachange"));
}
function normalizeOrderStatus(s) {
  const v = String(s ?? "")
    .trim()
    .toLocaleLowerCase("vi");
  if (
    [
      "completed",
      "complete",
      "done",
      "finished",
      "hoàn thành",
      "hoan thanh",
      "đã hoàn thành",
      "da hoan thanh",
      "paid",
      "đã thanh toán",
      "da thanh toan",
    ].includes(v)
  )
    return "completed";
  if (
    ["cancelled", "canceled", "cancel", "đã hủy", "da huy", "hủy"].includes(v)
  )
    return "cancelled";
  if (["preparing", "processing", "đang chuẩn bị", "dang chuan bi"].includes(v))
    return "preparing";
  if (["delivering", "shipping", "đang giao", "dang giao"].includes(v))
    return "delivering";
  return "pending";
}
function statusLabel(s) {
  return (
    {
      pending: "Chờ nhân viên xác nhận",
      preparing: "Đang chuẩn bị",
      delivering: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    }[normalizeOrderStatus(s)] || "Chờ nhân viên xác nhận"
  );
}
function statusClass(s) {
  return "status-" + normalizeOrderStatus(s);
}
function initMenu() {
  const b = $("menuToggle");
  if (!b) return;
  const update = () =>
    b.setAttribute(
      "aria-expanded",
      String(
        innerWidth <= 760
          ? document.body.classList.contains("mobile-menu-open")
          : !document.body.classList.contains("sidebar-collapsed"),
      ),
    );
  b.addEventListener("click", () => {
    if (innerWidth <= 760) document.body.classList.toggle("mobile-menu-open");
    else document.body.classList.toggle("sidebar-collapsed");
    update();
  });
  addEventListener("resize", update);
  document.addEventListener("click", (e) => {
    if (
      innerWidth <= 760 &&
      document.body.classList.contains("mobile-menu-open") &&
      !e.target.closest(".sidebar") &&
      !e.target.closest("#menuToggle")
    ) {
      document.body.classList.remove("mobile-menu-open");
      update();
    }
  });
  update();
}
function downloadCSV(filename, rows) {
  const csv =
    "\ufeff" +
    rows
      .map((row) =>
        row
          .map((v) => '"' + String(v ?? "").replace(/"/g, '""') + '"')
          .join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
document.addEventListener("DOMContentLoaded", () => {
  const nameElement = document.getElementById("loggedInName");
  if (nameElement) {
    nameElement.textContent =
      authSession.displayName ||
      sessionStorage.getItem("hoiAnCoffeeUsername") ||
      "Admin";
  }
  document.querySelectorAll(".logout").forEach((link) => {
    link.addEventListener("click", () => {
      localStorage.removeItem("authSession");
      sessionStorage.removeItem("hoiAnCoffeeLoggedIn");
      sessionStorage.removeItem("hoiAnCoffeeUsername");
    });
  });
  initMenu();
});
