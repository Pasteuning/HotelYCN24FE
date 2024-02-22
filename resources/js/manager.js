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
      paginationState.options = {Nuts2Code:"Nuts 2 Code",Country: "Country",LocationName:"Location Name",Score:"Score"}
      paginationState.keyorder = Object.keys(paginationState.options);
    }
    renderPage()
};

function renderPage(){
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
                <div class="new-res-wrapper" id ="new-item-wrapper">
                    <select id="sort" onchange="setFilterState()">
                    </select>
                </div>
            </div>
        </div>`
filterOptions(paginationState.options)
filterDivs(paginationState.options)
newButton()
};

function newButton(){
  if (paginationState.pageState !== "inv"){
    const ele = document.getElementById("new-item-wrapper")
    const button = document.createElement("button")
    button.className = "new-res-btn"
    let html = "Nieuwe "
    if (paginationState.pageState === "res"){
      html += "Reservering"
    } else {
      html += "Gebruiker"
    }
    action = {
        html: html + '<i class="fa-solid fa-plus"></i>`',
        onClick: function() { nieuweReservering(this) }
      }
    button.innerHTML = action.html;
    button.onclick = action.onClick;
    ele.appendChild(button);
  }
};

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
  paginationState.filteredArray = filteredTotal;
  paginationState.totalPages = Math.ceil(filteredTotal.length / paginationState.pageLength);
  paginationState.currentPageNumber = 1;
  paginationState.totalItems = filteredTotal.length;
  // Update the display based on the new filtered and paginated results
  updateDisplay();
  document.getElementById('totalres').innerText = paginationState.totalItems;
  // Render the first page of the new filtered results
  renderRows(1);
};

async function deleteItem(elem){
  console.log(elem.parentElement.parentElement.id);
  let id = elem.parentElement.parentElement.id
  let deleteEndpoint = "";
  if (paginationState.pageState === "res"){
    deleteEndpoint += "cancel-reservation"
  }
  if (paginationState.pageState === "usr") {
    deleteEndpoint += "deleteuser"
  }
  await fetch(`${endpointAddress}/${deleteEndpoint}/${parseInt(id)}`, {
    method: "DELETE"
  })
  renderRows(1, refetch=true)
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
  currentPage: [],
  totalPages: 0,
  totalArray: [],
  pageLength: 5,
  filteredArray: [],
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
    return `http://yc2401bigdata.azurewebsites.net/locationrating/all`
  }
}

async function getAllItems(optional="") {
  let fullUrl = endpointUrl()
  console.log(paginationState.pageState)
  console.log(fullUrl)
  await fetch(`${fullUrl}${optional}`)
    .then(res => res.json())
    .then(items => {
      paginationState.totalItems = items.length
      paginationState.totalArray = items
      paginationState.filteredArray = items
      paginationState.totalPages = Math.ceil(items.length / paginationState.pageLength);
      console.log(items)
    })
    .catch(error => console.error('Error fetching Items:', error));
    document.getElementById('totalres').innerText = paginationState.totalItems
  return sliceIntoChunks(paginationState.totalArray, paginationState.pageLength);
}


function setFilterState(){
  paginationState.filterState = document.getElementById("sort").value
  renderRows(1, refetch=true)
}

async function renderRows(pageNumber, refetch=false){
  let pages = []
  if (refetch){
    pages = await getAllItems();
  } else {
    pages = sliceIntoChunks(paginationState.filteredArray, paginationState.pageLength)
  }
  if (!pages || pages.length === 0) {
    console.log("No pages or Items available.");
    return;
  };
  paginationState.currentPageNumber = pageNumber;
  let page = pages[paginationState.currentPageNumber - 1];
  paginationState.currentPage = page
  console.log(paginationState.currentPage)
  generateRowsFromObject(page, paginationState.keyorder)
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
    if (paginationState.pageState === "res") {
      rowDiv.id = row.reservation.id;
    } else {
      rowDiv.id = row.id;
    }
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
        onClick: function() { deleteItem(this) }
      },
      {
        html: '<i class="fa-solid fa-pen-to-square fa-xl"></i>',
        onClick: function() { editItem(this) }
      }
    ];
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
};

