// ==========================
// Readify - Reading Flow JS
// Cozy Sounds + Completed List
// ==========================

// ✅ AUDIO FILES (relative to reading-flow.html in project root)
const soundFiles = {
  rain: "sound/sounds/rain.mp3",
  fire: "sound/sounds/fireplace.mp3",
  cafe: "sound/sounds/cafe.mp3"
};

const soundMsg = document.getElementById("soundMsg");
const rainBtn = document.getElementById("rainBtn");
const fireBtn = document.getElementById("fireBtn");
const cafeBtn = document.getElementById("cafeBtn");
const stopBtn = document.getElementById("stopBtn");

// One audio player
const player = new Audio();
player.loop = true;

// Helpful error message if file not found
player.addEventListener("error", () => {
  setSoundMessage("Audio not playing ❌ File path/name wrong (check sound/sounds/).");
});

function setSoundMessage(text) {
  soundMsg.textContent = text;
}

function playSound(key) {
  player.pause();
  player.currentTime = 0;

  // Set correct file
  player.src = soundFiles[key];

  // Try to play (user click allows it)
  player.play()
    .then(() => setSoundMessage(`Playing: ${key} ✅`))
    .catch(() => setSoundMessage("Audio blocked by browser ❌ Click the button again."));
}

function stopSound() {
  player.pause();
  player.currentTime = 0;
  setSoundMessage("Stopped ✅");
}

// Button listeners
rainBtn.addEventListener("click", () => playSound("rain"));
fireBtn.addEventListener("click", () => playSound("fire"));
cafeBtn.addEventListener("click", () => playSound("cafe"));
stopBtn.addEventListener("click", stopSound);

// ==========================
// Completed Books (localStorage)
// ==========================
const DONE_KEY = "readify_completed_books";

const doneForm = document.getElementById("doneForm");
const doneTitle = document.getElementById("doneTitle");
const doneAuthor = document.getElementById("doneAuthor");
const doneList = document.getElementById("doneList");
const doneMsg = document.getElementById("doneMsg");
const doneNote = document.getElementById("doneNote");
const clearDoneBtn = document.getElementById("clearDoneBtn");

function getDone() {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDone(list) {
  localStorage.setItem(DONE_KEY, JSON.stringify(list));
}

function showDoneMessage(text, isError = false) {
  doneMsg.textContent = text;
  doneMsg.style.color = isError ? "#b00020" : "#0F0F0F";
}

function renderDone() {
  const list = getDone();
  doneList.innerHTML = "";

  if (list.length === 0) {
    doneNote.textContent = "No completed books yet.";
    return;
  }

  doneNote.textContent = "";

  list.forEach((b, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    li.style.padding = "10px";
    li.style.border = "1px solid #d8c8b7";
    li.style.borderRadius = "8px";
    li.style.marginBottom = "10px";
    li.style.background = "#fff";

    const left = document.createElement("div");
    const authorText = b.author ? ` • ${b.author}` : "";
    left.innerHTML = `<b>${b.title}</b><br><span>Finished on ${b.date}${authorText}</span>`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn";
    removeBtn.style.padding = "8px 10px";

    removeBtn.addEventListener("click", () => {
      const updated = getDone().filter((_, i) => i !== index);
      saveDone(updated);
      renderDone();
      showDoneMessage("Removed ✅");
    });

    li.appendChild(left);
    li.appendChild(removeBtn);
    doneList.appendChild(li);
  });
}

doneForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = doneTitle.value.trim();
  const author = doneAuthor.value.trim();

  if (!title) {
    showDoneMessage("Please enter a book title.", true);
    return;
  }

  const list = getDone();

  const exists = list.some(item => item.title.toLowerCase() === title.toLowerCase());
  if (exists) {
    showDoneMessage("This book is already marked completed ✅");
    doneTitle.value = "";
    doneAuthor.value = "";
    return;
  }

  const date = new Date().toLocaleDateString();

  list.unshift({ title, author, date });
  saveDone(list);

  doneTitle.value = "";
  doneAuthor.value = "";

  renderDone();
  showDoneMessage("Marked as completed ✅");
});

clearDoneBtn.addEventListener("click", () => {
  localStorage.removeItem(DONE_KEY);
  renderDone();
  showDoneMessage("Cleared all ✅");
});

// INIT
setSoundMessage("Pick a sound to start.");
renderDone();
