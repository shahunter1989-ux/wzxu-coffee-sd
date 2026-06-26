const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const scrollTopButton = document.querySelector("#scroll-top");
const revealItems = document.querySelectorAll(".reveal");

document.documentElement.classList.add("animations-ready");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu?.classList.toggle("hidden", isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu.classList.add("hidden");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  revealObserver.observe(item);
});

const updateScrollTop = () => {
  scrollTopButton?.classList.toggle("visible", window.scrollY > 640);
};

window.addEventListener("scroll", updateScrollTop, { passive: true });
updateScrollTop();

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
