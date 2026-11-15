// Hariom Gardening — interactions

// Mobile nav
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close mobile menu when a link is clicked
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  })
);

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const setActiveOnScroll = () => {
  let currentId = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) currentId = section.id;
  });
  navLinks.forEach((link) =>
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`)
  );
};
window.addEventListener("scroll", setActiveOnScroll, { passive: true });
setActiveOnScroll();

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Counter animation in hero stats
const counters = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1500;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((el) => countObserver.observe(el));

// Contact form validation
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccess");

const validators = {
  name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? ""
      : "Please enter a valid email address.",
  service: (v) => (v ? "" : "Please select a service."),
  message: (v) => (v.trim().length >= 10 ? "" : "Message should be at least 10 characters."),
};

const showError = (field, message) => {
  const errorEl = document.querySelector(`[data-error-for="${field.name}"]`);
  field.classList.toggle("invalid", Boolean(message));
  if (errorEl) errorEl.textContent = message;
};

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("blur", () => {
    if (validators[field.name]) showError(field, validators[field.name](field.value));
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    if (!validators[field.name]) return;
    const message = validators[field.name](field.value);
    if (message) isValid = false;
    showError(field, message);
  });

  if (!isValid) return;

  successMessage.hidden = false;
  form.reset();
  setTimeout(() => (successMessage.hidden = true), 6000);
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
