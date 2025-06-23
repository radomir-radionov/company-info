const btnAddTeammate = document.getElementById("btn-add-teammate");
const modal = document.getElementById("modal-add-teammate");
const btnCloseModal = document.getElementById("btn-close-modal");
const formAddTeammateEl = document.getElementById("form-add-teammate");
const teamCardsEl = document.querySelector(".team-cards");
const FAVORITES_KEY = "teammate_favorites";
const favoritesCountEl = document.getElementById("favorites-count");

const STORAGE_KEY = "teammates";

// Get favorites from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Update favorites count in header
function updateFavoritesCount() {
  const favorites = getFavorites();
  favoritesCountEl.textContent = favorites.length;
}

// Save teammates to localStorage
function saveTeammates(teammates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teammates));
}

// Add teammate card to DOM
function addTeammateCard(teammate, index) {
  const card = document.createElement("div");
  card.className = "team-card";

  const placeholder =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(teammate.name || "User");

  // Check if this teammate is in favorites
  const favorites = getFavorites();
  const isFavorite = favorites.includes(index);

  card.innerHTML = `
    <img src="${teammate.avatar}" alt="" width="96" height="96"
      onerror="this.onerror=null;this.src='${placeholder}';" />
    <h5>${teammate.name}</h5>
    <p class="text-role">${teammate.position}</p>
    <p class="supporting-text">${teammate.description}</p>
    <div>
      <button class="btn-secondary btn-edit" data-index="${index}">Edit</button>
      <button class="btn-secondary btn-delete" data-index="${index}">Delete</button>
      <button class="btn-secondary btn-favorite" data-index="${index}" style="color:${
    isFavorite ? "#7f56d9" : "#414651"
  }">
        ${isFavorite ? "★" : "☆"} Favorite
      </button>
    </div>
  `;

  teamCardsEl.appendChild(card);
}

// Show skeletons
function showSkeletons(count = 3) {
  teamCardsEl.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "team-card skeleton";
    skeleton.innerHTML = `
      <div style="width:96px;height:96px;background:#eee;border-radius:50%;margin-bottom:1rem;"></div>
      <div style="width:60%;height:20px;background:#eee;border-radius:4px;margin-bottom:0.5rem;"></div>
      <div style="width:40%;height:16px;background:#eee;border-radius:4px;margin-bottom:0.5rem;"></div>
      <div style="width:80%;height:32px;background:#eee;border-radius:4px;margin-bottom:1rem;"></div>
      <div style="display:flex;gap:8px;">
        <div style="width:60px;height:32px;background:#eee;border-radius:8px;"></div>
        <div style="width:60px;height:32px;background:#eee;border-radius:8px;"></div>
        <div style="width:80px;height:32px;background:#eee;border-radius:8px;"></div>
      </div>
    `;
    teamCardsEl.appendChild(skeleton);
  }
}

// Load teammates from localStorage and render them
function loadTeammates() {
  teamCardsEl.innerHTML = "";
  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  teammates.forEach((teammate, idx) => addTeammateCard(teammate, idx));
  updateFavoritesCount();
}

// On DOMContentLoaded, show skeletons, then load teammates after 3s
document.addEventListener("DOMContentLoaded", () => {
  showSkeletons(3);
  setTimeout(() => {
    loadTeammates();
  }, 3000);
});

// --- Edit Modal Logic ---
let editIndex = null;

// Delegate edit, delete, and favorite button click
teamCardsEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const idx = e.target.getAttribute("data-index");
    openEditModal(idx);
  }
  if (e.target.classList.contains("btn-delete")) {
    const idx = e.target.getAttribute("data-index");
    deleteTeammate(idx);
  }
  if (e.target.classList.contains("btn-favorite")) {
    const idx = parseInt(e.target.getAttribute("data-index"));
    toggleFavorite(idx);
  }
});

function openEditModal(idx) {
  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const teammate = teammates[idx];
  editIndex = idx;

  // Fill form with teammate data
  formAddTeammateEl.avatar.value = teammate.avatar;
  formAddTeammateEl.name.value = teammate.name;
  formAddTeammateEl.position.value = teammate.position;
  formAddTeammateEl.description.value = teammate.description;

  // Change button to Save
  formAddTeammateEl.querySelector(".btn-primary").textContent = "Save";
  modal.style.display = "flex";
}

// Hide modal
btnCloseModal.addEventListener("click", () => {
  modal.style.display = "none";
  formAddTeammateEl.reset();
});

// Hide modal when clicking outside the form
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    formAddTeammateEl.reset();
  }
});

// Add card logic and save to localStorage
formAddTeammateEl.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(formAddTeammateEl);
  let teammate = Object.fromEntries(formData);

  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (editIndex !== null) {
    // Edit mode
    teammates[editIndex] = teammate;
    saveTeammates(teammates);
    editIndex = null;
    formAddTeammateEl.querySelector(".btn-primary").textContent = "Add";
    loadTeammates();
  } else {
    // Add mode
    teammates.push(teammate);

    console.log(teammates);
    saveTeammates(teammates);
    addTeammateCard(teammate, teammates.length - 1);
  }

  modal.style.display = "none";
  formAddTeammateEl.reset();
});

// Delete teammate logic
function deleteTeammate(idx) {
  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  teammates.splice(idx, 1);
  saveTeammates(teammates);
  loadTeammates();
}

// Toggle favorite logic
function toggleFavorite(idx) {
  let favorites = getFavorites();
  idx = Number(idx);
  if (favorites.includes(idx)) {
    favorites = favorites.filter((i) => i !== idx);
  } else {
    favorites.push(idx);
  }
  saveFavorites(favorites);
  updateFavoritesCount();

  // Update only the favorite button for this card
  const card = teamCardsEl.children[idx];
  if (card) {
    const btn = card.querySelector(".btn-favorite");
    if (btn) {
      const isFavorite = favorites.includes(idx);
      btn.innerHTML = `${isFavorite ? "★" : "☆"} Favorite`;
      btn.style.color = isFavorite ? "#7f56d9" : "#414651";
    }
  }
}

// Show modal for add
btnAddTeammate.addEventListener("click", () => {
  modal.style.display = "flex";
  formAddTeammateEl.reset();
  editIndex = null;
  formAddTeammateEl.querySelector(".btn-primary").textContent = "Add";
});

// Initial load
loadTeammates();
