// ==========================
// Readify - nav.js
// Hamburger menu toggle (mobile)
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
    const open = nav.classList.contains("nav-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close menu after clicking a link (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
});
