// Newsletter localStorage (reusable across pages)
(function () {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("email");
  const msg = document.getElementById("newsletterMsg");

  if (!form || !emailInput || !msg) return;

  const KEY = "readify_newsletter_email";

  // show saved email if already subscribed
  const saved = localStorage.getItem(KEY);
  if (saved) {
    msg.textContent = `✅ Subscribed: ${saved}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email || !email.includes("@") || !email.includes(".")) {
      msg.textContent = "❌ Please enter a valid email.";
      return;
    }

    localStorage.setItem(KEY, email);
    msg.textContent = "✅ Thanks! You’re subscribed.";
    emailInput.value = "";
  });
})();
