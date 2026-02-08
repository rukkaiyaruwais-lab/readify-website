// Readify - Progress Tracker

const form = document.getElementById("progressForm");
const bookNameEl = document.getElementById("bookName");
const totalPagesEl = document.getElementById("totalPages");
const pagesReadEl = document.getElementById("pagesRead");
const dailySpeedEl = document.getElementById("dailySpeed");

const percentText = document.getElementById("percentText");
const remainingText = document.getElementById("remainingText");
const finishText = document.getElementById("finishText");
const progressFill = document.getElementById("progressFill");
const progressNote = document.getElementById("progressNote");
const formMsg = document.getElementById("formMsg");

const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

const STORAGE_KEY = "readify_progress";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function showMsg(text, type = "ok") {
  formMsg.textContent = text;
  formMsg.className = "form-msg " + (type === "error" ? "msg-error" : "msg-ok");
}

function daysToFinish(total, read, speed) {
  const remaining = Math.max(0, total - read);
  const days = Math.ceil(remaining / speed);
  return days;
}

function formatFinishDate(days) {
  if (!Number.isFinite(days) || days <= 0) return "Today / Completed";
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function animateNumber(el, from, to, durationMs = 600) {
  const start = performance.now();
  const diff = to - from;

  function step(now) {
    const t = clamp((now - start) / durationMs, 0, 1);
    const value = Math.round(from + diff * t);
    el.textContent = value;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateUI(total, read, speed) {
  // % completed
  const percent = clamp(Math.round((read / total) * 100), 0, 100);
  const remaining = Math.max(0, total - read);
  const days = daysToFinish(total, read, speed);
  const finishDate = formatFinishDate(days);

  // Animate numbers
  const currentPercent = parseInt(percentText.textContent || "0", 10);
  const currentRemaining = parseInt(remainingText.textContent || "0", 10);

  animateNumber(percentText, isNaN(currentPercent) ? 0 : currentPercent, percent);
  animateNumber(remainingText, isNaN(currentRemaining) ? 0 : currentRemaining, remaining);

  // Progress bar
  progressFill.style.width = percent + "%";

  // Text
  finishText.textContent = finishDate;

  if (remaining === 0) {
    progressNote.textContent = "Completed! 🎉 Try another book!";
  } else {
    progressNote.textContent = `${remaining} pages left. At ${speed}/day, you’ll finish in ~${days} day(s).`;
  }
}

function readInputs() {
  const total = Number(totalPagesEl.value);
  const read = Number(pagesReadEl.value);
  const speed = Number(dailySpeedEl.value);

  const bookName = (bookNameEl.value || "").trim();

  if (!Number.isFinite(total) || total <= 0) {
    showMsg("Total Pages must be greater than 0.", "error");
    return null;
  }
  if (!Number.isFinite(read) || read < 0) {
    showMsg("Pages Read must be 0 or more.", "error");
    return null;
  }
  if (read > total) {
    showMsg("Pages Read cannot be more than Total Pages.", "error");
    return null;
  }
  if (!Number.isFinite(speed) || speed <= 0) {
    showMsg("Reading Speed must be greater than 0.", "error");
    return null;
  }

  showMsg("Calculated successfully.", "ok");
  return { bookName, total, read, speed };
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  showMsg("Saved to localStorage ✅", "ok");
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    bookNameEl.value = data.bookName || "";
    totalPagesEl.value = data.total ?? "";
    pagesReadEl.value = data.read ?? "";
    dailySpeedEl.value = data.speed ?? "";

    // If values valid, show immediately
    if (data.total && (data.read || data.read === 0) && data.speed) {
      updateUI(Number(data.total), Number(data.read), Number(data.speed));
      showMsg("Loaded saved progress ✅", "ok");
    }
  } catch {
    // ignore
  }
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);

  bookNameEl.value = "";
  totalPagesEl.value = "";
  pagesReadEl.value = "";
  dailySpeedEl.value = "";

  percentText.textContent = "0";
  remainingText.textContent = "0";
  finishText.textContent = "—";
  progressFill.style.width = "0%";
  progressNote.textContent = "Enter values and click Calculate.";

  showMsg("Cleared ✅", "ok");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = readInputs();
  if (!data) return;
  updateUI(data.total, data.read, data.speed);
});

saveBtn.addEventListener("click", () => {
  const data = readInputs();
  if (!data) return;
  saveProgress(data);
});

clearBtn.addEventListener("click", clearProgress);

// INIT
loadProgress();
