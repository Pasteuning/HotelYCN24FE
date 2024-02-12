let endpointAddress = "http://108.142.25.246:8080"

function selectItem(selectedDiv) {
    const items = document.querySelectorAll('.nav-item');
  
    items.forEach(item => {
      item.classList.remove('selected');
    });
  
    selectedDiv.classList.add('selected');
    console.log(selectedDiv.id)
    if (selectedDiv.id === "nav-res") {
      paginationState.pageState = "res"
      renderRows(1, refetch=true)
      document.getElementById("main-body").innerHTML =  `<div id="res-body">

        
    <div class="new-res-container">
        <div class="new-res-wrapper">
            <button class="new-res-btn" onclick="nieweReservering(this)">
                Nieuwe Reservering
                <i class="fa-solid fa-plus"></i>
            </button>

            <select id="sort" onchange="setFilterState()">
                <option value="hotelId">Hotel id</option>
                <option value="hotelName">Hotel name</option>
                <option value="roomId">Room id</option>
                <option value="reservationId">Reservation id</option>
                <option value="ciDate">Check-in date</option>
                <option value="coDate" selected="selected">Check-out date</option>
                <option value="adults">Adults</option>
                <option value="children">Children</option>
                <option value="surcharge">Surcharge</option>
                <option value="status">Status</option>
                <option value="userId">User id</option>
                <option value="firstName">First name</option>
                <option value="lastName">Last name</option>
            </select>
        </div>
    
    </div>
    <div class="cur-res-container">
        <div class="cur-res-wrapper">
            <div class="cur-res-header-container">
                <div class="cur-res-header">
                    <div class="cur-res-header-item">Check in Datum</div>
                    <div class="cur-res-header-item">Kamer Type</div>
                    <div class="cur-res-header-item">Status</div>
                    <div class="cur-res-header-item-container">
                        <div class="subitem">Verwijder</div>
                        <div class="subitem">Bewerk</div>
                    </div>
                </div>
            </div>
            
            <div id="row-container">
            </div>

            <div class="pagination-container">
                <button class="pagebutton" id="prevPage" onclick="prevPage()">Previous</button>
                <div class="pagenumber" id="currentPage">1</div>
                <button class="pagebutton" id="nextPage" onclick="nextPage()">Next</button>
            </div>
            <div class="total-res-container">
                <div>
                    Total aantal reserveringen:
                </div>
                <div id="totalres">

                </div>
            </div>
        </div>
    </div>
</div>`
  }
  if (selectedDiv.id === "nav-usr") {
    paginationState.pageState = "usr"
      renderRows(1, refetch=true)
    document.getElementById("main-body").innerHTML = `<div id="usr-body">
    <div class="search-usr-container">
      <div class="search-usr-wrapper">
      <form id="search-bar" class="search-form" onsubmit="handleSubmit(event)">
        <input type="text" placeholder="Search users" id="search-user-input">
        <button type="submit" class="search-btn">Zoek Gebruikers</button>
      </form>
      </div>

    </div>
    <div class="cur-res-container">
        <div class="cur-res-wrapper">
            <div class="cur-res-header-container">
                <div class="cur-res-header">
                    <div class="cur-res-header-item">Voornaam</div>
                    <div class="cur-res-header-item">Achternaam</div>
                    <div class="cur-res-header-item">Email</div>
                    <div class="cur-res-header-item-container">
                        <div class="subitem">Verwijder</div>
                        <div class="subitem">Bewerk</div>
                    </div>
                </div>
            </div>
        
        <div id="row-container">
        </div>

        <div class="pagination-container">
            <button class="pagebutton" id="prevPage" onclick="prevPage()">Previous</button>
            <div class="pagenumber" id="currentPage">1</div>
            <button class="pagebutton" id="nextPage" onclick="nextPage()">Next</button>
        </div>
        <div class="total-res-container">
            <div>
                Total aantal Gebruikers:
            </div>
            <div id="totalres">

            </div>
        </div>
      </div>
    </div>
  </div>`
  }
}

function handleSubmit(event) {
  // Prevent the form from submitting normally
  event.preventDefault();
  
  // Get the email and password values
  let searchinput = document.getElementById('search-user-input').value;
  let current = paginationState.totalArray
  const filteredTotal = current.filter(user => user.firstName.includes(searchinput) || user.lastName.includes(searchinput) || user.email.includes(searchinput));
  paginationState.pages = sliceIntoChunks(filteredTotal, 5)
  renderRows(1)
  
}

