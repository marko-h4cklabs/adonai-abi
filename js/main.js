/* ADONAI — main.js
   Only responsibility: mobile navigation toggle.
   Smooth scrolling and scroll-padding are handled in CSS. */
(function () {
  "use strict";

  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Otvori izbornik");
  }

  function openMenu() {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Zatvori izbornik");
  }

  toggle.addEventListener("click", function () {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu after tapping a link (single-page anchors).
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  // Close on Escape for keyboard users.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
      toggle.focus();
    }
  });

  // Reset state if the viewport grows past the mobile breakpoint.
  var mq = window.matchMedia("(min-width: 860px)");
  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () {
    if (mq.matches) closeMenu();
  });
})();

/* Gallery lightbox — fullscreen viewer: prev/next (wrapping), keyboard (arrows +
   Esc), backdrop/X to close, swipe on touch, focus trap. No dependencies. */
(function () {
  "use strict";

  var gallery = document.querySelector(".gallery");
  if (!gallery) return;
  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll("img"));
  if (!thumbs.length) return;

  // Turn each thumbnail into a real, focusable button and record its full image.
  var slides = thumbs.map(function (img) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-item";
    btn.setAttribute("aria-label", "Otvori uvećano: " + (img.getAttribute("alt") || "slika galerije"));
    img.parentNode.insertBefore(btn, img);
    btn.appendChild(img);
    return { src: img.currentSrc || img.src, alt: img.getAttribute("alt") || "", btn: btn };
  });

  // Build the lightbox DOM once.
  function makeBtn(cls, label, glyph) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", label);
    b.innerHTML = glyph;
    return b;
  }

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.id = "lightbox";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Galerija — uvećani prikaz");

  var closeBtn = makeBtn("lightbox-close", "Zatvori", "&times;");
  var prevBtn = makeBtn("lightbox-nav lightbox-prev", "Prethodna slika", "&#8249;");
  var nextBtn = makeBtn("lightbox-nav lightbox-next", "Sljedeća slika", "&#8250;");

  var figure = document.createElement("figure");
  figure.className = "lightbox-figure";
  var bigImg = document.createElement("img");
  bigImg.className = "lightbox-img";
  bigImg.alt = "";
  figure.appendChild(bigImg);

  var counter = document.createElement("div");
  counter.className = "lightbox-counter";
  counter.setAttribute("aria-hidden", "true");

  overlay.appendChild(closeBtn);
  overlay.appendChild(prevBtn);
  overlay.appendChild(figure);
  overlay.appendChild(nextBtn);
  overlay.appendChild(counter);
  document.body.appendChild(overlay);

  var focusable = [closeBtn, prevBtn, nextBtn]; // in DOM order, for the focus trap
  var current = 0;
  var lastFocused = null;

  function render() {
    var s = slides[current];
    bigImg.src = s.src;
    bigImg.alt = s.alt;
    counter.textContent = (current + 1) + " / " + slides.length;
  }

  function open(index) {
    current = index;
    lastFocused = slides[index].btn;
    render();
    overlay.hidden = false;
    document.body.style.overflow = "hidden"; // lock background scroll while open
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus(); // return focus to the opening thumbnail
  }

  function go(step) {
    current = (current + step + slides.length) % slides.length; // wrap both ways
    render();
  }

  slides.forEach(function (s, i) {
    s.btn.addEventListener("click", function () { open(i); });
  });
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });

  // Click on the backdrop (outside the image and controls) closes.
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target === figure) close();
  });

  // Keyboard: arrows navigate, Esc closes, Tab stays trapped inside the dialog.
  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowLeft") {
      go(-1);
    } else if (e.key === "ArrowRight") {
      go(1);
    } else if (e.key === "Tab") {
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (focusable.indexOf(document.activeElement) === -1) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  // Touch: a horizontal swipe changes image (left = next, right = prev).
  var startX = 0, startY = 0, touching = false;
  overlay.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    touching = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener("touchend", function (e) {
    if (!touching) return;
    touching = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();
