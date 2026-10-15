/* Các hàm dữ liệu dùng chung giữa các trang Staff. */
const StaffData = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem("coffeeStaff_" + key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem("coffeeStaff_" + key, JSON.stringify(value));
  },

  money(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  },

  orders() {
    if (window.CoffeeData) {
      return window.CoffeeData.readArray("orders");
    }
    const storedOrders = localStorage.getItem("orders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];
    if (!Array.isArray(orders)) {
      throw new TypeError("Dữ liệu đơn hàng không hợp lệ.");
    }

    const legacyOrders = this.get("orders", []);
    if (Array.isArray(legacyOrders) && legacyOrders.length) {
      const existingIds = new Set(orders.map((order) => String(order.id)));
      const migratedOrders = legacyOrders
        .filter((order) => !existingIds.has(String(order.id)))
        .map((order) => ({
          ...order,
          username: order.username || order.customer || "Khách hàng",
          customer: order.customer || order.username || "Khách hàng",
          date: order.date || order.time || "",
          time: order.time || order.date || "",
          paymentMethod: order.paymentMethod || order.method || "",
        }));
      orders = orders.concat(migratedOrders);
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.removeItem("coffeeStaff_orders");
    }

    return orders;
  },

  saveOrders(value) {
    if (window.CoffeeData) {
      window.CoffeeData.writeArray("orders", value);
      return;
    }
    localStorage.setItem("orders", JSON.stringify(value));
  },

  orderStatus(order) {
    return window.CoffeeData
      ? window.CoffeeData.normalizeStatus(order.status)
      : order.status;
  },

  statusLabel(status) {
    const labels = {
      pending: "Chờ nhân viên xác nhận",
      preparing: "Đang chuẩn bị",
      delivering: "Đang giao",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    return labels[this.orderStatus({ status })] || status;
  },

  orderCustomer(order) {
    return (
      order.customerName ||
      order.customer ||
      order.displayName ||
      order.username ||
      "Khách hàng"
    );
  },

  orderTime(order) {
    return order.time || order.date || "";
  },

  orderTimestamp(order) {
    const timestamp = Date.parse(
      order.createdAt || order.orderDate || order.date || order.time || "",
    );
    return Number.isFinite(timestamp) ? timestamp : 0;
  },

  orderItems(order) {
    return (Array.isArray(order.items) ? order.items : []).map((item) =>
      typeof item === "string"
        ? item
        : `${item.name || "Sản phẩm"} x${Number(item.quantity) || 1}`,
    );
  },

  paymentMethod(order) {
    const methods = { cash: "Tiền mặt", bank: "Chuyển khoản" };
    return (
      methods[order.paymentMethod] ||
      order.paymentMethod ||
      order.method ||
      "Tiền mặt"
    );
  },

  tables() {
    return window.CoffeeData
      ? window.CoffeeData.readArray("tables")
      : this.get("tables", []);
  },

  saveTables(value) {
    if (window.CoffeeData) {
      window.CoffeeData.writeArray("tables", value);
      return;
    }
    this.set("tables", value);
  },

  releaseTableForOrder(order) {
    if (!order?.tableNumber) return;
    const tables = this.tables();
    const table = tables.find(
      (item) =>
        String(item.id) === String(order.tableNumber) ||
        item.name === order.tableNumber,
    );
    if (!table) return;
    table.status = "Trống";
    this.saveTables(tables);
  },

  profile() {
    return this.get("profile", {
      name: "Nhân viên",
      email: "",
      phone: "",
      shift: "Sáng (07:00 - 12:00)",
    });
  },

  escape(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  },

  badge(status) {
    const classes = {
      pending: "status-pending",
      preparing: "status-preparing",
      delivering: "status-delivering",
      completed: "status-done",
      cancelled: "status-cancel",
    };
    const plain = String(status || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLocaleLowerCase("vi");
    const tableStatus = /^(trong|dang su dung|dat truoc|da dat truoc)$/.test(
      plain,
    );
    if (tableStatus) {
      const normalized =
        window.CoffeeData?.normalizeTableStatus(status) || status;
      const tableClasses = {
        "Trống": "table-empty",
        "Đang sử dụng": "table-busy",
        "Đặt trước": "table-reserved",
      };
      return "<span class=\"status " + (tableClasses[normalized] || "") + "\">" +
        this.escape(normalized) + "</span>";
    }
    const normalized = this.orderStatus({ status });
    return "<span class=\"status " + (classes[normalized] || "") + "\">" +
      this.escape(this.statusLabel(normalized)) + "</span>";
  },

  updateStaffName() {
    const name = this.profile().name || "Nhân viên";
    document
      .querySelectorAll("#staffname, #dashboardStaffName")
      .forEach((el) => (el.textContent = name));
  },
};

window.addEventListener("storage", () => {
  if (typeof window.refreshStaffPage === "function") {
    window.refreshStaffPage();
  }
});

window.addEventListener("coffee:datachange", (event) => {
  if (
    ["orders", "tables"].includes(event.detail) &&
    typeof window.refreshStaffPage === "function"
  ) {
    window.refreshStaffPage();
  }
});
