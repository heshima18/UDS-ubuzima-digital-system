"use strict";
let isRtl = window.Helpers.isRtl(),
    isDarkStyle = window.Helpers.isDarkStyle(),
    menu,
    animate,
    isHorizontalLayout = !1;

document.getElementById("layout-menu") && (isHorizontalLayout = document.getElementById("layout-menu").classList.contains("menu-horizontal")),
    (function () {
        document.querySelectorAll("#layout-menu").forEach(function (e) {
            (menu = new Menu(e, {
                orientation: isHorizontalLayout ? "horizontal" : "vertical",
                closeChildren: !!isHorizontalLayout,
                showDropdownOnHover: localStorage.getItem("templateCustomizer-" + templateName + "--ShowDropdownOnHover")
                    ? "true" === localStorage.getItem("templateCustomizer-" + templateName + "--ShowDropdownOnHover")
                    : void 0 === window.templateCustomizer || window.templateCustomizer.settings.defaultShowDropdownOnHover,
            })),
                window.Helpers.scrollToActive((animate = !1)),
                (window.Helpers.mainMenu = menu);
        });
        document.querySelectorAll(".layout-menu-toggle").forEach((e) => {
            e.addEventListener("click", (e) => {
                if ((e.preventDefault(), window.Helpers.toggleCollapsed(), config.enableMenuLocalStorage && !window.Helpers.isSmallScreen()))
                    try {
                        localStorage.setItem("templateCustomizer-" + templateName + "--LayoutCollapsed", String(window.Helpers.isCollapsed()));
                    } catch (e) { }
            });
        });
        if (document.getElementById("layout-menu")) {
            var t = document.getElementById("layout-menu");
            var n = function () {
                Helpers.isSmallScreen() || document.querySelector(".layout-menu-toggle").classList.add("d-block");
            };
            let e = null;
            (t.onmouseenter = function () {
                e = Helpers.isSmallScreen() ? setTimeout(n, 0) : setTimeout(n, 300);
            }),
                (t.onmouseleave = function () {
                    document.querySelector(".layout-menu-toggle").classList.remove("d-block"), clearTimeout(e);
                });
        }
        window.Helpers.swipeIn(".drag-target", function (e) {
            window.Helpers.setCollapsed(!1);
        }),
            window.Helpers.swipeOut("#layout-menu", function (e) {
                window.Helpers.isSmallScreen() && window.Helpers.setCollapsed(!0);
            });
        let e = document.getElementsByClassName("menu-inner"),
            o = document.getElementsByClassName("menu-inner-shadow")[0];
        0 < e.length &&
            o &&
            e[0].addEventListener("ps-scroll-y", function () {
                this.querySelector(".ps__thumb-y").offsetTop ? (o.style.display = "block") : (o.style.display = "none");
            });
        t = document.querySelector(".style-switcher-toggle");

        var r = document.querySelector(".dropdown-notifications-all");
        function c(e) {
            "show.bs.collapse" == e.type || "show.bs.collapse" == e.type ? e.target.closest(".accordion-item").classList.add("active") : e.target.closest(".accordion-item").classList.remove("active");
        }
        [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (e) {
            return new bootstrap.Tooltip(e);
        });
        [].slice.call(document.querySelectorAll(".accordion")).map(function (e) {
            e.addEventListener("show.bs.collapse", c), e.addEventListener("hide.bs.collapse", c);
        });
        if (
            (isRtl && Helpers._addClass("dropdown-menu-end", document.querySelectorAll("#layout-navbar .dropdown-menu")),
                window.Helpers.setAutoUpdate(!0),
                window.Helpers.initPasswordToggle(),
                window.Helpers.initSpeechToText(),
                window.Helpers.initNavbarDropdownScrollbar(),
                window.addEventListener(
                    "resize",
                    function (e) {
                        window.innerWidth >= window.Helpers.LAYOUT_BREAKPOINT &&
                            document.querySelector(".search-input-wrapper") &&
                            (document.querySelector(".search-input-wrapper").classList.add("d-none"), (document.querySelector(".search-input").value = "")),
                            document.querySelector("[data-template^='horizontal-menu']") &&
                            setTimeout(function () {
                                window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT
                                    ? document.getElementById("layout-menu") && document.getElementById("layout-menu").classList.contains("menu-horizontal") && menu.switchMenu("vertical")
                                    : document.getElementById("layout-menu") && document.getElementById("layout-menu").classList.contains("menu-vertical") && menu.switchMenu("horizontal");
                            }, 100);
                    },
                    !0
                ),
                !isHorizontalLayout &&
                !window.Helpers.isSmallScreen() &&
                ("undefined" != typeof TemplateCustomizer && window.templateCustomizer.settings.defaultMenuCollapsed && window.Helpers.setCollapsed(!0, !1), "undefined" != typeof config) &&
                config.enableMenuLocalStorage)
        )
            try {
                null !== localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed") &&
                    "false" !== localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed") &&
                    window.Helpers.setCollapsed("true" === localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed"), !1);
            } catch (e) { }
    })()

var o = $(".select2");
o.length && o.each(function () {
    $(this).wrap('<div class="position-relative"></div>').select2({
        placeholder: "Choose...",
        dropdownParent: $(this).parent(),
    });
});

(function ($) {
    var validationForms = $(".needs-validation");
    validationForms.each(function () {
        $(this).on("submit", e => {
            e.preventDefault();
            if (this.checkValidity()) {
                console.log("Submitted!");
            } else {
                e.stopPropagation();
            }
            $(this).addClass("was-validated");
        });
    });
})(jQuery);