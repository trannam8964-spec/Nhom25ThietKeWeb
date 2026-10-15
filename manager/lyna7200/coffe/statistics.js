(() => {
  const $ = (id) => document.getElementById(id);
  const KEYS = {
    products: "hoianCoffeeProducts",
    orders: "orders",
    customers: "customers",
  };
  const money = (n) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
      Number(n) || 0,
    ) + "đ";
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function read(k) {
    if (window.CoffeeData && ["orders", "customers"].includes(k)) {
      return k === "customers"
        ? window.CoffeeData.readCustomers()
        : window.CoffeeData.readArray(k);
    }
    try {
      const a = JSON.parse(localStorage.getItem(k) || "[]");
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  function total(o) {
    return (
      Number(o.total) ||
      Number(o.totalAmount) ||
      (o.items || []).reduce(
        (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1),
        0,
      )
    );
  }
  function dateOf(o) {
    const d = new Date(o.createdAt || o.date || o.orderDate || "");
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function dayKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function completed(o) {
    return normalizeOrderStatus(o.status) === "completed";
  }
  function inPeriod(d, p, now) {
    if (!d) return false;
    if (p === "today") return dayKey(d) === dayKey(now);
    if (p === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return d >= start && d <= now;
    }
    if (p === "month")
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    if (p === "year") return d.getFullYear() === now.getFullYear();
    return true;
  }
  function renderStats() {
    const orders = read(KEYS.orders),
      products = read(KEYS.products),
      period = $("periodSelect")?.value || "today",
      now = new Date();
    const selected = orders.filter((o) => inPeriod(dateOf(o), period, now)),
      done = selected.filter(completed);
    const revenue = done.reduce((s, o) => s + total(o), 0);
    $("totalRevenue").textContent = money(revenue);
    $("totalOrders").textContent = selected.length;
    const sold = {};
    done.forEach((o) =>
      (o.items || []).forEach((i) => {
        const name =
          i.name ||
          products.find((p) => p.id === i.productId)?.name ||
          "Sản phẩm";
        sold[name] = (sold[name] || 0) + (Number(i.quantity) || 1);
      }),
    );
    const best = Object.entries(sold).sort((a, b) => b[1] - a[1])[0];
    $("bestProduct").textContent = best?.[0] || "Chưa có dữ liệu";
    $("bestProductCount").textContent = `${best?.[1] || 0} sản phẩm đã bán`;
    renderRevenueChart(done, period, now);
    renderTop(sold);
    renderCategories(done, products);
  }
  function renderRevenueChart(done, period, now) {
    const labels = [],
      values = [];
    if (period === "today") {
      for (let h = 0; h < 24; h += 3) {
        labels.push(`${String(h).padStart(2, "0")}h`);
        values.push(
          done
            .filter((o) => {
              const d = dateOf(o);
              return (
                d &&
                dayKey(d) === dayKey(now) &&
                d.getHours() >= h &&
                d.getHours() < h + 3
              );
            })
            .reduce((s, o) => s + total(o), 0),
        );
      }
    } else if (period === "year") {
      for (let m = 0; m < 12; m++) {
        labels.push(`T${m + 1}`);
        values.push(
          done
            .filter((o) => {
              const d = dateOf(o);
              return (
                d && d.getFullYear() === now.getFullYear() && d.getMonth() === m
              );
            })
            .reduce((s, o) => s + total(o), 0),
        );
      }
    } else if (period === "month") {
      const count = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();
      for (let day = 1; day <= count; day++) {
        labels.push(String(day));
        values.push(
          done
            .filter((o) => {
              const d = dateOf(o);
              return (
                d &&
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth() &&
                d.getDate() === day
              );
            })
            .reduce((s, o) => s + total(o), 0),
        );
      }
    } else if (period === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
        values.push(
          done
            .filter((o) => {
              const od = dateOf(o);
              return od && dayKey(od) === dayKey(d);
            })
            .reduce((s, o) => s + total(o), 0),
        );
      }
    } else {
      const map = {};
      done.forEach((o) => {
        const d = dateOf(o);
        if (d) map[dayKey(d)] = (map[dayKey(d)] || 0) + total(o);
      });
      Object.entries(map)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-14)
        .forEach(([date, value]) => {
          labels.push(date.slice(5));
          values.push(value);
        });
    }
    const svg = $("statsLineChart"),
      area = $("statsArea"),
      line = $("statsPolyline"),
      points = $("statsPoints");
    if (!svg || !area || !line || !points) return;
    const max = Math.max(...values, 1),
      base = 200,
      height = 175,
      width = 700;
    const coords = values.map((v, i) => ({
      x: values.length <= 1 ? width / 2 : (i * width) / (values.length - 1),
      y: base - (v / max) * height,
    }));
    const pointStr = coords.map((p) => `${p.x},${p.y}`).join(" ");
    line.setAttribute("points", pointStr);
    area.setAttribute(
      "points",
      coords.length ? `0,${base} ${pointStr} ${width},${base}` : "",
    );
    points.innerHTML = coords
      .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3.5"></circle>`)
      .join("");
    const maxEl = $("maxRevenueLabel"),
      midEl = $("midRevenueLabel");
    if (maxEl) maxEl.textContent = money(max);
    if (midEl) midEl.textContent = money(max / 2);
    const dateBox = $("statsDates");
    if (dateBox) {
      const step = Math.max(1, Math.ceil(labels.length / 7));
      dateBox.innerHTML = labels
        .map((label, i) =>
          i % step === 0 || i === labels.length - 1
            ? `<span>${safeLabel(label)}</span>`
            : "",
        )
        .join("");
    }
    const note = $("revenueNote");
    if (note)
      note.textContent = values.some((v) => v > 0)
        ? "Doanh thu được tính từ các đơn hoàn thành."
        : "Chưa có dữ liệu doanh thu trong khoảng thời gian này.";
  }
  function safeLabel(s) {
    return esc(s);
  }
  function renderTop(sold) {
    const box = $("topProducts");
    const arr = Object.entries(sold)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      max = Math.max(...arr.map((x) => x[1]), 1);
    box.innerHTML = arr.length
      ? arr
          .map(
            ([name, n], i) =>
              `<div class="stats-top-row"><span class="stats-rank">${i + 1}</span><div class="stats-product-name"><strong>${esc(name)}</strong><div class="stats-progress"><span style="width:${(n / max) * 100}%"></span></div></div><b>${n}</b></div>`,
          )
          .join("")
      : '<p class="empty-message">Chưa có dữ liệu sản phẩm</p>';
  }
  function renderCategories(done, products) {
    const sums = {
      "Cà phê": 0,
      Trà: 0,
      "Trà sữa": 0,
      "Nước ép": 0,
      "Đồ ăn": 0,
    };
    done.forEach((o) =>
      (o.items || []).forEach((i) => {
        const cat =
          i.category || products.find((p) => p.id === i.productId)?.category;
        if (cat in sums)
          sums[cat] += (Number(i.price) || 0) * (Number(i.quantity) || 1);
      }),
    );
    const totalRevenue = Object.values(sums).reduce((a, b) => a + b, 0);
    $("categoryRevenue").textContent = money(totalRevenue);
    const colors = ["#2878c8", "#35b784", "#9b77d8", "#f0a52f", "#ef6570"];
    const entries = Object.entries(sums);
    let start = 0;
    const slices = entries.map(([name, v], i) => {
      const end = start + (totalRevenue ? (v / totalRevenue) * 100 : 0);
      const s = `${colors[i]} ${start}% ${end}%`;
      start = end;
      return s;
    });
    $("categoryDonut").style.background = totalRevenue
      ? `conic-gradient(${slices.join(",")})`
      : "conic-gradient(#e4ebf4 0% 100%)";
    $("categoryLegend").innerHTML = entries
      .map(
        ([name, v], i) =>
          `<p><span class="legend-dot" style="background:${colors[i]}"></span><span>${name}</span><b>${money(v)}</b><small>${totalRevenue ? Math.round((v / totalRevenue) * 100) : 0}%</small></p>`,
      )
      .join("");
  }
  $("periodSelect")?.addEventListener("change", renderStats);
  window.addEventListener("storage", renderStats);
  window.addEventListener("focus", renderStats);
  window.addEventListener("hoian:datachange", renderStats);
  renderStats();
})();
