function selectItem(selectedDiv) {
    const items = document.querySelectorAll('.nav-item');
  
    items.forEach(item => {
      item.classList.remove('selected');
    });
  
    selectedDiv.classList.add('selected');
  }
  

function editReservering(elem){
  console.log(elem);
}

function deleteReservering(elem){
  console.log(elem);
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

  await fetch(`http://127.0.0.1:8080/allreservations?sort=${sort}`)
    .then(res => res.json())
    .then(reservations => {
      paginationState.totalReservations = reservations.length
      paginationState.pages = sliceIntoChunks(reservations, 2);
      paginationState.totalPages = paginationState.pages.length;
      console.log(paginationState.pages);
    })
    .catch(error => console.error('Error fetching reservations:', error));
  document.getElementById('totalres').innerText = paginationState.totalReservations;
  return paginationState.pages;
}

function setFilterState(){
  paginationState.filterState = document.getElementById("sort").value
  renderRows(1)
}

async function renderRows(pageNumber){
  let pages = await getAllReservations();
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
      <div class="cur-res-row">
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
