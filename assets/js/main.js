document.addEventListener("DOMContentLoaded", () => {
  // Current year
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Google Maps consent gate
  const mapConsent = document.getElementById("map-consent");
  if (mapConsent) {
    const loadMap = () => {
      const src = mapConsent.dataset.mapSrc;
      const title = mapConsent.dataset.mapTitle;
      const iframe = document.createElement("iframe");
      iframe.className = "map-frame";
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = src;
      mapConsent.replaceWith(iframe);
      try { localStorage.setItem("maps-consent", "1"); } catch (_) {}
    };

    if (localStorage.getItem("maps-consent") === "1") {
      loadMap();
    } else {
      mapConsent.querySelector(".map-consent-btn").addEventListener("click", loadMap);
    }
  }

  // Mobile nav toggle
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      mobileNav.classList.toggle("open");
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (
        mobileNav.classList.contains("open") &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
      }
    });
  }

  // Active nav link via IntersectionObserver
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(
    ".site-nav a[href^='#'], .mobile-nav a[href^='#']"
  );

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
