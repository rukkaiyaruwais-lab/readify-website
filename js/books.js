// ==========================
// Readify - Book Explorer
// Loads JSON, builds cards, search/filter, modal
// ==========================

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");

const modal = document.getElementById("bookModal");
const closeModal = document.getElementById("closeModal");

const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalGenre = document.getElementById("modalGenre");
const modalSynopsis = document.getElementById("modalSynopsis");
const modalSeries = document.getElementById("modalSeries");
const modalReviews = document.getElementById("modalReviews");

let books = [];

function showError(msg) {
  if (!bookGrid) return;
  bookGrid.innerHTML = `<p style="color:#b00020;font-weight:700;">${msg}</p>`;
}

async function loadBooks() {
  try {
    // ✅ IMPORTANT: your file is inside /data/
    const res = await fetch("./data/books.json");
    if (!res.ok) throw new Error("Fetch failed");
    books = await res.json();

    buildGenreOptions(books);
    renderBooks(books);
  } catch (e) {
    showError("❌ Could not load data/books.json. Check folder name + file path.");
  }
}

function buildGenreOptions(data) {
  if (!genreFilter) return;
  const genres = ["all", ...new Set(data.map(b => b.genre))];
  genreFilter.innerHTML = genres
    .map(g => `<option value="${g}">${g === "all" ? "All Genres" : g}</option>`)
    .join("");
}

function renderBooks(data) {
  if (!bookGrid) return;
  bookGrid.innerHTML = "";

  data.forEach((b) => {
    const card = document.createElement("div");
    card.className = "book-card reveal";

    card.innerHTML = `
      <img class="book-cover" src="${b.image}" alt="${b.title} cover">
      <div class="book-info">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
      </div>
    `;

    card.addEventListener("click", () => openModal(b));
    bookGrid.appendChild(card);
  });

  // trigger reveal after render
  window.dispatchEvent(new Event("scroll"));
}

function openModal(book) {
  if (!modal) return;

  modalImg.src = book.image;
  modalImg.alt = book.title + " cover";
  modalTitle.textContent = book.title;
  modalAuthor.textContent = book.author;
  modalGenre.textContent = book.genre;
  modalSynopsis.textContent = book.synopsis;

  // series list
  modalSeries.innerHTML = "";
  if (book.series && book.series.length > 0) {
    book.series.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      modalSeries.appendChild(li);
    });
  } else {
    modalSeries.innerHTML = "<li>No sequels/prequels listed.</li>";
  }

  // reviews table
  modalReviews.innerHTML = "";
  (book.reviews || []).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.platform}</td><td>${r.rating}</td><td>${r.review}</td>`;
    modalReviews.appendChild(tr);
  });

  modal.classList.add("open");
}

function closeModalNow() {
  modal?.classList.remove("open");
}

closeModal?.addEventListener("click", closeModalNow);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModalNow();
});

function applyFilters() {
  const q = (searchInput?.value || "").toLowerCase().trim();
  const g = genreFilter?.value || "all";

  const filtered = books.filter((b) => {
    const matchText =
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q);

    const matchGenre = g === "all" || b.genre === g;
    return matchText && matchGenre;
  });

  renderBooks(filtered);
}

searchInput?.addEventListener("input", applyFilters);
genreFilter?.addEventListener("change", applyFilters);

loadBooks();
