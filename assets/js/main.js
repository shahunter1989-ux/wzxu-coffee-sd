const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const scrollTopButton = document.querySelector("#scroll-top");
const revealItems = document.querySelectorAll(".reveal");
const flowerField = document.querySelector(".flower-field");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const galleryCards = document.querySelectorAll(".gallery-card");
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
let activeGalleryTrigger = null;

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

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxTitle) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxImage.hidden = true;
  lightboxTitle.textContent = "";
  activeGalleryTrigger?.focus();
  activeGalleryTrigger = null;
};

const openLightbox = (trigger) => {
  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxClose) return;

  activeGalleryTrigger = trigger;
  lightboxImage.src = trigger.dataset.fullSrc;
  lightboxImage.alt = trigger.dataset.alt || "";
  lightboxImage.hidden = false;
  lightboxTitle.textContent = trigger.dataset.title || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
};

galleryCards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    lightboxClose?.focus();
  }
});

const flowerPalettes = [
  ["#f7b6bd", "#ffe8eb"],
  ["#fff7ef", "#f4e5d4"],
  ["#f2c8d0", "#fff1f3"],
  ["#dfc4a4", "#fff7ef"]
];

const flowerTypes = ["flower-soft", "flower-petal", "flower-blossom"];
let currentFlowerMode = "";

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const getFlowerMode = () => (window.innerWidth < 768 ? "mobile" : "desktop");

const buildFlowerField = () => {
  if (!flowerField) return;

  flowerField.innerHTML = "";

  if (reduceMotionQuery.matches) {
    currentFlowerMode = "reduced";
    return;
  }

  currentFlowerMode = getFlowerMode();
  const flowerCount = currentFlowerMode === "mobile" ? 8 : 24;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < flowerCount; index += 1) {
    const flower = document.createElement("span");
    const palette = flowerPalettes[index % flowerPalettes.length];
    const type = flowerTypes[index % flowerTypes.length];

    flower.className = `falling-flower ${type}`;
    const sizeMax = currentFlowerMode === "mobile" ? 1.14 : index % 5 === 0 ? 1.9 : 1.55;
    const sizeMin = currentFlowerMode === "mobile" ? 0.72 : index % 5 === 0 ? 1.25 : 0.82;

    flower.style.setProperty("--flower-size", `${randomBetween(sizeMin, sizeMax).toFixed(2)}rem`);
    flower.style.setProperty("--flower-x", `${randomBetween(3, 96).toFixed(2)}vw`);
    flower.style.setProperty("--flower-delay", `${randomBetween(-28, 0).toFixed(2)}s`);
    flower.style.setProperty("--flower-duration", `${randomBetween(22, currentFlowerMode === "mobile" ? 38 : 46).toFixed(2)}s`);
    flower.style.setProperty("--flower-opacity", randomBetween(0.2, currentFlowerMode === "mobile" ? 0.4 : 0.5).toFixed(2));
    flower.style.setProperty("--flower-sway", `${randomBetween(-5.25, 5.25).toFixed(2)}rem`);
    flower.style.setProperty("--flower-rotate", `${randomBetween(-45, 45).toFixed(2)}deg`);
    flower.style.setProperty("--flower-blur", `${randomBetween(0, 0.8).toFixed(2)}px`);
    flower.style.setProperty("--flower-color", palette[0]);
    flower.style.setProperty("--flower-accent", palette[1]);
    fragment.appendChild(flower);
  }

  flowerField.appendChild(fragment);
};

buildFlowerField();

window.addEventListener(
  "resize",
  () => {
    const nextMode = reduceMotionQuery.matches ? "reduced" : getFlowerMode();
    if (nextMode !== currentFlowerMode) buildFlowerField();
  },
  { passive: true }
);

reduceMotionQuery.addEventListener?.("change", buildFlowerField);
