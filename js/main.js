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
