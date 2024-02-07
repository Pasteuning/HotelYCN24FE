<<<<<<< HEAD
//hotel dropdown direct vullen met hotels
getAllHotels().then(hotels => {
    populateHotelsDropdown(hotels);
})

document.addEventListener('DOMContentLoaded', function () {
    // Datum ophalen in format: YYYY-MM-DD
    let today = new Date();
    // Minimumdatum van checkin op vandaag zetten
    document.getElementById("checkin").min = today.toISOString().split('T')[0];

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Minimumdatum van checkout op morgen zetten
    document.getElementById("checkout").min = tomorrow.toISOString().split('T')[0];
});


=======
//Startup script:
document.addEventListener('DOMContentLoaded', function () {
    // Datum ophalen in format: YYYY-MM-DD
    // Minimumdatum van checkin op vandaag zetten
    let today = new Date();
    document.getElementById("checkIn").min = today.toISOString().split('T')[0];

    // Minimumdatum van checkout op morgen zetten
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    document.getElementById("checkOut").min = tomorrow.toISOString().split('T')[0];

    // On load checkin- en out datum zetten
    document.getElementById("checkIn").value = today.toISOString().split('T')[0];
    document.getElementById("checkOut").value = tomorrow.toISOString().split('T')[0];

    // On load adults value op 2, children op 0 zetten
    document.getElementById("adults").value = 2;
    document.getElementById("children").value = 0;

    //hotel dropdown direct vullen met hotels
    getAllHotels().then(hotels => {
        populateHotelsDropdown(hotels)
    });
});


function setMinCheckOutDate(){
    // Minimumdatum van checkout op volgende dag zetten indien checkin na checkout is
    let checkInDate = new Date(document.getElementById("checkIn").value);
    let checkOutDate = new Date(document.getElementById("checkOut").value);
    
    // Minimumdatum checkOut beweegt mee met de checkIn
    let nextDay = new Date(checkInDate);
    nextDay.setDate(checkInDate.getDate() + 1);   
    document.getElementById("checkOut").min = nextDay.toISOString().split('T')[0];
    
    // Zet de waarde op de volgende dag t.o.v. checkIn indien de checkIn datum na de checkOut is geprikt
    if (checkInDate >= checkOutDate) {    
        document.getElementById("checkOut").value = nextDay.toISOString().split('T')[0];
    }
}

>>>>>>> development
function getAllHotels(){
    return fetch("http://127.0.0.1:8080/allhotels")
    .then(hotels => hotels.json());
}

function populateHotelsDropdown(hotels) {
    const dropdown = document.getElementById("hotelDropdown");

    hotels.forEach(hotel => {
        const option = document.createElement("option");
        option.value = hotel.id;
        option.textContent = hotel.name;
        dropdown.appendChild(option);
    });
}

<<<<<<< HEAD
function searchRooms() {
    alert("To be continued...");
}

