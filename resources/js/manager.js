let endpointAddress = "http://127.0.0.1:8080"

function selectItem(selectedDiv) {
    const items = document.querySelectorAll('.nav-item');
  
    items.forEach(item => {
      item.classList.remove('selected');
    });
  
    selectedDiv.classList.add('selected');
    console.log(selectedDiv.id)
    if (selectedDiv.id === "nav-res") {
      document.getElementById("usr-body").classList.remove("visible")
      document.getElementById("usr-body").classList.add("hidden")
      document.getElementById("inv-body").classList.remove("visible")
      document.getElementById("inv-body").classList.add("hidden")
      document.getElementById("res-body").classList.remove("hidden")
      document.getElementById("res-body").classList.add("visible")
    }
    if (selectedDiv.id === "nav-usr") {
      document.getElementById("res-body").classList.remove("visible")
      document.getElementById("res-body").classList.add("hidden")
      document.getElementById("inv-body").classList.remove("visible")
      document.getElementById("inv-body").classList.add("hidden")
      document.getElementById("usr-body").classList.remove("hidden")
      document.getElementById("usr-body").classList.add("visible")
    }
    if (selectedDiv.id === "nav-inv") {
      document.getElementById("res-body").classList.remove("visible")
      document.getElementById("res-body").classList.add("hidden")
      document.getElementById("usr-body").classList.remove("visible")
      document.getElementById("usr-body").classList.add("hidden")
      document.getElementById("inv-body").classList.remove("hidden")
      document.getElementById("inv-body").classList.add("visible")
    }
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
  totalReservations: 0,
  currentPageNumber: 1,
  totalPages: 0,
  pages: []
};

async function getAllReservations() {
  let sort = paginationState.filterState;
  console.log(sort)
  await fetch(`${endpointAddress}/allreservations?sort=${sort}`)
    .then(res => res.json())
    .then(reservations => {
      paginationState.totalReservations = reservations.length
      paginationState.pages = sliceIntoChunks(reservations, 5);
      paginationState.totalPages = paginationState.pages.length;
      console.log(paginationState.pages);
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

  if (page) {
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
  } else {
    console.log("Page not found or empty page array.");
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