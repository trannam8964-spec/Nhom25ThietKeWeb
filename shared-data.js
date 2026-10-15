/* Shared browser storage for the customer, staff, and manager pages. */
(function () {
  const LEGACY_KEYS = {
    orders: ["hoianCoffeeOrders", "coffeeStaff_orders"],
    customers: ["hoiAnCoffeeCustomers"],
    tables: ["coffee_tables", "coffeeStaff_tables"],
  };
  const DEFAULT_TABLES = Array.from({ length: 12 }, (_, index) => {
    const number = index + 1;
    return {
      id: `B${String(number).padStart(2, "0")}`,
      name: `Bàn ${String(number).padStart(2, "0")}`,
      area: number <= 6 ? "Tầng trệt" : "Lầu 1",
      status: "Trống",
    };
  });
  const DEFAULT_PROMOTIONS = [
    {
      id: "COMBO-2-DRINKS",
      name: "Combo đi đôi",
      condition: "drink_quantity",
      minimumQuantity: 2,
      discountType: "percent",
      discountValue: 10,
      expiryDate: "2099-12-31",
      status: "active",
    },
    {
      id: "COMBO-3-DRINKS",
      name: "Combo nhóm 3 ly",
      condition: "drink_quantity",
      minimumQuantity: 3,
      discountType: "percent",
      discountValue: 15,
      expiryDate: "2099-12-31",
      status: "active",
    },
    {
      id: "COMBO-COFFEE-FOOD",
      name: "Combo cà phê & món ăn",
      condition: "coffee_food",
      minimumQuantity: 0,
      discountType: "fixed",
      discountValue: 10000,
      expiryDate: "2099-12-31",
      status: "active",
    },
  ];

  function parseArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function normalizeStatus(status) {
    const value = String(status || "")
      .trim()
      .toLocaleLowerCase("vi");
    const plain = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");

    if (
      /complete|finished|paid|ho.n th.nh|da hoan thanh/.test(plain) ||
      /ho.*th.{0,5}nh/.test(value)
    ) {
      return "completed";
    }
    if (/cancel|da huy|huy/.test(plain)) return "cancelled";
    if (/deliver|shipping|dang giao/.test(plain) || /giao/.test(value)) {
      return "delivering";
    }
    if (
      /prepar|processing|dang chuan bi/.test(plain) ||
      /chu.{0,8}n b.{0,8}/.test(value)
    )
      return "preparing";
    return "pending";
  }

  function normalizeTableStatus(status) {
    const plain = String(status || "")
      .trim()
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
    if (/reserved|booked|dat truoc|da dat truoc/.test(plain)) return "Đặt trước";
    if (
      /busy|occupied|using|serving|dang su dung|dang phuc vu|co khach/.test(
        plain,
      )
    ) {
      return "Đang sử dụng";
    }
    return "Trống";
  }

  function normalizeTables(rows) {
    const values = Array.isArray(rows) ? rows : [];
    return DEFAULT_TABLES.map((table, index) => {
      const number = index + 1;
      const saved = values.find((item) => {
        const id = String(item.id || item.number || item.tableNumber || "")
          .replace(/^B/i, "")
          .replace(/^0+/, "");
        const namedNumber = String(item.name || "").match(/\d+/)?.[0];
        return Number(id || namedNumber) === number;
      });
      return {
        ...table,
        status: normalizeTableStatus(saved?.status),
      };
    });
  }

  function mergeById(primary, legacy) {
    const merged = new Map();
    [...legacy, ...primary].forEach((item, index) => {
      const id = String(
        item.id || item.username || item.email || `legacy-${index}`,
      );
      merged.set(id, item);
    });
    return [...merged.values()];
  }

  function readArray(key) {
    let rows = parseArray(key);
    const legacy = (LEGACY_KEYS[key] || []).flatMap(parseArray);
    if (legacy.length) {
      rows = mergeById(rows, legacy);
      localStorage.setItem(key, JSON.stringify(rows));
      (LEGACY_KEYS[key] || []).forEach((legacyKey) =>
        localStorage.removeItem(legacyKey),
      );
    }
    if (key === "orders") {
      rows = rows.map((order) => ({
        ...order,
        status: normalizeStatus(order.status),
        customerId: order.customerId || "",
        customerName:
          order.customerName ||
          order.displayName ||
          order.customer ||
          order.username ||
          "Khách lẻ",
        customerEmail: order.customerEmail || order.email || "",
        customerPhone: order.customerPhone || order.phone || "",
        createdAt:
          order.createdAt || order.orderDate || order.date || order.time || "",
      }));
    }
    if (key === "tables") {
      rows = normalizeTables(rows);
      localStorage.setItem(key, JSON.stringify(rows));
    }
    return rows;
  }

  function writeArray(key, rows) {
    const value = Array.isArray(rows) ? rows : [];
    const normalized =
      key === "tables"
        ? normalizeTables(value)
        : key === "orders"
        ? value.map((order) => ({
            ...order,
            status: normalizeStatus(order.status),
            customerName:
              order.customerName ||
              order.displayName ||
              order.customer ||
              order.username ||
              "Khách lẻ",
          }))
        : value;
    localStorage.setItem(key, JSON.stringify(normalized));
    if (key === "customers") {
      const accounts = parseArray("registeredCustomers");
      let changed = false;
      normalized.forEach((customer) => {
        const account = accounts.find(
          (item) =>
            (customer.username && item.username === customer.username) ||
            (customer.email && item.email === customer.email),
        );
        if (account) {
          account.displayName =
            customer.name || customer.fullName || account.displayName;
          account.email = customer.email || account.email;
          account.phone = customer.phone || account.phone;
          account.address = customer.address || account.address;
          changed = true;
        }
      });
      if (changed)
        localStorage.setItem("registeredCustomers", JSON.stringify(accounts));
    }
    window.dispatchEvent(new CustomEvent("coffee:datachange", { detail: key }));
    window.dispatchEvent(new Event("hoian:datachange"));
  }

  function normalizePromotionStatus(status) {
    const plain = String(status || "active")
      .trim()
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return /inactive|expired|het han|ngung/.test(plain) ? "inactive" : "active";
  }

  function readPromotions() {
    const storageKey = "coffee_promotions";
    let promotions = parseArray(storageKey);
    if (localStorage.getItem("coffeePromotionDefaultsSeeded") !== "true") {
      const byId = new Map(promotions.map((item) => [String(item.id), item]));
      DEFAULT_PROMOTIONS.forEach((item) => {
        if (!byId.has(item.id)) byId.set(item.id, item);
      });
      promotions = [...byId.values()];
      localStorage.setItem("coffeePromotionDefaultsSeeded", "true");
      writePromotions(promotions);
    }
    return promotions.map((item) => ({
      ...item,
      condition: item.condition || "order",
      minimumQuantity: Math.max(0, Number(item.minimumQuantity) || 0),
      discountType: item.discountType === "fixed" ? "fixed" : "percent",
      discountValue: Number(item.discountValue ?? item.discount) || 0,
      status: normalizePromotionStatus(item.status),
    }));
  }

  function writePromotions(promotions) {
    const normalized = (Array.isArray(promotions) ? promotions : []).map(
      (item) => ({
        ...item,
        minimumQuantity: Math.max(0, Number(item.minimumQuantity) || 0),
        discountType: item.discountType === "fixed" ? "fixed" : "percent",
        discountValue: Number(item.discountValue ?? item.discount) || 0,
        status: normalizePromotionStatus(item.status),
      }),
    );
    localStorage.setItem("coffee_promotions", JSON.stringify(normalized));
    localStorage.setItem("coffeePromotionDefaultsSeeded", "true");
    window.dispatchEvent(
      new CustomEvent("coffee:datachange", { detail: "promotions" }),
    );
    window.dispatchEvent(new Event("hoian:datachange"));
  }

  function customerKey(customer) {
    return String(
      customer.username ||
        customer.email ||
        customer.phone ||
        customer.id ||
        "",
    ).toLocaleLowerCase("vi");
  }

  function readCustomers() {
    let customers = readArray("customers");
    const accounts = parseArray("registeredCustomers");
    const byKey = new Map(customers.map((item) => [customerKey(item), item]));

    accounts.forEach((account) => {
      const key = customerKey(account);
      if (!key) return;
      const existing =
        byKey.get(key) ||
        [...byKey.values()].find(
          (item) =>
            (account.email && item.email === account.email) ||
            (account.phone && item.phone === account.phone),
        ) ||
        {};
      if (existing && customerKey(existing) !== key) {
        byKey.delete(customerKey(existing));
      }
      byKey.set(key, {
        ...existing,
        id: existing.id || `KH-${account.username}`,
        username: account.username,
        name: existing.name || existing.fullName || account.displayName || "",
        fullName:
          existing.fullName || existing.name || account.displayName || "",
        email: existing.email || account.email || "",
        phone: existing.phone || account.phone || "",
        address: existing.address || account.address || "",
        createdAt: account.createdAt || existing.createdAt || "",
      });
    });

    customers = [...byKey.values()];
    localStorage.setItem("customers", JSON.stringify(customers));
    return customers;
  }

  function upsertCustomer(profile, username) {
    const customers = readCustomers();
    const index = customers.findIndex(
      (item) =>
        (username && item.username === username) ||
        (profile.email && item.email === profile.email) ||
        (profile.phone && item.phone === profile.phone),
    );
    const old = index >= 0 ? customers[index] : {};
    const updated = {
      ...old,
      id: old.id || `KH-${username || profile.email || Date.now()}`,
      username: username || old.username || "",
      name: profile.fullName || old.name || "",
      fullName: profile.fullName || old.fullName || profile.name || "",
      email: profile.email || old.email || "",
      phone: profile.phone || old.phone || "",
      address: profile.address || old.address || "",
      createdAt: old.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) customers[index] = updated;
    else customers.push(updated);
    writeArray("customers", customers);
    return updated;
  }

  window.CoffeeData = {
    normalizeStatus,
    normalizeTableStatus,
    readArray,
    writeArray,
    readPromotions,
    writePromotions,
    readCustomers,
    upsertCustomer,
  };
})();
