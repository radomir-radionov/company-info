let formAddTeammateEl = document.querySelector("#form-add-teammate");
let teamCardsEl = document.querySelector(".team-cards");

formAddTeammateEl.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(formAddTeammateEl);
  let teammate = Object.fromEntries(formData);

  // Create card element
  const card = document.createElement("div");
  card.className = "team-card";
  card.innerHTML = `
    <img src="${teammate.avatar}" alt="" width="96" height="96" />
    <h5>${teammate.name}</h5>
    <p class="text-role">${teammate.position}</p>
    <p class="supporting-text">${teammate.description}</p>
    <div></div>
  `;

  teamCardsEl.appendChild(card);
  formAddTeammateEl.reset();
});
