"use strict";

(function () {
  function closeMenu(nav) {
    nav.classList.remove("is-open");
    var toggle = nav.querySelector(".lang-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function closeAllMenus(exceptNav) {
    var openMenus = document.querySelectorAll(".lang-nav.is-dropdown.is-open");
    for (var i = 0; i < openMenus.length; i += 1) {
      if (openMenus[i] !== exceptNav) closeMenu(openMenus[i]);
    }
  }

  function enhanceNav(nav) {
    if (nav.dataset.dropdownEnhanced === "1") return;

    var items = nav.querySelectorAll("a.lang-item");
    if (!items.length) return;

    var currentPage = window.location.pathname.split("/").pop();
    if (currentPage && currentPage !== "index.html") {
      for (var linkIndex = 0; linkIndex < items.length; linkIndex += 1) {
        var href = items[linkIndex].getAttribute("href");
        if (href && href.slice(-1) === "/") items[linkIndex].setAttribute("href", href + currentPage);
      }
    }

    var active = nav.querySelector("a.lang-item.is-active") || items[0];

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "lang-toggle";
    toggle.setAttribute("aria-haspopup", "menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", nav.getAttribute("aria-label") || "Select language");
    toggle.innerHTML =
      '<span class="lang-toggle-main"></span><span class="lang-caret" aria-hidden="true">\u25be</span>';
    var toggleMain = toggle.querySelector(".lang-toggle-main");
    toggleMain.innerHTML = active.innerHTML;

    var list = document.createElement("div");
    list.className = "lang-list";
    list.setAttribute("role", "menu");

    while (nav.firstChild) {
      nav.removeChild(nav.firstChild);
    }

    nav.appendChild(toggle);
    nav.appendChild(list);

    for (var i = 0; i < items.length; i += 1) {
      items[i].setAttribute("role", "menuitem");
      list.appendChild(items[i]);
    }

    nav.classList.add("is-dropdown");
    nav.dataset.dropdownEnhanced = "1";

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var willOpen = !nav.classList.contains("is-open");
      closeAllMenus(nav);
      if (willOpen) {
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        closeMenu(nav);
      }
    });

    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu(nav);
    });
  }

  var navs = document.querySelectorAll(".lang-nav");
  for (var i = 0; i < navs.length; i += 1) {
    enhanceNav(navs[i]);
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".lang-nav.is-dropdown")) closeAllMenus(null);
  });
})();
