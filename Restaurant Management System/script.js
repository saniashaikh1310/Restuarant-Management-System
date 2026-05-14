/**
 * Nexus Bite — Restaurant Management System
 * Shared frontend logic: theme, cart, menu data, toasts, nav, libraries init
 */
(function () {
  "use strict";

  const STORAGE = {
    cart: "nexusbite_cart_v1",
    theme: "nexusbite_theme_v1",
    user: "nexusbite_user_v1",
    reservations: "nexusbite_reservations_v1",
    addresses: "nexusbite_addresses_v1",
    favorites: "nexusbite_favorites_v1",
    orders: "nexusbite_orders_v1",
    loyalty: "nexusbite_loyalty_v1",
    adminMenu: "nexusbite_admin_menu_v1",
  };

  const DEFAULT_MENU = [
    {
      id: "m1",
      name: "Truffle Fire Pizza",
      price: 499,
      category: "pizza",
      veg: false,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    },
    {
      id: "m2",
      name: "Smoky BBQ Burger",
      price: 329,
      category: "burger",
      veg: false,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    },
    {
      id: "m3",
      name: "Garden Harvest Bowl",
      price: 289,
      category: "healthy",
      veg: true,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    },
    {
      id: "m4",
      name: "Velvet Paneer Tikka",
      price: 349,
      category: "indian",
      veg: true,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80",
    },
    {
      id: "m5",
      name: "Umami Ramen Bowl",
      price: 379,
      category: "asian",
      veg: false,
      rating: 4.75,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    },
    {
      id: "m6",
      name: "Midnight Choco Lava",
      price: 199,
      category: "dessert",
      veg: true,
      rating: 4.85,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    },
    {
      id: "m7",
      name: "Crisp Falafel Wrap",
      price: 249,
      category: "healthy",
      veg: true,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
    },
    {
      id: "m8",
      name: "Ocean Sushi Platter",
      price: 649,
      category: "asian",
      veg: false,
      rating: 4.95,
      image:
        "https://images.unsplash.com/photo-1579871494447-981951cf902e?w=600&q=80",
    },
  ];

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function getCart() {
    return readJSON(STORAGE.cart, []);
  }

  function setCart(items) {
    writeJSON(STORAGE.cart, items);
    window.dispatchEvent(new CustomEvent("nexusbite:cart"));
    updateCartBadges();
  }

  function updateCartBadges() {
    const n = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-flex" : "none";
    });
  }

  function addToCart(itemId, qty) {
    const menu = getMenu();
    const item = menu.find((m) => m.id === itemId);
    if (!item) return;
    const cart = getCart();
    const idx = cart.findIndex((c) => c.id === itemId);
    const q = Math.max(1, qty | 0);
    if (idx >= 0) cart[idx].qty += q;
    else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: q });
    setCart(cart);
    toast("Added to cart", "success");
  }

  function setLineQty(itemId, qty) {
    const cart = getCart();
    const line = cart.find((c) => c.id === itemId);
    if (!line) return;
    line.qty = Math.max(1, qty);
    setCart(cart);
  }

  function incLine(itemId, delta) {
    const cart = getCart();
    const line = cart.find((c) => c.id === itemId);
    if (!line) return;
    line.qty = Math.max(1, line.qty + delta);
    setCart(cart);
  }

  function removeLine(itemId) {
    setCart(getCart().filter((c) => c.id !== itemId));
    toast("Item removed", "success");
  }

  function cartTotals(couponCode) {
    const cart = getCart();
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const delivery = subtotal > 0 ? (subtotal >= 499 ? 0 : 49) : 0;
    let discount = 0;
    const code = (couponCode || "").trim().toUpperCase();
    if (code === "NEXUS20") discount = Math.round(subtotal * 0.2);
    if (code === "FIRST50") discount = Math.min(50, subtotal);
    const total = Math.max(0, subtotal + delivery - discount);
    return { subtotal, delivery, discount, total };
  }

  function getMenu() {
    const custom = readJSON(STORAGE.adminMenu, null);
    return custom && Array.isArray(custom) && custom.length ? custom : DEFAULT_MENU;
  }

  function toast(message, type) {
    const host = document.querySelector(".rms-toast-host") || createToastHost();
    const el = document.createElement("div");
    el.className = "rms-toast " + (type || "");
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(8px)";
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  function createToastHost() {
    const h = document.createElement("div");
    h.className = "rms-toast-host";
    document.body.appendChild(h);
    return h;
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE.theme, next);
        toast(next === "dark" ? "Dark mode on" : "Light mode on", "success");
      });
    });
  }

  function initNav() {
    const nav = document.querySelector(".rms-nav");
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const burger = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector(".rms-nav-links");
    const overlay = document.querySelector(".rms-nav-overlay");
    function close() {
      links && links.classList.remove("open");
      overlay && overlay.classList.remove("show");
    }
    burger &&
      burger.addEventListener("click", () => {
        links && links.classList.toggle("open");
        overlay && overlay.classList.toggle("show");
      });
    overlay && overlay.addEventListener("click", close);
    links &&
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          if (window.innerWidth <= 900) close();
        })
      );
  }

  function initPageLoader() {
    const el = document.querySelector(".rms-page-loader");
    if (!el) return;
    window.addEventListener("load", () => {
      setTimeout(() => el.classList.add("done"), 400);
    });
  }

  function initLibsHome() {
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 800, once: true, offset: 60 });
    }
    if (typeof Swiper !== "undefined") {
      document.querySelectorAll(".rms-testimonial-swiper").forEach((root) => {
        new Swiper(root, {
          loop: true,
          autoplay: { delay: 4200, disableOnInteraction: false },
          pagination: { el: root.querySelector(".swiper-pagination"), clickable: true },
          slidesPerView: 1,
          spaceBetween: 20,
          breakpoints: { 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } },
        });
      });
    }
    if (typeof Typed !== "undefined" && document.querySelector("#typed-hero")) {
      new Typed("#typed-hero", {
        strings: ["tonight.", "in minutes.", "like a pro.", "with rewards."],
        typeSpeed: 55,
        backSpeed: 40,
        backDelay: 1600,
        loop: true,
      });
    }
    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".rms-hero h1", { y: 40, opacity: 0, duration: 0.8 })
        .from(".rms-hero-lead", { y: 24, opacity: 0, duration: 0.55 }, "-=0.45")
        .from(".rms-hero-cta .rms-btn", { y: 20, opacity: 0, stagger: 0.12, duration: 0.45 }, "-=0.3")
        .from(".rms-plate", { scale: 0.85, opacity: 0, duration: 0.9, ease: "elastic.out(1,0.6)" }, "-=0.6");
      gsap.utils.toArray("[data-parallax]").forEach((layer) => {
        const depth = parseFloat(layer.getAttribute("data-parallax") || "0.15");
        window.addEventListener(
          "scroll",
          () => {
            const y = window.scrollY * depth;
            gsap.to(layer, { y, duration: 0.4, overwrite: "auto" });
          },
          { passive: true }
        );
      });
    }
  }

  function animateCounters() {
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-counter")) || 0;
      const suffix = el.getAttribute("data-counter-suffix") || "";
      const duration = 1.6;
      if (typeof gsap !== "undefined") {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            const n = Number.isInteger(target) ? Math.round(obj.v) : obj.v.toFixed(1);
            el.textContent = n + suffix;
          },
        });
      } else {
        el.textContent = target + suffix;
      }
    });
  }

  function initChatbot() {
    const launcher = document.querySelector("[data-chat-launch]");
    const panel = document.querySelector(".rms-chat-panel");
    const send = document.querySelector("[data-chat-send]");
    const input = document.querySelector("[data-chat-input]");
    if (!launcher || !panel) return;
    launcher.addEventListener("click", () => panel.classList.toggle("open"));
    const replies = [
      "I can help you track orders, suggest chef picks, or apply offers. What do you need?",
      "Try code NEXUS20 for 20% off on carts above ₹0 (demo).",
      "Our fastest delivery window right now is 22–32 minutes for your area.",
      "Popular tonight: Umami Ramen Bowl and Truffle Fire Pizza.",
    ];
    function botReply() {
      const box = panel.querySelector(".rms-chat-body");
      const m = document.createElement("div");
      m.className = "rms-chat-msg bot";
      m.textContent = replies[Math.floor(Math.random() * replies.length)];
      box.appendChild(m);
      box.scrollTop = box.scrollHeight;
    }
    send &&
      send.addEventListener("click", () => {
        const t = (input && input.value.trim()) || "";
        if (!t) return;
        const box = panel.querySelector(".rms-chat-body");
        const u = document.createElement("div");
        u.className = "rms-chat-msg user";
        u.textContent = t;
        box.appendChild(u);
        input.value = "";
        box.scrollTop = box.scrollHeight;
        setTimeout(botReply, 500);
      });
  }

  function renderMenuGrid(container, options) {
    if (!container) return;
    const { filter = "all", search = "", favorites = readJSON(STORAGE.favorites, []) } = options || {};
    const q = search.toLowerCase();
    const menu = getMenu().filter((m) => {
      if (filter !== "all" && m.category !== filter) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
    container.innerHTML = menu
      .map((m) => {
        const fav = favorites.includes(m.id);
        return `
        <article class="rms-food-card" data-id="${m.id}">
          <div class="thumb"><img src="${m.image}" alt="${m.name}" loading="lazy" /></div>
          <div class="body">
            <div class="rms-tag-row">
              <span class="rms-tag ${m.veg ? "veg" : "nonveg"}">${m.veg ? "Veg" : "Non-veg"}</span>
              <span class="rms-tag" style="background:rgba(100,210,255,.15);color:#7dd3fc">★ ${m.rating}</span>
            </div>
            <h3 class="rms-food-title">${m.name}</h3>
            <div class="rms-food-meta"><span>${m.category}</span><span class="rms-price">₹${m.price}</span></div>
            <div class="rms-card-actions">
              <div class="rms-qty" data-qty-wrap>
                <button type="button" data-qty-dec aria-label="decrease">−</button>
                <span data-qty-val>1</span>
                <button type="button" data-qty-inc aria-label="increase">+</button>
              </div>
              <button type="button" class="rms-btn rms-btn-primary rms-grow" data-add-cart>Add</button>
              <button type="button" class="rms-fav ${fav ? "on" : ""}" data-fav="${m.id}" aria-label="favorite">♥</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    container.querySelectorAll(".rms-food-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      let qty = 1;
      const val = card.querySelector("[data-qty-val]");
      card.querySelector("[data-qty-inc]").addEventListener("click", () => {
        qty++;
        val.textContent = qty;
      });
      card.querySelector("[data-qty-dec]").addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        val.textContent = qty;
      });
      card.querySelector("[data-add-cart]").addEventListener("click", () => {
        addToCart(id, qty);
        qty = 1;
        val.textContent = "1";
      });
      const fb = card.querySelector("[data-fav]");
      fb.addEventListener("click", () => {
        const favs = readJSON(STORAGE.favorites, []);
        const i = favs.indexOf(id);
        if (i >= 0) {
          favs.splice(i, 1);
          fb.classList.remove("on");
          toast("Removed from favorites", "success");
        } else {
          favs.push(id);
          fb.classList.add("on");
          toast("Saved to favorites", "success");
        }
        writeJSON(STORAGE.favorites, favs);
      });
    });
  }

  function bindMenuPage() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    const search = document.getElementById("menu-search");
    const chips = document.querySelectorAll("[data-filter]");
    let filter = "all";
    let term = "";
    function refresh() {
      renderMenuGrid(grid, { filter, search: term });
    }
    search &&
      search.addEventListener("input", () => {
        term = search.value;
        refresh();
      });
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        chips.forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        filter = c.getAttribute("data-filter") || "all";
        refresh();
      })
    );
    refresh();
  }

  function bindCartPage() {
    const list = document.getElementById("cart-list");
    const empty = document.getElementById("cart-empty");
    const panel = document.getElementById("cart-summary-panel");
    const coupon = document.getElementById("cart-coupon");
    if (!list) return;

    function render() {
      const cart = getCart();
      if (!cart.length) {
        list.innerHTML = "";
        empty && (empty.hidden = false);
        panel && (panel.hidden = true);
        return;
      }
      empty && (empty.hidden = true);
      panel && (panel.hidden = false);
      list.innerHTML = cart
        .map(
          (c) => `
        <div class="rms-cart-row" data-id="${c.id}">
          <img src="${c.image}" alt="" />
          <div class="rms-cart-info">
            <strong>${c.name}</strong>
            <div style="color:var(--text-muted);font-size:.85rem">₹${c.price} each</div>
            <div class="rms-card-actions" style="margin-top:.5rem">
              <div class="rms-qty">
                <button type="button" data-dec>−</button>
                <span>${c.qty}</span>
                <button type="button" data-inc>+</button>
              </div>
              <button type="button" class="rms-btn rms-btn-ghost" data-remove>Remove</button>
            </div>
          </div>
          <div style="font-weight:700">₹${c.price * c.qty}</div>
        </div>`
        )
        .join("");

      const totals = cartTotals(coupon && coupon.value);
      const setText = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "₹" + v;
      };
      setText("sum-sub", totals.subtotal);
      setText("sum-del", totals.delivery);
      setText("sum-dis", totals.discount);
      setText("sum-total", totals.total);

      list.querySelectorAll(".rms-cart-row").forEach((row) => {
        const id = row.getAttribute("data-id");
        row.querySelector("[data-inc]").addEventListener("click", () => incLine(id, 1));
        row.querySelector("[data-dec]").addEventListener("click", () => incLine(id, -1));
        row.querySelector("[data-remove]").addEventListener("click", () => removeLine(id));
      });
    }

    coupon && coupon.addEventListener("input", render);
    window.addEventListener("nexusbite:cart", render);
    render();
  }

  function bindCheckoutPage() {
    const form = document.getElementById("checkout-form");
    if (!form) return;
    const payOpts = form.querySelectorAll(".rms-pay-opt");
    payOpts.forEach((p) =>
      p.addEventListener("click", () => {
        payOpts.forEach((x) => x.classList.remove("active"));
        p.classList.add("active");
        form.querySelector("[name=payment]").value = p.getAttribute("data-pay");
      })
    );
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const totals = cartTotals(fd.get("coupon"));
      const order = {
        id: "NX-" + Date.now(),
        at: new Date().toISOString(),
        address: {
          line: fd.get("line"),
          city: fd.get("city"),
          pin: fd.get("pin"),
        },
        payment: fd.get("payment"),
        totals,
        items: getCart(),
      };
      const orders = readJSON(STORAGE.orders, []);
      orders.unshift(order);
      writeJSON(STORAGE.orders, orders);
      const loyalty = (readJSON(STORAGE.loyalty, 0) || 0) + Math.round(totals.total / 20);
      writeJSON(STORAGE.loyalty, loyalty);
      setCart([]);
      localStorage.setItem("nexusbite_last_order", JSON.stringify(order));
      window.location.href = "order-success.html";
    });
  }

  function bindReservationPage() {
    const form = document.getElementById("reservation-form");
    const hist = document.getElementById("reservation-history");
    if (!form) return;
    function renderHist() {
      const items = readJSON(STORAGE.reservations, []);
      if (!hist) return;
      if (!items.length) {
        hist.innerHTML = '<p style="color:var(--text-muted)">No reservations yet.</p>';
        return;
      }
      hist.innerHTML = items
        .map(
          (r) => `
        <div class="rms-glass" style="padding:1rem;margin-bottom:.6rem;border-radius:var(--radius-md)">
          <strong>${r.date}</strong> · ${r.time} · ${r.guests} guests<br/>
          <span style="color:var(--text-muted);font-size:.88rem">${r.name} — ${r.phone}</span>
        </div>`
        )
        .join("");
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const row = {
        name: fd.get("name"),
        phone: fd.get("phone"),
        guests: fd.get("guests"),
        date: fd.get("date"),
        time: fd.get("time"),
      };
      const all = readJSON(STORAGE.reservations, []);
      all.unshift(row);
      writeJSON(STORAGE.reservations, all);
      toast("Table reserved (demo)", "success");
      form.reset();
      const modal = document.getElementById("res-confirm");
      modal && modal.classList.add("show");
      renderHist();
    });
    document.querySelector("[data-close-modal]") &&
      document.querySelector("[data-close-modal]").addEventListener("click", () => {
        const m = document.getElementById("res-confirm");
        m && m.classList.remove("show");
      });
    renderHist();
  }

  function bindAuthPages() {
    document.querySelectorAll("[data-toggle-pass]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle-pass");
        const input = document.getElementById(id);
        if (!input) return;
        input.type = input.type === "password" ? "text" : "password";
      });
    });
    const loginForm = document.getElementById("login-form");
    loginForm &&
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(loginForm);
        writeJSON(STORAGE.user, { name: fd.get("email").split("@")[0] || "Guest", email: fd.get("email") });
        toast("Signed in (frontend demo)", "success");
        setTimeout(() => (window.location.href = "../index.html"), 600);
      });
    const signupForm = document.getElementById("signup-form");
    signupForm &&
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        toast("Account created (demo) — sign in", "success");
        setTimeout(() => (window.location.href = "login.html"), 700);
      });
  }

  function bindAdminPage() {
    const tbody = document.querySelector("[data-admin-orders]");
    const act = document.querySelector("[data-admin-activity]");
    const menuBody = document.querySelector("[data-admin-menu]");
    if (!tbody || !act) return;

    function render() {
      const orders = readJSON(STORAGE.orders, []);
      tbody.innerHTML = orders.length
        ? orders
            .slice(0, 8)
            .map(
              (o) => `
        <tr><td>${o.id}</td><td>${new Date(o.at).toLocaleString()}</td><td>₹${o.totals.total}</td>
        <td><select data-order-status="${o.id}">
          <option>Preparing</option><option>On the way</option><option>Delivered</option>
        </select></td></tr>`
            )
            .join("")
        : `<tr><td colspan="4" style="color:var(--text-muted)">No orders yet — place a demo checkout.</td></tr>`;

      const revenue = orders.reduce((s, o) => s + (o.totals && o.totals.total ? o.totals.total : 0), 0);
      const elRev = document.querySelector("[data-metric-revenue]");
      if (elRev) elRev.textContent = "₹" + revenue;
      const mo = document.getElementById("metric-orders");
      if (mo) mo.textContent = String(orders.length);

      act.innerHTML = orders
        .slice(0, 5)
        .map(
          (o) => `<div style="padding:.55rem 0;border-bottom:1px solid var(--border-glass);font-size:.88rem">
          <strong>${o.id}</strong> · ₹${o.totals.total}</div>`
        )
        .join("") || "<p style='color:var(--text-muted)'>No activity</p>";

      if (menuBody) {
        const menu = getMenu();
        menuBody.innerHTML = menu
          .map(
            (m) => `<tr data-mid="${m.id}"><td>${m.name}</td><td>${m.category}</td><td>₹${m.price}</td>
          <td><button type="button" class="rms-btn rms-btn-ghost" style="padding:.35rem .6rem;font-size:.78rem" data-del-menu>Delete</button></td></tr>`
          )
          .join("");
        menuBody.querySelectorAll("[data-del-menu]").forEach((btn, i) => {
          btn.addEventListener("click", () => {
            const tr = btn.closest("tr");
            const id = tr.getAttribute("data-mid");
            const next = getMenu().filter((x) => x.id !== id);
            writeJSON(STORAGE.adminMenu, next.length ? next : DEFAULT_MENU.slice(0, 4));
            toast("Menu updated", "success");
            render();
          });
        });
      }

      if (typeof gsap !== "undefined") {
        document.querySelectorAll(".rms-bar").forEach((bar, idx) => {
          const h = 40 + ((idx * 17) % 100);
          gsap.fromTo(bar, { height: 0 }, { height: h + "%", duration: 1, ease: "power2.out", delay: idx * 0.06 });
        });
      }
    }
    render();
    window.addEventListener("nexusbite:cart", render);
  }

  function bindCustomerDashboard() {
    const oh = document.getElementById("cust-orders");
    const fav = document.getElementById("cust-favs");
    const loy = document.getElementById("cust-loyalty");
    if (loy) {
      const raw = readJSON(STORAGE.loyalty, null);
      loy.textContent = raw === null || raw === undefined ? "120" : String(raw);
    }
    const orders = readJSON(STORAGE.orders, []);
    if (oh) {
      oh.innerHTML = orders.length
        ? orders
            .map(
              (o) => `<div class="rms-glass" style="padding:1rem;margin-bottom:.6rem;border-radius:var(--radius-md)">
            <strong>${o.id}</strong> · ₹${o.totals.total} · ${new Date(o.at).toLocaleString()}</div>`
            )
            .join("")
        : '<p style="color:var(--text-muted)">No orders yet. Explore the menu!</p>';
    }
    const favIds = readJSON(STORAGE.favorites, []);
    const menu = getMenu();
    if (fav) {
      const items = menu.filter((m) => favIds.includes(m.id));
      fav.innerHTML = items.length
        ? items.map((m) => `<div style="margin-bottom:.45rem">♥ ${m.name}</div>`).join("")
        : '<p style="color:var(--text-muted)">No favorites yet.</p>';
    }
  }

  window.NexusBite = {
    getCart,
    setCart,
    addToCart,
    cartTotals,
    getMenu,
    toast,
    readJSON,
    writeJSON,
    STORAGE,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initPageLoader();
    updateCartBadges();
    initChatbot();
    bindMenuPage();
    bindCartPage();
    bindCheckoutPage();
    bindReservationPage();
    bindAuthPages();
    bindAdminPage();
    bindCustomerDashboard();

    const path = window.location.pathname.split("/").pop() || "";
    if (path === "index.html" || path === "") {
      initLibsHome();
      setTimeout(animateCounters, 400);
    }
  });
})();
