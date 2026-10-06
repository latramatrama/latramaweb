/* ==========================================================================
   LA TRAMA · comportamiento de la interfaz
   Cabecera · Menú móvil · Slider · Reveal · Acordeón · Filtros · Formularios
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- Cabecera */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
      ticking = false;
    };

    update();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------ Menú móvil */
  function initMobileMenu() {
    const header = $(".site-header");
    const burger = $(".burger");
    const menu = $("#mobile-menu");
    if (!header || !burger || !menu) return;

    const open = (state) => {
      header.classList.toggle("is-open", state);
      menu.classList.toggle("is-open", state);
      document.body.classList.toggle("is-locked", state);
      burger.setAttribute("aria-expanded", String(state));
      menu.setAttribute("aria-hidden", String(!state));
      if (state) {
        const first = $(".mobile-menu__link", menu);
        if (first) setTimeout(() => first.focus(), 120);
      }
    };

    burger.addEventListener("click", () => open(!menu.classList.contains("is-open")));
    $$(".mobile-menu__link, .mobile-menu a", menu).forEach((a) =>
      a.addEventListener("click", () => open(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        open(false);
        burger.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 940 && menu.classList.contains("is-open")) open(false);
    });
  }

  /* ----------------------------------------------------------------- Slider */
  function initSlider() {
    const hero = $("[data-slider]");
    if (!hero) return;

    const media = $$(".hero__slide", hero);
    const panels = $$(".hero__panel", hero);
    const dots = $$(".hero__dot", hero);
    const counter = $("[data-slider-counter]", hero);
    const prev = $("[data-slider-prev]", hero);
    const next = $("[data-slider-next]", hero);
    if (!media.length) return;

    let index = 0;
    let timer = null;
    const DURATION = 6400;

    const render = (i) => {
      index = (i + media.length) % media.length;

      media.forEach((el, n) => el.classList.toggle("is-active", n === index));
      panels.forEach((el, n) => {
        const on = n === index;
        // reinicia la animación de entrada
        if (on) {
          el.classList.remove("is-active");
          void el.offsetWidth;
        }
        el.classList.toggle("is-active", on);
      });
      dots.forEach((el, n) => el.setAttribute("aria-selected", String(n === index)));
      if (counter) counter.innerHTML = "<b>0" + (index + 1) + "</b> / 0" + media.length;
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      hero.classList.add("is-paused");
    };

    const start = () => {
      if (reduced) return;
      stop();
      hero.classList.remove("is-paused");
      timer = setInterval(() => render(index + 1), DURATION);
    };

    const go = (i) => {
      render(i);
      start();
    };

    prev && prev.addEventListener("click", () => go(index - 1));
    next && next.addEventListener("click", () => go(index + 1));
    dots.forEach((dot, n) => dot.addEventListener("click", () => go(n)));

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", start);

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    // táctil: deslizar
    let x0 = null;
    hero.addEventListener(
      "touchstart",
      (e) => {
        x0 = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    hero.addEventListener(
      "touchend",
      (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 55) go(dx < 0 ? index + 1 : index - 1);
        x0 = null;
      },
      { passive: true }
    );

    render(0);
    start();
  }

  /* ------------------------------------------------------- Aparición scroll */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // retardo escalonado dentro de un mismo grupo
    $$("[data-reveal-group]").forEach((group) => {
      $$("[data-reveal]", group).forEach((el, i) => {
        if (!el.style.getPropertyValue("--d")) {
          el.style.setProperty("--d", Math.min(i * 90, 450) + "ms");
        }
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------- Acordeón */
  function initAccordion() {
    $$(".acc-item").forEach((item) => {
      const btn = $(".acc-btn", item);
      const panel = $(".acc-panel", item);
      if (!btn || !panel) return;

      const setOpen = (state) => {
        item.classList.toggle("is-open", state);
        btn.setAttribute("aria-expanded", String(state));
        panel.style.maxHeight = state ? panel.scrollHeight + "px" : "0px";
      };

      btn.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        // cerrar los hermanos
        const group = item.closest("[data-accordion]");
        if (group && willOpen) {
          $$(".acc-item.is-open", group).forEach((other) => {
            if (other !== item) {
              other.classList.remove("is-open");
              const b = $(".acc-btn", other);
              const p = $(".acc-panel", other);
              if (b) b.setAttribute("aria-expanded", "false");
              if (p) p.style.maxHeight = "0px";
            }
          });
        }
        setOpen(willOpen);
      });

      setOpen(item.classList.contains("is-open"));
    });

    window.addEventListener("resize", () => {
      $$(".acc-item.is-open .acc-panel").forEach((p) => {
        p.style.maxHeight = p.scrollHeight + "px";
      });
    });
  }

  /* ------------------------------------------------------------ Filtros */
  function initFilters() {
    const wrap = $("[data-filter-wrap]");
    if (!wrap) return;

    const buttons = $$("[data-filter]", wrap);
    const items = $$("[data-cat]", wrap);
    const count = $("[data-filter-count]");
    const empty = $("[data-filter-empty]");

    const apply = (value) => {
      let visible = 0;
      items.forEach((item) => {
        const match = value === "all" || item.getAttribute("data-cat") === value;
        item.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });
      buttons.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-filter") === value));
      if (count) count.textContent = visible + " " + (window.LaTrama ? window.LaTrama.t("agenda.count") : "");
      if (empty) empty.style.display = visible ? "none" : "block";
    };

    buttons.forEach((b) => b.addEventListener("click", () => apply(b.getAttribute("data-filter"))));
    document.addEventListener("latrama:lang", () => {
      const active = buttons.find((b) => b.classList.contains("is-active"));
      apply(active ? active.getAttribute("data-filter") : "all");
    });
    apply("all");
  }

  /* ---------------------------------------------------------- Formulario */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const status = $("[data-form-status]", form);
    const t = (k) => (window.LaTrama ? window.LaTrama.t(k) : "");

    const setError = (field, msgKey) => {
      const wrap = field.closest(".field") || field.closest(".checkbox-field");
      if (!wrap) return;
      wrap.classList.add("has-error");
      const err = $(".field__error", wrap);
      if (err) err.textContent = t(msgKey);
    };

    const clear = (field) => {
      const wrap = field.closest(".field") || field.closest(".checkbox-field");
      if (wrap) wrap.classList.remove("has-error");
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const name = $("#f-name", form);
      const email = $("#f-email", form);
      const msg = $("#f-msg", form);
      const privacy = $("#f-privacy", form);

      [name, email, msg].forEach((f) => f && clear(f));
      const pw = privacy ? privacy.closest(".field") : null;
      if (pw) pw.classList.remove("has-error");

      if (!name.value.trim()) { setError(name, "contact.form.req"); valid = false; }
      if (!isEmail(email.value)) { setError(email, "contact.form.err.email"); valid = false; }
      if (msg.value.trim().length < 12) { setError(msg, "contact.form.err.msg"); valid = false; }
      if (privacy && !privacy.checked) { setError(privacy, "contact.form.err.privacy"); valid = false; }

      if (!valid) {
        status.className = "form-status is-visible is-err";
        status.textContent = t("contact.form.err");
        const firstErr = $(".has-error input, .has-error textarea", form);
        if (firstErr) firstErr.focus();
        return;
      }

      status.className = "form-status is-visible is-ok";
      status.textContent = t("contact.form.ok");
      form.reset();
      status.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    });

    $$("input, textarea, select", form).forEach((f) => {
      f.addEventListener("input", () => clear(f));
      f.addEventListener("change", () => clear(f));
    });
  }

  /* ---------------------------------------------------------- Boletín */
  function initNewsletter() {
    const form = $("[data-newsletter]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", form);
      const ok = input && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim());
      const note = $("[data-newsletter-note]", form.parentElement) || $("[data-newsletter-note]");
      if (!ok) {
        input.focus();
        input.style.borderColor = "#ffb4a2";
        return;
      }
      input.style.borderColor = "";
      if (note) {
        note.textContent = window.LaTrama ? window.LaTrama.t("news.nl.ok") : "";
        note.style.display = "block";
      }
      form.reset();
    });
  }

  /* -------------------------------------------------------------- init */
  function init() {
    initHeader();
    initMobileMenu();
    initSlider();
    initReveal();
    initAccordion();
    initFilters();
    initContactForm();
    initNewsletter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
