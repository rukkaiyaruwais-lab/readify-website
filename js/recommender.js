// ===============================
// Readify - Random Book Recommender (MATCHES YOUR HTML)
// Uses: data/books.json
// Works with IDs in your recommender.html:
// genreSelect, lengthSelect, pickBtn, againBtn,
// saveBtn, clearListBtn, recMsg,
// resultBox, recImg, recTitle, recAuthor, recGenre, recPages, recReason,
// readingList, listNote
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const LIST_KEY = "readify_reading_list";
  const DATA_PATH = "data/books.json";

  // ---- Elements (must match your HTML exactly) ----
  const genreSelect = document.getElementById("genreSelect");
  const lengthSelect = document.getElementById("lengthSelect");
  const pickBtn = document.getElementById("pickBtn");
  const againBtn = document.getElementById("againBtn");
  const saveBtn = document.getElementById("saveBtn");
  const clearListBtn = document.getElementById("clearListBtn");

  const recMsg = document.getElementById("recMsg");

  const resultBox = document.getElementById("resultBox");
  const recImg = document.getElementById("recImg");
  const recTitle = document.getElementById("recTitle");
  const recAuthor = document.getElementById("recAuthor");
  const recGenre = document.getElementById("recGenre");
  const recPages = document.getElementById("recPages");
  const recReason = document.getElementById("recReason");

  const readingList = document.getElementById("readingList");
  const listNote = document.getElementById("listNote");

  // Stop if any element missing (prevents silent crash)
  const mustHave = [
    genreSelect, lengthSelect, pickBtn, againBtn, saveBtn, clearListBtn,
    recMsg, resultBox, recImg, recTitle, recAuthor, recGenre, recPages, recReason,
    readingList, listNote
  ];
  if (mustHave.some(x => !x)) {
    console.error("Recommender error: One or more required IDs are missing in recommender.html");
    return;
  }

  let books = [];
  let lastPick = null;

  function setMsg(text, isError = false) {
    recMsg.textContent = text;
    recMsg.style.color = isError ? "#b00020" : "var(--text)";
  }

  function lengthGroup(pages) {
    const p = Number(pages) || 0;
    if (p <= 200) return "Short";
    if (p <= 400) return "Medium";
    return "Long";
  }

  function getPool() {
    const g = genreSelect.value;
    const l = lengthSelect.value;

    return books.filter(b => {
      const genreOk = (g === "all") || (b.genre === g);
      const lenOk = (l === "all") || (lengthGroup(b.pages) === l);
      return genreOk && lenOk;
    });
  }

  function showPick(book) {
    lastPick = book;

    // Encode spaces in image filenames (important)
    const imgPath = book.image ? encodeURI(book.image) : "images/hero.jpg";
    recImg.src = imgPath;
    recImg.alt = `${book.title} cover`;

    recTitle.textContent = book.title || "—";
    recAuthor.textContent = book.author || "—";
    recGenre.textContent = book.genre || "—";
    recPages.textContent = book.pages ? `${book.pages} (${lengthGroup(book.pages)})` : "—";

    recReason.textContent = "Picked based on your selected genre + length.";
    setMsg("✅ Recommendation updated!");
  }

  function pick(avoidSame = false) {
    const pool = getPool();
    if (pool.length === 0) {
      setMsg("❌ No books match that filter. Try 'All'.", true);
      return;
    }

    let chosen = pool[Math.floor(Math.random() * pool.length)];

    if (avoidSame && lastPick && pool.length > 1) {
      while (chosen.title === lastPick.title) {
        chosen = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    showPick(chosen);
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function loadList() {
    try {
      const raw = localStorage.getItem(LIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveList(list) {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  }

  function renderList() {
    const list = loadList();
    readingList.innerHTML = "";

    if (list.length === 0) {
      listNote.style.display = "block";
      return;
    }

    listNote.style.display = "none";

    list.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${item.title}</b> — ${item.author} <span style="opacity:.75;">(${item.genre})</span>`;
      readingList.appendChild(li);
    });
  }

  // ---- Buttons ----
  pickBtn.addEventListener("click", () => pick(false));
  againBtn.addEventListener("click", () => pick(true));

  saveBtn.addEventListener("click", () => {
    if (!lastPick) {
      setMsg("Pick a book first 🙂", true);
      return;
    }

    const list = loadList();
    const exists = list.some(x => x.title === lastPick.title);

    if (exists) {
      setMsg("Already saved ✅");
      return;
    }

    list.unshift(lastPick);
    saveList(list);
    renderList();
    setMsg("Saved to Reading List ✅");
  });

  clearListBtn.addEventListener("click", () => {
    localStorage.removeItem(LIST_KEY);
    renderList();
    setMsg("Reading list cleared ✅");
  });

  // ---- Load books ----
  setMsg("Loading books...");
  fetch(DATA_PATH)
    .then(res => {
      if (!res.ok) throw new Error("Could not fetch " + DATA_PATH);
      return res.json();
    })
    .then(data => {
      books = Array.isArray(data) ? data : (data.books || []);
      if (!Array.isArray(books) || books.length === 0) {
        throw new Error("No book array found in JSON");
      }
      setMsg("Choose filters and click Pick a Book ✅");
    })
    .catch(err => {
      console.error(err);
      setMsg("❌ Could not load data/books.json. Check path + JSON.", true);
    })
    .finally(() => {
      renderList();
    });
});