function updateDisplay() {
  document.getElementById('currentPage').innerText = paginationState.currentPageNumber;
};

function prevPage() {
  if (paginationState.currentPageNumber > 1) {
    paginationState.currentPageNumber -= 1;
    updateDisplay();
    renderRows(paginationState.currentPageNumber);
  }
};

function nextPage() {
  if (paginationState.currentPageNumber < paginationState.totalPages) {
    paginationState.currentPageNumber += 1;
    updateDisplay();
    renderRows(paginationState.currentPageNumber);
  }
};


function editItem(editButton) {
  const row = editButton.closest('.cur-res-row');
  const rowData = Array.from(row.querySelectorAll('.cur-res-row-item')).map(item => item.textContent);

  row.querySelectorAll('.cur-res-row-item').forEach((item, index) => {
    // Replace text content with an input element
    const input = document.createElement('input');
    input.type = 'text';
    input.name = index;
    input.value = rowData[index];
    input.className = 'form-control';
    item.innerHTML = '';
    item.appendChild(input);
  });

  // Adjust the action buttons
  const actionContainer = row.querySelector('.cur-res-row-item-container');
  actionContainer.innerHTML = '';

  const saveButton = document.createElement('div');
  saveButton.className = 'subitem';
  saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk fa-xl"></i>';
  saveButton.onclick = () => saveReservering(row);

  const cancelButton = document.createElement('div');
  cancelButton.className = 'subitem';
  cancelButton.innerHTML = '<i class="fa-solid fa-x"></i>';
  cancelButton.onclick = () => cancelReservering(row);

  actionContainer.appendChild(saveButton);
  actionContainer.appendChild(cancelButton);
};

function generateRowFromObject(row, updatedData) {
  const id = row.id;
  const rowDiv = document.getElementById(id);
  rowDiv.innerHTML = ''; // Clear existing content

  keyOrder = paginationState.keyorder
  // Iterate over the keys in the specified order, handling nested paths
  keyOrder.forEach(keyPath => {
    const value = updatedData[keyPath];
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
      onClick: function() { deleteItem(this) }
    },
    {
      html: '<i class="fa-solid fa-pen-to-square fa-xl"></i>',
      onClick: function() { editItem(this) }
    }
  ];
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
  };
};
function findRow(id){
  for (let i = 0;i<paginationState.pageLength;i++){
    if (paginationState.currentPage[i].id === id){
      return paginationState.currentPage[i];
    }
  }
  return {};
};

function cancelReservering(row) {
  const rowId = parseInt(row.id);
  const currentRow = findRow(rowId);
  // Collect input values from the row
  generateRowFromObject(row, currentRow);
};

function saveReservering(row) {
  const rowId = parseInt(row.id)
  const currentRow = findRow(rowId)
  // Collect input values from the row
  const inputs = row.querySelectorAll('input');
  const updatedData = {};
  inputs.forEach(input => {
    updatedData[paginationState.keyorder[parseInt(input.name)]] = input.value;
  });
  Object.assign(currentRow, updatedData)
  console.log(currentRow)
  // // Construct the endpoint URL
  const endpoint = `${endpointAddress}/edituser/${rowId}`;
 
  // // // // Send the updated data to the server
  fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(currentRow),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    generateRowFromObject(row, updatedData)
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  generateRowFromObject(row, updatedData)
};

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
      };
      selectElement.appendChild(option);
      };
      // Set "selected" attribute for "coDate" as per your original HTML

      // Append the <option> to the <select> element
});
};

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
};

// Initialize display on load
window.onload = function() {
  // Code to run when the window is fully loaded
  renderPage();
  updateDisplay();
};