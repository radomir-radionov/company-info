const btnAddTeammate = document.getElementById("btn-add-teammate");
const modal = document.getElementById("modal-add-teammate");
const btnCloseModal = document.getElementById("btn-close-modal");
const formAddTeammateEl = document.getElementById("form-add-teammate");
const teamCardsEl = document.querySelector(".team-cards");

const STORAGE_KEY = "teammates";

// Load teammates from localStorage and render them
function loadTeammates() {
  teamCardsEl.innerHTML = "";
  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  teammates.forEach((teammate) => addTeammateCard(teammate));
}

// Save teammates to localStorage
function saveTeammates(teammates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teammates));
}

// Add teammate card to DOM
function addTeammateCard(teammate) {
  const card = document.createElement("div");
  card.className = "team-card";

  const placeholder =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(teammate.name || "User");

  card.className = "team-card";
  card.innerHTML = `
    <img src="${teammate.avatar}" alt="" width="96" height="96"
      onerror="this.onerror=null;this.src='${placeholder}';" />
    <h5>${teammate.name}</h5>
    <p class="text-role">${teammate.position}</p>
    <p class="supporting-text">${teammate.description}</p>
    <div></div>
  `;

  teamCardsEl.appendChild(card);
}

// Show modal
btnAddTeammate.addEventListener("click", () => {
  modal.style.display = "flex";
});

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

  // Get current teammates, add new, save, and re-render
  const teammates = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  teammates.push(teammate);
  saveTeammates(teammates);

  addTeammateCard(teammate);

  modal.style.display = "none";
  formAddTeammateEl.reset();
});

// Initial load
loadTeammates();
