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
      paginationState.options = {
        lastName: "Last name",
      ciDate: "Check-in date",
      status: "Status",
      adults: "Adults",
      children: "Children",
      hotelName: "Hotel name"}
      paginationState.keyorder = ["lastName",
      "reservation.ciDate",
      "reservation.status",
      "reservation.adults",
      "reservation.children",
      "hotelName",
      ]
    }
    if (selectedDiv.id === "nav-usr") {
      paginationState.pageState = "usr"
      paginationState.options = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      zipCode: "Zip Code",
      houseNumber: "House Number",
      country: "Country",
      }
      paginationState.keyorder = Object.keys(paginationState.options);
    }
    if (selectedDiv.id === "nav-inv") {
      paginationState.pageState = "inv"
      paginationState.options = {Nuts2Code:"Nuts 2 Code",Country: "Country",LocationName:"Location Name",NumAccoms:"Number of Accomodations"}
      paginationState.keyorder = Object.keys(paginationState.options);
    }
      renderRows(1, refetch=true)
      document.getElementById("main-body").innerHTML =  `<div id="res-body">
          <div class="search-usr-container">
            <div class="search-usr-wrapper">
            <form id="search-bar" class="search-form" onsubmit="handleSubmit(event)">
              <input type="text" placeholder="Zoek in reserveringen..." id="search-user-input">
              <button type="submit" class="search-btn">Zoek Reservering</button>
            </form>
            </div>

          </div>
          <div class="cur-res-container">
              <div class="cur-res-wrapper">
                  <div class="cur-res-header-container">
                      <div class="cur-res-header">
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
                <div class="new-res-container">
                    <div class="new-res-wrapper">
                        <button class="new-res-btn" onclick="nieweReservering(this)">
                            Nieuwe Reservering
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <select id="sort" onchange="setFilterState()">
                        </select>
                    </div>
                </div>
            </div>`
    filterOptions(paginationState.options)
    filterDivs(paginationState.options)
  
}
function handleSubmit(event) {
  // Prevent the form from submitting normally
  event.preventDefault();
  
  // Get the search input value
  let searchInput = document.getElementById('search-user-input').value.toLowerCase();

  // Get the current array from the pagination state
  let current = paginationState.totalArray;

  // Filter the array dynamically checking all keys in each object
  const filteredTotal = current.filter(row => {
    // Check each key in the object to see if any value includes the search input
    return Object.keys(row).some(key => {
      // Ensure the value is a string and compare it case-insensitively
      let value = String(row[key]).toLowerCase();
      return value.includes(searchInput);
    });
  });

  // Update pagination state with the filtered results
  paginationState.pages = sliceIntoChunks(filteredTotal, 5);
  paginationState.totalPages = paginationState.pages.length;
  paginationState.currentPageNumber = 1;
  paginationState.totalItems = filteredTotal.length;

  // Update the display based on the new filtered and paginated results
  updateDisplay();
  document.getElementById('totalres').innerText = paginationState.totalItems;

  // Render the first page of the new filtered results
  renderRows(1);
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
  totalItems: 0,
  currentPageNumber: 1,
  totalPages: 0,
  pages: [],
  totalArray: [],
  options: {
    lastName: "Last name",
    ciDate: "Check-in date",
    status: "Status",
    adults: "Adults",
    children: "Children",
    hotelName: "Hotel name"},
  keyorder: ["lastName",
    "reservation.ciDate",
    "reservation.status",
    "reservation.adults",
    "reservation.children",
    "hotelName",
    ]
};
function endpointUrl(){
  if (paginationState.pageState === "res") {
    return `${endpointAddress}/allreservations?sort=${paginationState.filterState}`
  }
  if (paginationState.pageState === "usr") {
    return `${endpointAddress}/allusers`
  }
  if (paginationState.pageState === "inv") {
    return `https://yc2401bigdata.azurewebsites.net/locationrating/all`
  }
}

async function getAllItems(optional="") {
  let fullUrl = endpointUrl()
  console.log(paginationState.pageState)
  console.log(fullUrl)
  await fetch(`${fullUrl}${optional}`)
    .then(res => res.json())
    .then(Items => {
      paginationState.totalItems = Items.length
      paginationState.pages = sliceIntoChunks(Items, 5);
      paginationState.totalArray = Items
      paginationState.totalPages = paginationState.pages.length;
      console.log(Items)
    })
    .catch(error => console.error('Error fetching Items:', error));
  return sliceIntoChunks(paginationState.totalArray, 5);
}


function setFilterState(){
  paginationState.filterState = document.getElementById("sort").value
  renderRows(1, refetch=true)
}

