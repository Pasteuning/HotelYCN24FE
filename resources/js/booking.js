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

async function searchRooms() {
    //methode om alle kamers uit de hotel dropdown te laten zien.
    //methode werkt op onchange, dus wordt aangeroepen als de hotel dropdown waarde verandert.
    const hotelId = document.getElementById("hotelDropdown").value;

    var hotelDropdown = document.getElementById("hotelDropdown");
    var selectedOption = hotelDropdown.options[hotelDropdown.selectedIndex];
    var hotelName = selectedOption.textContent;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! HIER GEBLEVEN
    //reservation creëren hier en deze naar endpoint van reservation sturen!!


    await fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
    .then(rooms => rooms.json())
    .then(rooms => {
        let roomshtml = "";

        roomshtml += `
        <h2>${hotelName}</h2>
        <h2>Rooms available</h2>
        `

        for (let i=0; i<rooms.length; i++) {
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
                        <p>Facility 1</p>
                        <p>Facility 2</p>
                        <p>Facility 3</p>
                        <p>Facility 4</p>
                    </div>
                    <div class="book">
                        <div id="price">€${rooms[i].price}</div>
                        <button id="book-btn" onclick="bookRoom()">Book</button>
                    </div>
                </div>
                <div class="images"></div>
            </div>
            `
        }
        document.getElementById("searchOutput").innerHTML = roomshtml;
    })
}