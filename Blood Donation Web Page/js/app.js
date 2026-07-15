// Main Application Module
const App = {
  init() {
    this.handleLoading();
    this.initMobileMenu();
    this.initCsrfProtection();
    this.initSmoothScroll();
    this.initBackToTop();
    this.initScrollReveal();
    this.initFAQ();

    // Initialize all modules when present
    if (typeof DarkMode !== "undefined") {
      DarkMode.init();
    }

    if (typeof Language !== "undefined") {
      Language.init();
    }

    if (typeof Counter !== "undefined") {
      Counter.init();
    }

    // Check for compatibility checker on page
    if (
      document.getElementById("check-compatibility") &&
      typeof CompatibilityChecker !== "undefined"
    ) {
      CompatibilityChecker.init();
    }

    // Check for search functionality
    if (
      document.getElementById("donor-search") &&
      typeof Search !== "undefined"
    ) {
      Search.init();
    }

    // Check for forms that need validation
    if (typeof Validation !== "undefined") {
      const forms = document.querySelectorAll("form[data-validate]");
      forms.forEach((form) => {
        Validation.init(form.id);
      });
    }
  },

  handleLoading() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
          loadingScreen.classList.add("hidden");
        }
      }, 500);
    });
  },

  initMobileMenu() {
    const menuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuButton || !mobileMenu) return;

    const closeMenu = () => {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      mobileMenu.classList.remove("hidden");
      menuButton.setAttribute("aria-expanded", "true");
      const firstFocusable = mobileMenu.querySelector(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (firstFocusable) firstFocusable.focus();
    };

    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });

    mobileMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        closeMenu();
      }
    });
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  },

  initCsrfProtection() {
    const forms = document.querySelectorAll("form");
    if (!forms.length) return;

    let token = sessionStorage.getItem("csrfToken");
    if (!token) {
      token = `csrf-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("csrfToken", token);
    }

    forms.forEach((form) => {
      if (!form.querySelector('input[name="csrf_token"]')) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "csrf_token";
        input.value = token;
        form.appendChild(input);
      }
    });
  },

  initBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  },

  initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    reveals.forEach((reveal) => {
      observer.observe(reveal);
    });
  },

  initFAQ() {
    const faqButtons = document.querySelectorAll(".faq-button");

    faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector("svg");
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        // Close all other FAQs
        faqButtons.forEach((otherButton) => {
          if (otherButton !== button) {
            otherButton.setAttribute("aria-expanded", "false");
            otherButton.nextElementSibling.classList.add("hidden");
            otherButton.querySelector("svg").style.transform = "rotate(0deg)";
          }
        });

        // Toggle current FAQ
        button.setAttribute("aria-expanded", !isExpanded);
        content.classList.toggle("hidden");
        icon.style.transform = isExpanded ? "rotate(0deg)" : "rotate(180deg)";
      });
    });
  },

  showToast(message, type = "success") {
    if (typeof Toast !== "undefined") {
      Toast.show(message, type);
      return;
    }

    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Export for use in other modules
window.App = App;