async function renderRows(pageNumber, refetch=false){
  let pages = []
  if (refetch){
    pages = await getAllItems();
  } 
  else {
    pages = sliceIntoChunks(paginationState.totalArray, 5)
  }
  if (!pages || pages.length === 0) {
    console.log("No pages or Items available.");
    return;
  }
  paginationState.currentPageNumber = pageNumber;
  let page = pages[paginationState.currentPageNumber - 1];

  let htmlString = "";

  
  generateRowsFromObject(page, paginationState.keyorder)
    // page.forEach(row => {
    //   htmlString += `
    //   <div class="cur-res-row" id="${row.reservation.id}">
    //     <div class="cur-res-row-item">${row.reservation.ciDate}</div>
    //     <div class="cur-res-row-item">${row.lastName}</div>
    //     <div class="cur-res-row-item">${row.reservation.status}</div>
    //     <div class="cur-res-row-item-container">
    //         <div class="subitem" onclick="deleteReservering(this)"><i class="fa-solid fa-trash fa-xl"></i></div>
    //         <div class="subitem" onclick="editReservering(this)"><i class="fa-solid fa-pen-to-square fa-xl"></i></div>
    //       </div>
    //   </div>`;
    // });
    // document.getElementById('row-container').innerHTML = htmlString;
  // } 
  // else if (paginationState.pageState === "usr") {
  //   page.forEach(row => {
  //     htmlString += `
  //     <div class="cur-res-row" id="${row.id}">
  //       <div class="cur-res-row-item">${row.firstName}</div>
  //       <div class="cur-res-row-item">${row.lastName}</div>
  //       <div class="cur-res-row-item">${row.email}</div>
  //       <div class="cur-res-row-item-container">
  //           <div class="subitem" onclick="deleteReservering(this)"><i class="fa-solid fa-trash fa-xl"></i></div>
  //           <div class="subitem" onclick="editReservering(this)"><i class="fa-solid fa-pen-to-square fa-xl"></i></div>
  //         </div>
  //     </div>`;
  //   });
  //   document.getElementById('row-container').innerHTML = htmlString;
  // }
  
  
}

function generateRowsFromObject(page, keyOrder) {
  const container = document.getElementById('row-container');
  container.innerHTML = ''; // Clear existing content

  // Function to safely retrieve nested values
  const getValueFromPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  page.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'cur-res-row';
    rowDiv.id = row.id; // Assuming an 'id' key for each row
    
    // Iterate over the keys in the specified order, handling nested paths
    keyOrder.forEach(keyPath => {
      const value = getValueFromPath(row, keyPath);
      if (value !== undefined) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cur-res-row-item';
        itemDiv.textContent = value;
        rowDiv.appendChild(itemDiv);
      }
    });
    row.actions = [
      {
        html: '<i class="fa-solid fa-trash fa-xl"></i>',
        onClick: function() { console.log("Deleting", this.parentElement.parentElement.id); }
      },
      {
        html: '<i class="fa-solid fa-pen-to-square fa-xl"></i>',
        onClick: function() { console.log("Editing", this.parentElement.parentElement.id); }
      }
    ]

    // Actions handling remains the same
    if (row.actions) {
      const actionsContainerDiv = document.createElement('div');
      actionsContainerDiv.className = 'cur-res-row-item-container';

      row.actions.forEach(action => {
        const actionDiv = document.createElement('div');
        actionDiv.className = 'subitem';
        actionDiv.innerHTML = action.html;
        actionDiv.onclick = action.onClick;
        actionsContainerDiv.appendChild(actionDiv);
      });

      rowDiv.appendChild(actionsContainerDiv);
    }

    // Append the completed row to the container
    container.appendChild(rowDiv);
  });
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

function filterOptions(options) {
  
// Select the <select> element where options will be added
  const selectElement = document.getElementById('sort');
  const order = Object.keys(options);
  // Iterate over the object and add an <option> element for each key-value pair
    order.forEach(key => {
      if (key in options) {
      // Create a new <option> element
      const option = document.createElement('option');
      option.value = key;
      option.textContent = options[key];
      if (key === 'coDate') {
        option.selected = true;
    }selectElement.appendChild(option);
      }
      // Set "selected" attribute for "coDate" as per your original HTML
      

      // Append the <option> to the <select> element
});
}
function filterDivs(options) {
  // Select the container element where divs will be added
  const container = document.querySelector('.cur-res-header');
  const order = Object.keys(options);
  // Clear existing items except the last one with subitems
  const itemsToRemove = container.querySelectorAll('.cur-res-header-item');
  itemsToRemove.forEach(item => item.remove());
  
  // Iterate over the object and add a <div> element for each key-value pair
  order.forEach(key => {
    if (key in options) {
    // Create a new <div> element
    if (key !== 'actions') {
    const div = document.createElement('div');
    div.className = 'cur-res-header-item'; // Set the class name
    div.textContent = options[key]; // Set the text content to the value from options
    
    // Append the <div> to the container
    container.insertBefore(div, container.lastElementChild);}}
  });
}

// Initialize display on load
document.addEventListener('DOMContentLoaded', updateDisplay);
window.onload = function() {
  // Code to run when the window is fully loaded
  filterOptions(paginationState.options)
  renderRows(1, refetch=true)
};