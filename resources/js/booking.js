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
    return fetch(url+"/allhotels")
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
        const urllocal = url+`/searchrooms/${hotelId}?cid=${ciDate}&cod=${coDate}&adults=${adults}&children=${children}`;
        const response = await fetch(urllocal)

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
            let roomshtml = `
            <div class="hotel-name pt-5">
                <p class="fs-1">${hotelName}</p>
                <h4>Rooms available</h4>
            </div>`;

            for (let i=0; i<rooms.length; i++) {
                // RoomType in kleine letters zetten
                const roomType = rooms[i].roomType.charAt(0) + rooms[i].roomType.slice(1).toLowerCase();

                roomshtml +=`
                    <div class="card mb-3 shadow p-3 mb-5 bg-body rounded" style="max-width: 540px;" id="room">
                        <div class="row no-gutters">
                        <div class="col-md-6">
                            <div class="images">
                                <img src="https://yc2401fotos.blob.core.windows.net/upload/Room_${roomType}_1.png" alt="" class="img-fluid rounded">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                            <h5 class="card-title">${roomType} room</h5>
                            <h6 class="card-title">${rooms[i].noBeds} beds</h6>
                            <p class="card-text fs-6">${rooms[i].description}</p>
                            <div class="reserve">
                                <div class="fw-bold" id="price">€${rooms[i].price}</div>
                                <button class="reserve-btn btn btn-primary">Book</button>
                            </div>
                            </div>
                        </div>
                        </div>
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
    autoScroll()
}



function reserveRoom(query, room) {
    // Build the query parameters
    const queryParams = new URLSearchParams();
    for (const key in query) {
        queryParams.append(key, query[key]);
    }
    // Append room type and price to the query parameters
    queryParams.append('roomId', room.id);
    queryParams.append('roomType', room.roomType);
    queryParams.append('price', room.price);
    // Redirect to book.html with query parameters
    window.location.href = "reservation_details.html?" + queryParams.toString();
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


function autoScroll() {
    // Adjust the value (e.g., 500) to control the amount of scrolling
    const scrollAmount = 800;

    // Scroll the page by scrollAmount pixels
    window.scrollBy({
        top: scrollAmount,
        left: 0,
        behavior: 'smooth' // You can use 'auto' instead of 'smooth' for instant scrolling
    });
}