function editReservering(elem){
  console.log(elem);
}

async function deleteReservering(elem){
  console.log(elem.parentElement.parentElement.id);
  let id = elem.parentElement.parentElement.id
  await fetch(`${endpointAddress}/deletereservation/${id}`)
}
function sliceIntoChunks(arr, chunkSize) {
  let result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    let chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
const paginationState = {
  filterState:"ciDate",
  pageState: "res",
  totalReservations: 0,
  currentPageNumber: 1,
  totalPages: 0,
  pages: [],
  totalArray: []
};
function endpointUrl(){
  if (paginationState.pageState === "res") {
    return `${endpointAddress}/allreservations?sort=${paginationState.filterState}`
  }
  if (paginationState.pageState === "usr") {
    return `${endpointAddress}/allusers`
  }
}

async function getAllReservations() {
  let fullUrl = endpointUrl()
  await fetch(fullUrl)
    .then(res => res.json())
    .then(reservations => {
      paginationState.totalReservations = reservations.length
      paginationState.pages = sliceIntoChunks(reservations, 5);
      paginationState.totalArray = reservations
      paginationState.totalPages = paginationState.pages.length;
    })
    .catch(error => console.error('Error fetching reservations:', error));
  document.getElementById('totalres').innerText = paginationState.totalReservations;
  return paginationState.pages;
}


function setFilterState(){
  paginationState.filterState = document.getElementById("sort").value
  renderRows(1, refetch=true)
}

async function renderRows(pageNumber, refetch=false){
  let pages = []
  if (refetch){
    pages = await getAllReservations();
  } 
  else {
    pages = paginationState.pages
  }
  if (!pages || pages.length === 0) {
    console.log("No pages or reservations available.");
    return;
  }
  paginationState.currentPageNumber = pageNumber;
  let page = pages[paginationState.currentPageNumber - 1];

  let htmlString = "";

  if (paginationState.pageState === "res") {
    page.forEach(row => {
      htmlString += `
      <div class="cur-res-row" id="${row.reservation.id}">
        <div class="cur-res-row-item">${row.reservation.ciDate}</div>
        <div class="cur-res-row-item">${row.lastName}</div>
        <div class="cur-res-row-item">${row.reservation.status}</div>
        <div class="cur-res-row-item-container">
            <div class="subitem" onclick="deleteReservering(this)"><i class="fa-solid fa-trash fa-xl"></i></div>
            <div class="subitem" onclick="editReservering(this)"><i class="fa-solid fa-pen-to-square fa-xl"></i></div>
          </div>
      </div>`;
    });
    document.getElementById('row-container').innerHTML = htmlString;
  } 
  else if (paginationState.pageState === "usr") {
    page.forEach(row => {
      htmlString += `
      <div class="cur-res-row" id="${row.id}">
        <div class="cur-res-row-item">${row.firstName}</div>
        <div class="cur-res-row-item">${row.lastName}</div>
        <div class="cur-res-row-item">${row.email}</div>
        <div class="cur-res-row-item-container">
            <div class="subitem" onclick="deleteReservering(this)"><i class="fa-solid fa-trash fa-xl"></i></div>
            <div class="subitem" onclick="editReservering(this)"><i class="fa-solid fa-pen-to-square fa-xl"></i></div>
          </div>
      </div>`;
    });
    document.getElementById('row-container').innerHTML = htmlString;
  }
  else {
    console.log(paginationState.pageState);
  }
}


function updateDisplay() {
  document.getElementById('currentPage').innerText = paginationState.currentPageNumber;
}
function prevPage() {
  if (paginationState.currentPageNumber > 1) {
    paginationState.currentPageNumber -= 1;
    updateDisplay();
    renderRows(paginationState.currentPageNumber)
  }
}

function nextPage() {
  if (paginationState.currentPageNumber < paginationState.totalPages) {
    paginationState.currentPageNumber += 1;
    updateDisplay();
    renderRows(paginationState.currentPageNumber)
  }
}

// Initialize display on load
document.addEventListener('DOMContentLoaded', updateDisplay);
window.onload = function() {
  // Code to run when the window is fully loaded
  renderRows(1, refetch=true)
};