function setMinCheckOutDate(){
    alert("To be continued...")
=======
async function searchRooms() {
    // Elementen ophalen
    const hotelDropdown = document.getElementById("hotelDropdown");
    const checkInInput = document.getElementById("checkIn");
    const checkOutInput = document.getElementById("checkOut");
    const adultsInput = document.getElementById("adults");
    const childrenInput = document.getElementById("children");

    // HotelName krijgen uit de textwaarde van geselecteerde optie in hotelDropdown
    const selectedOption = hotelDropdown.options[hotelDropdown.selectedIndex];
    const hotelName = selectedOption.textContent;

    // Parameters om de beschikbare kamers mee te zoeken
    const hotelId = hotelDropdown.value;
    const ciDate = checkInInput.value;
    const coDate = checkOutInput.value;
    const adults = adultsInput.value;
    const children = childrenInput.value;

    // Object maken van de query om later door te geven
    const query = {
        hotelId,
        hotelName,
        ciDate,
        coDate,
        adults,
        children
    };


    // Stopt deze functie als er minder dan 1 volwassene is ingevoerd
    if (adults < 1) {
        alert("Rooms may not be reserved without an adult present")
        return;
    } 

    try {
        // URL van de endpoint in back-end
        const url = `http://127.0.0.1:8080/searchrooms/${hotelId}?cid=${ciDate}&cod=${coDate}&adults=${adults}&children=${children}`;
        const response = await fetch(url)

        // Checkt of hij een response kan krijgen van de URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Maakt een json
        const rooms = await response.json();

        // Als er geen kamers gevonden zijn wordt het volgende bericht getoond
        if (rooms.length === 0) {
            document.getElementById("searchOutput").innerHTML = `<p>No available rooms found. Please change your search query</p>`; 
        } else {
            let roomshtml = `<h2>${hotelName}</h2><h2>Rooms available</h2>`;

            for (let i=0; i<rooms.length; i++) {
                // RoomType in kleine letters zetten
                const roomType = rooms[i].roomType.charAt(0) + rooms[i].roomType.slice(1).toLowerCase();

                roomshtml +=`
                <div class="room">
                    <div class="facilities">
                        <h2>Facilities</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
                        </p>
                        <div>
                            <p>${roomType} room</p>
                            <p>${rooms[i].noBeds} beds</p>
                            <p>Facility 3</p>
                            <p>Facility 4</p>
                        </div>
                        <div class="reserve">
                            <div id="price">€${rooms[i].price}</div>
                            <button class="reserve-btn">Book</button>
                        </div>
                    </div>
                    <div class="images"></div>
                </div>
                `
                document.getElementById("searchOutput").innerHTML = roomshtml; 
            }

            // aangemaakte reserve-btn click-functionaliteit geven
            const reserveBtns = document.querySelectorAll('.reserve-btn');
            reserveBtns.forEach(function (reserveBtn, index) {
                reserveBtn.addEventListener("click", function () {
                    reserveRoom(query, rooms[index]);
                });
            });  
        }     
    } catch (error) {
        console.error("An error occurred:", error.message);    
    }
}



function reserveRoom(query, room) {
    document.getElementById("searchOutput").innerHTML = ""; 
    console.log(query)
    console.log(room)
    
    let bookRoomHtml = `
        <h2>Book room</h2>
        <div class="bookRoom userDetails">
            <label>First name: </label>
            <input type="text" id="firstName" required><br>
            <label>Last name:</label>
            <input type="text" id="lastName"><br>
            <label>Date of birth: </label>
            <input type="date" id="dateOfBirth"><br>
            <label>Street: </label>
            <input type="text" id="street"><br>
            <label>House number: </label>
            <input type="text" id="houseNumber"><br>
            <label>Zip code: </label>
            <input type="text" id="zipCode"><br>
            <label>City: </label>
            <input type="text" id="city"><br>
            <label>Country: </label>
            <input type="text" id="country"><br>
            <label>Email: </label>
            <input type="text" id="email"><br>
            <label>Phone number: </label>
            <input type="text" id="phoneNumber"><br>
            <label>Create account: </label>
            <input type="checkbox" id="createAccount" onchange="togglePasswordField()"><br>
            <div id="passwordField" style="display:none;">
                <label>Password: </label>
                <input type="password" id="password">
            </div>
            <label>Donate €100,- to the developers</label>
            <input type="checkbox"><br>
            <button onclick="goBack()">Go Back</button>
            <button id="book-btn" onclick="bookRoom()">Book this room</button>
        </div>
        <div class="bookRoom roomDetails">
            <h3>Your stay at ${query.hotelName}</h3>
            <div>${query.ciDate} - ${query.coDate}</div>
            <div>${query.adults} adults</div>
            <div>${query.children} children</div>
            <div class="price">
                <div>${room.roomType}</div>
                <div>€ ${query.price}</div>
                <div class="childrenFee" style="display:none;">
                    <div>Children fee</div>
                    <div>${query.children}</div>
                </div>
                <div>Total Price</div>
                <div>€ ${query.price}</div>
            </div>
        </div>
        
        
    `
    document.getElementById("bookRoom").innerHTML = bookRoomHtml; 
}



function togglePasswordField() {
    let passwordField = document.getElementById("passwordField");
    let createAccount = document.getElementById("createAccount");

    if (createAccount.checked) {
        passwordField.style.display = "block";
    } else {
        passwordField.style.display = "none";
    }
}


function goBack() {
    document.getElementById("bookRoom").innerHTML = "";
    searchRooms();
}


function bookRoom() {
    alert("Dus jij wil een kamer boeken?");
    alert("Mag niet!");
>>>>>>> development
}