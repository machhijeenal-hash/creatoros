/* =========================================================================
   Cadbury — design study
   Vanilla JS: carousel, product filter, basket, search, countdown, reveals
   ========================================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const money = (n) => `£${n.toFixed(2)}`;
  const isTextField = (el) =>
    typeof Element !== "undefined" &&
    el instanceof Element &&
    el.matches("input, textarea, select, [contenteditable='true']");
  const mq = (query) =>
    typeof window.matchMedia === "function"
      ? window.matchMedia(query)
      : { matches: false, addEventListener() {} };

  /* ---------------------------------------------------------------- data */
  const PRODUCTS = [
    {
      id: "dairy-milk",
      name: "Dairy Milk",
      kicker: "The original",
      price: 2.5,
      size: "180g bar",
      img: "img/prod-dairymilk.jpg",
      cats: ["bars"],
      alt: "Cadbury Dairy Milk style chocolate bar on purple foil",
    },
    {
      id: "fruit-nut",
      name: "Dairy Milk Fruit & Nut",
      kicker: "Almonds & raisins",
      price: 2.5,
      size: "200g bar",
      img: "img/prod-fruitnut.jpg",
      cats: ["bars"],
      alt: "Milk chocolate bar with almonds and raisins",
    },
    {
      id: "caramel",
      name: "Dairy Milk Caramel",
      kicker: "Golden centre",
      price: 1.65,
      size: "120g bar",
      img: "img/prod-caramel.jpg",
      cats: ["bars"],
      alt: "Milk chocolate bar with a caramel centre",
    },
    {
      id: "oreo",
      name: "Dairy Milk Oreo",
      kicker: "Cookie crunch",
      price: 1.35,
      size: "95g bar",
      img: "img/prod-oreo.jpg",
      cats: ["bars", "new"],
      badge: "new",
      alt: "Milk chocolate with crushed chocolate cookies",
    },
    {
      id: "twirl-golden",
      name: "Twirl Golden Dipped",
      kicker: "Limited edition",
      price: 0.85,
      size: "43g bar",
      img: "img/prod-twirl.jpg",
      cats: ["bars", "new"],
      badge: "ltd",
      alt: "Two swirled chocolate fingers",
    },
    {
      id: "wispa-multipack",
      name: "Wispa Multipack",
      kicker: "Bubbly sharing",
      price: 2.25,
      size: "4 × 27g",
      img: "img/prod-wispa.jpg",
      cats: ["sharing"],
      alt: "Aerated milk chocolate bar with a bubbly texture",
    },
    {
      id: "gift-box",
      name: "The Chocolate Gift Box",
      kicker: "Hand-tied ribbon",
      price: 22,
      size: "620g",
      img: "img/shop.jpg",
      cats: ["gifting"],
      alt: "Chocolate gift box with ribbon",
    },
    {
      id: "chunk-selection",
      name: "Chocolate Chunk Selection",
      kicker: "For the table",
      price: 14,
      size: "400g",
      img: "img/hero-1.jpg",
      cats: ["gifting", "sharing"],
      alt: "Selection of chocolate chunks on linen",
    },
  ];

  const ELSEWHERE = [
    { name: "Caramel Crispies recipe", meta: "Recipes · 10 mins", href: "#recipes", img: "img/hero-1.jpg" },
    { name: "Cheryl's Tiffin Cake", meta: "Recipes · 15 mins", href: "#recipes", img: "img/hero-1.jpg" },
    { name: "200 years of Cadbury", meta: "Our story", href: "#heritage", img: "img/hero-2.jpg" },
    { name: "Giveaway Give Away", meta: "Competition", href: "#giveaway", img: "img/hero-3.jpg" },
    { name: "The Cadbury chocolate shop", meta: "Gifting", href: "#shop", img: "img/shop.jpg" },
  ];

  /* --------------------------------------------------------------- toast */
  const toastStack = $("#toastStack");
  function toast(message, icon = "i-check") {
    if (!toastStack) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<svg class="ico"><use href="#${icon}" /></svg><span></span>`;
    el.querySelector("span").textContent = message;
    toastStack.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    }, 2600);
  }

  /* ------------------------------------------------------------- header */
  const header = $("#siteHeader");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-stuck", y > 12);
    if (toTop) toTop.hidden = y < 700;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const announce = $("#announce");
  $("#announceClose")?.addEventListener("click", () => {
    announce?.classList.add("is-hidden");
    try {
      sessionStorage.setItem("cadbury-announce", "1");
    } catch (_) {}
  });
  try {
    if (sessionStorage.getItem("cadbury-announce") === "1") announce?.classList.add("is-hidden");
  } catch (_) {}

  /* --------------------------------------------------------- mega menus */
  const dropdowns = $$("[data-dropdown]");
  const closeDropdowns = (except) => {
    dropdowns.forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-open");
      item.querySelector(".nav__link")?.setAttribute("aria-expanded", "false");
    });
  };
  dropdowns.forEach((item) => {
    const trigger = item.querySelector(".nav__link");
    trigger?.addEventListener("click", (e) => {
      e.preventDefault();
      const open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      closeDropdowns(open ? item : null);
      if (open) trigger.setAttribute("aria-expanded", "true");
    });
    item.addEventListener("mouseenter", () => {
      if (mq("(min-width: 1025px)").matches) {
        closeDropdowns(item);
        item.classList.add("is-open");
        trigger?.setAttribute("aria-expanded", "true");
      }
    });
    item.addEventListener("mouseleave", () => {
      if (mq("(min-width: 1025px)").matches) {
        item.classList.remove("is-open");
        trigger?.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeDropdowns();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdowns();
  });

  /* --------------------------------------------------------- mobile nav */
  const mobileNav = $("#mobileNav");
  const scrim = $("#scrim");
  const menuBtn = $("#menuBtn");
  const setScrim = (on) => {
    if (!scrim) return;
    scrim.hidden = !on;
    requestAnimationFrame(() => scrim.classList.toggle("is-visible", on));
  };
  const openMobile = (on) => {
    mobileNav?.classList.toggle("is-open", on);
    mobileNav?.setAttribute("aria-hidden", String(!on));
    if (mobileNav) mobileNav.inert = !on;
    menuBtn?.setAttribute("aria-expanded", String(on));
    document.body.classList.toggle("is-locked", on);
    setScrim(on);
  };
  menuBtn?.addEventListener("click", () => openMobile(true));
  $("#mobileClose")?.addEventListener("click", () => openMobile(false));
  scrim?.addEventListener("click", () => openMobile(false));
  $$(".m-nav a").forEach((a) => a.addEventListener("click", () => openMobile(false)));
  $$(".m-nav__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ----------------------------------------------------------- carousel */
  const slides = $$(".slide");
  const dots = $$(".dot");
  const progress = $("#heroProgress");
  const hero = $("#hero");
  let index = 0;
  let timer = null;
  let elapsed = 0;
  const DURATION = 7000;
  const TICK = 60;
  const reduceMotion = mq("(prefers-reduced-motion: reduce)");
  let playing = !reduceMotion.matches;

  function showSlide(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
    });
    elapsed = 0;
    if (progress) progress.style.width = "0%";
  }

  function startTimer() {
    stopTimer();
    if (!playing) return;
    timer = setInterval(() => {
      elapsed += TICK;
      if (progress) progress.style.width = `${Math.min(100, (elapsed / DURATION) * 100)}%`;
      if (elapsed >= DURATION) showSlide(index + 1);
    }, TICK);
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  $("#nextSlide")?.addEventListener("click", () => {
    showSlide(index + 1);
    startTimer();
  });
  $("#prevSlide")?.addEventListener("click", () => {
    showSlide(index - 1);
    startTimer();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.goto));
      startTimer();
    });
  });
  hero?.addEventListener("mouseenter", stopTimer);
  hero?.addEventListener("mouseleave", startTimer);
  hero?.addEventListener("focusin", stopTimer);
  hero?.addEventListener("focusout", startTimer);
  document.addEventListener("keydown", (e) => {
    if (isTextField(e.target)) return;
    if (document.body.classList.contains("is-locked")) return;
    const heroVisible = hero ? window.scrollY < hero.offsetHeight : false;
    if (!heroVisible) return;
    if (e.key === "ArrowRight") {
      showSlide(index + 1);
      startTimer();
    }
    if (e.key === "ArrowLeft") {
      showSlide(index - 1);
      startTimer();
    }
  });
  startTimer();

  reduceMotion.addEventListener?.("change", (e) => {
    playing = !e.matches;
    if (playing) startTimer();
    else stopTimer();
  });

  /* ----------------------------------------------------------- products */
  const grid = $("#productGrid");
  const emptyMsg = $("#productsEmpty");

  function badgeMarkup(badge) {
    if (badge === "new") return '<span class="badge badge--new">New</span>';
    if (badge === "ltd") return '<span class="badge badge--ltd">Limited</span>';
    return "";
  }

  function renderProducts() {
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(
      (p) => `
      <article class="card" data-cats="${p.cats.join(" ")}">
        <div class="card__media">
          <img src="${p.img}" alt="${p.alt}" loading="lazy" width="560" height="476" />
          <div class="card__badges">${badgeMarkup(p.badge)}</div>
          <button class="card__add" data-add="${p.id}" aria-label="Add ${p.name} to basket">
            <svg class="ico"><use href="#i-plus" /></svg>
          </button>
        </div>
        <div class="card__body">
          <p class="card__kicker">${p.kicker}</p>
          <h3 class="card__name">${p.name}</h3>
          <div class="card__meta">
            <span class="card__price">${money(p.price)}</span>
            <span class="card__size">${p.size}</span>
          </div>
        </div>
      </article>`
    ).join("");
  }
  renderProducts();

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      const filter = chip.dataset.filter;
      let shown = 0;
      $$(".card", grid).forEach((card) => {
        const cats = (card.dataset.cats || "").split(" ");
        const match = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    });
  });

  /* ------------------------------------------------------------- basket */
  const bag = new Map();
  const FREE_DELIVERY = 30;
  const bagDrawer = $("#bagDrawer");
  const bagList = $("#bagList");
  const bagEmpty = $("#bagEmpty");
  const bagTotal = $("#bagTotal");
  const bagNote = $("#bagNote");
  const bagCount = $("#bagCount");

  const basketTotal = () =>
    Array.from(bag.values()).reduce((sum, item) => sum + item.price * item.qty, 0);
  const basketQty = () => Array.from(bag.values()).reduce((sum, item) => sum + item.qty, 0);

  function renderBag() {
    if (!bagList) return;
    if (bag.size === 0) {
      bagList.innerHTML = "";
      if (bagEmpty) bagEmpty.hidden = false;
    } else {
      if (bagEmpty) bagEmpty.hidden = true;
      bagList.innerHTML = Array.from(bag.values())
        .map(
          (item) => `
        <li>
          <img src="${item.img}" alt="" />
          <div>
            <strong>${item.name}</strong>
            <span class="bag-price">${money(item.price)} · ${item.size}</span>
            <div class="qty">
              <button data-qty="-1" data-id="${item.id}" aria-label="Remove one ${item.name}">
                <svg class="ico"><use href="#i-minus" /></svg>
              </button>
              <span>${item.qty}</span>
              <button data-qty="1" data-id="${item.id}" aria-label="Add one more ${item.name}">
                <svg class="ico"><use href="#i-plus" /></svg>
              </button>
            </div>
          </div>
          <button class="bag-remove" data-remove="${item.id}" aria-label="Remove ${item.name} from basket">
            <svg class="ico"><use href="#i-close" /></svg>
          </button>
        </li>`
        )
        .join("");
    }

    const total = basketTotal();
    if (bagTotal) bagTotal.textContent = money(total);
    if (bagNote) {
      const left = FREE_DELIVERY - total;
      bagNote.textContent =
        left > 0 ? `Add ${money(left)} more for free delivery.` : "Free delivery unlocked — nice one.";
    }
    const qty = basketQty();
    if (bagCount) {
      bagCount.textContent = String(qty);
      bagCount.hidden = qty === 0;
    }
  }

  function addToBag(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const existing = bag.get(id);
    if (existing) existing.qty += 1;
    else bag.set(id, { ...product, qty: 1 });
    renderBag();
    toast(`${product.name} added to your basket`);
  }

  $$("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => addToBag(btn.dataset.add))
  );

  document.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      const item = bag.get(qtyBtn.dataset.id);
      if (!item) return;
      item.qty += Number(qtyBtn.dataset.qty);
      if (item.qty <= 0) bag.delete(item.id);
      renderBag();
      return;
    }
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      const item = bag.get(removeBtn.dataset.remove);
      bag.delete(removeBtn.dataset.remove);
      renderBag();
      if (item) toast(`${item.name} removed`);
    }
  });

  const openBag = (on) => {
    bagDrawer?.classList.toggle("is-open", on);
    bagDrawer?.setAttribute("aria-hidden", String(!on));
    if (bagDrawer) bagDrawer.inert = !on;
    $("#bagBtn")?.setAttribute("aria-expanded", String(on));
    document.body.classList.toggle("is-locked", on);
    if (on) bagDrawer.querySelector(".icon-btn")?.focus();
  };
  $("#bagBtn")?.addEventListener("click", () => openBag(true));
  $("#bagClose")?.addEventListener("click", () => openBag(false));
  bagDrawer?.addEventListener("click", (e) => {
    if (e.target === bagDrawer) openBag(false);
  });
  $("#checkoutBtn")?.addEventListener("click", () => {
    if (bag.size === 0) return toast("Your basket is empty — add a bar first", "i-bag");
    openBag(false);
    toast("This is a design demo — no payment taken", "i-bag");
  });
  renderBag();

  /* ------------------------------------------------------------- search */
  const searchOverlay = $("#search");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");

  function runSearch(term) {
    if (!searchResults) return;
    const q = term.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = "";
      return;
    }
    const productHits = PRODUCTS.filter(
      (p) => `${p.name} ${p.kicker}`.toLowerCase().includes(q)
    ).map((p) => ({ name: p.name, meta: `${p.kicker} · ${money(p.price)}`, href: "#products", img: p.img }));
    const otherHits = ELSEWHERE.filter((e) => `${e.name} ${e.meta}`.toLowerCase().includes(q));
    const hits = [...productHits, ...otherHits].slice(0, 6);

    searchResults.innerHTML = hits.length
      ? hits
          .map(
            (h) => `<li><a href="${h.href}">
              <img src="${h.img}" alt="" />
              <span><strong>${h.name}</strong><small>${h.meta}</small></span>
            </a></li>`
          )
          .join("")
      : `<li class="search__none">Nothing matched “${term}”. Try “Dairy Milk” or “gifting”.</li>`;
  }

  const openSearch = (on) => {
    searchOverlay?.classList.toggle("is-open", on);
    searchOverlay?.setAttribute("aria-hidden", String(!on));
    if (searchOverlay) searchOverlay.inert = !on;
    $("#searchBtn")?.setAttribute("aria-expanded", String(on));
    document.body.classList.toggle("is-locked", on);
    if (on) setTimeout(() => searchInput?.focus(), 120);
  };
  $("#searchBtn")?.addEventListener("click", () => openSearch(true));
  $("#searchClose")?.addEventListener("click", () => openSearch(false));
  searchOverlay?.addEventListener("click", (e) => {
    if (e.target === searchOverlay) openSearch(false);
  });
  searchInput?.addEventListener("input", (e) => runSearch(e.target.value));
  $$("[data-term]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = btn.dataset.term;
        runSearch(btn.dataset.term);
        searchInput.focus();
      }
    })
  );
  searchResults?.addEventListener("click", (e) => {
    if (e.target.closest("a")) openSearch(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      openSearch(false);
      openBag(false);
      openMobile(false);
      $("#cookieModal")?.classList.remove("is-open");
    }
    if (e.key === "/" && !isTextField(e.target)) {
      e.preventDefault();
      openSearch(true);
    }
  });

  /* ---------------------------------------------------------- countdown */
  const target = new Date("2027-04-04T23:59:00+01:00").getTime();
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");
  function tick() {
    const diff = target - Date.now();
    const secs = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if ($("#cdDays")) $("#cdDays").textContent = pad(days);
    if ($("#cdHours")) $("#cdHours").textContent = pad(hours);
    if ($("#cdMins")) $("#cdMins").textContent = pad(mins);
    if ($("#cdSecs")) $("#cdSecs").textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* --------------------------------------------------------- newsletter */
  const form = $("#signupForm");
  const email = $("#email");
  const error = $("#signupError");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = (email?.value || "").trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!valid) {
      if (error) {
        error.hidden = false;
        error.textContent = value
          ? "That email doesn’t look quite right — mind checking it?"
          : "Pop your email in and we’ll send the good stuff.";
      }
      email?.focus();
      email?.setAttribute("aria-invalid", "true");
      return;
    }
    if (error) error.hidden = true;
    email?.removeAttribute("aria-invalid");
    form.classList.add("is-success");
    toast("You’re in — treat your inbox coming soon");
    if (email) email.value = "";
    setTimeout(() => form.classList.remove("is-success"), 4000);
  });

  /* ------------------------------------------------------- cookie modal */
  const cookieModal = $("#cookieModal");
  const setCookieModal = (on) => {
    cookieModal?.classList.toggle("is-open", on);
    cookieModal?.setAttribute("aria-hidden", String(!on));
    if (cookieModal) cookieModal.inert = !on;
    document.body.classList.toggle("is-locked", on);
  };
  $("#cookieBtn")?.addEventListener("click", () => setCookieModal(true));
  $("#cookieSave")?.addEventListener("click", () => {
    setCookieModal(false);
    toast("Cookie preferences saved");
  });
  $("#cookieAccept")?.addEventListener("click", () => {
    setCookieModal(false);
    toast("All cookies accepted");
  });
  cookieModal?.addEventListener("click", (e) => {
    if (e.target === cookieModal) setCookieModal(false);
  });

  /* ------------------------------------------------------------- reveals */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------- year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
