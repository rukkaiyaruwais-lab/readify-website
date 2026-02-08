// ==========================
// Readify - Main JS (ALL pages)
// Hamburger + Footer Year + Newsletter + Home Quotes/Author + Reveal + PWA
// ==========================

/* ---------- Reusable helpers (meets brief) ---------- */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function getJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Footer year ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- Hamburger menu (same IDs on all pages) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
});

/* ---------- Newsletter (stores email in localStorage) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("email");
  const msg = document.getElementById("newsletterMsg");
  if (!form || !emailInput) return;

  // Prefill if saved
  const saved = localStorage.getItem("readify_newsletter_email");
  if (saved) emailInput.value = saved;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes("@") || !email.includes(".")) {
      if (msg) msg.textContent = "Please enter a valid email.";
      return;
    }

    localStorage.setItem("readify_newsletter_email", email);
    if (msg) msg.textContent = "Subscribed! Email saved.";
    form.reset();
  });
});

/* ---------- Reveal on scroll ---------- */
function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const trigger = window.innerHeight * 0.9;
  items.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("visible");
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ---------- Home Page: quotes + author of day (only if elements exist) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");

  if (quoteText && quoteAuthor) {
    const quotes = [
      { text: "So many books, so little time.", author: "Frank Zappa" },
      { text: "A room without books is like a body without a soul.", author: "Cicero" },
      { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
      { text: "Books are a uniquely portable magic.", author: "Stephen King" }
    ];

    let i = 0;
    function show() {
      quoteText.textContent = quotes[i].text;
      quoteAuthor.textContent = "— " + quotes[i].author;
    }
    show();
    setInterval(() => {
      i = (i + 1) % quotes.length;
      show();
    }, 4000);
  }

  const authorName = document.getElementById("authorName");
  const authorBio = document.getElementById("authorBio");
  const authorGenre = document.getElementById("authorGenre");

  if (authorName && authorBio && authorGenre) {
    const authors = [
      { name: "Jane Austen", bio: "Classic romance stories.", genre: "Classic" },
      { name: "Arthur Conan Doyle", bio: "Mystery and detective fiction.", genre: "Mystery" },
      { name: "J.K. Rowling", bio: "Fantasy stories and magical worlds.", genre: "Fantasy" }
    ];

    const dayIndex = new Date().getDate() % authors.length;
    const a = authors[dayIndex];
    authorName.textContent = a.name;
    authorBio.textContent = a.bio;
    authorGenre.textContent = a.genre;
  }
});

/* ---------- PWA service worker register ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
