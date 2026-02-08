// ==========================
// Readify - Feedback JS
// Validation + localStorage
// FAQ Accordion (smooth + plus/minus)
// ==========================

const FEEDBACK_KEY = "readify_feedback_list";

const form = document.getElementById("feedbackForm");
const fbName = document.getElementById("fbName");
const fbEmail = document.getElementById("fbEmail");
const fbMsg = document.getElementById("fbMsg");

const nameErr = document.getElementById("nameErr");
const emailErr = document.getElementById("emailErr");
const msgErr = document.getElementById("msgErr");

const confirmMsg = document.getElementById("fbConfirm");
const clearBtn = document.getElementById("clearFeedbackBtn");

// Basic email check (simple + good for assignment)
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return pattern.test(email.trim());
}

function setConfirm(text, isError = false) {
  confirmMsg.textContent = text;
  confirmMsg.style.color = isError ? "#b00020" : "var(--text)";
}

function clearErrors() {
  nameErr.textContent = "";
  emailErr.textContent = "";
  msgErr.textContent = "";
}

function getFeedbackList() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFeedbackList(list) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
}

function validate() {
  clearErrors();
  setConfirm("");

  const name = fbName.value.trim();
  const email = fbEmail.value.trim();
  const message = fbMsg.value.trim();

  let ok = true;

  if (name.length < 2) {
    nameErr.textContent = "Please enter your name (at least 2 characters).";
    ok = false;
  }

  if (!isValidEmail(email)) {
    emailErr.textContent = "Please enter a valid email address.";
    ok = false;
  }

  if (message.length < 10) {
    msgErr.textContent = "Message should be at least 10 characters.";
    ok = false;
  }

  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validate()) {
    setConfirm("Please fix the errors above ❌", true);
    return;
  }

  const entry = {
    name: fbName.value.trim(),
    email: fbEmail.value.trim(),
    message: fbMsg.value.trim(),
    date: new Date().toLocaleString()
  };

  const list = getFeedbackList();
  list.unshift(entry); // newest first
  saveFeedbackList(list);

  form.reset();
  clearErrors();
  setConfirm("Thank you! Your feedback has been saved ✅");
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem(FEEDBACK_KEY);
  setConfirm("Saved feedback cleared ✅");
});

// ==========================
// FAQ Accordion
// ==========================
const questions = document.querySelectorAll(".faq-q");

questions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector(".faq-icon");

    const isOpen = btn.classList.contains("open");

    // Close all
    questions.forEach((b) => {
      b.classList.remove("open");
      b.setAttribute("aria-expanded", "false");
      const a = b.nextElementSibling;
      if (a) a.classList.remove("open");
      const i = b.querySelector(".faq-icon");
      if (i) i.textContent = "+";
    });

    // Open clicked one if it was closed
    if (!isOpen) {
      btn.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      if (answer) answer.classList.add("open");
      if (icon) icon.textContent = "–";
    }
  });
});
