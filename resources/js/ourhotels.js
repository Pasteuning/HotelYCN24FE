// Startup script:
document.addEventListener('DOMContentLoaded', async function () {
    // Hoteldropdown vullen met hotels
    await getAllHotels().then(hotels => {
        populateDropdown(hotels, "hotelDropdown", 1)
        document.getElementById("explore-btn").click()
    });
    // Carousel inladen
    loadCarousel();
    // Minimum en maximum checkin en checkout dateum inladen
    loadMinMaxDates();
});


function loadCarousel() {
        // Initialize the Bootstrap Carousel with interval set to false
        let myCarousel = new bootstrap.Carousel(document.getElementById('carousel'), {
            interval: false // Disable automatic sliding
        });
    
        // Add event listeners for manual navigation
        document.getElementById('prevBtn').addEventListener('click', function () {
            myCarousel.prev();
        });
    
        document.getElementById('nextBtn').addEventListener('click', function () {
            myCarousel.next();
        });
}


function loadMinMaxDates() {
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
}


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


function getAllHotels() {
    return fetch("http://127.0.0.1:8080/allhotels")
    .then(hotels => hotels.json());
}

function populateDropdown(items, elementId, setValue) {
    //methode om een dropdown(elementId) te vullen met items en de selector op een item te zetten
    // const dropdown = document.getElementById(elementId);
    const dropdown = document.getElementById(elementId);

    items.forEach(item => {
        
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
    dropdown.value = setValue;
}

async function changeHotel() {
    // Hotel uit dropdown halen
    const dropdown = document.getElementById("hotelDropdown");
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const selectedText = selectedOption.text;

    // Locatie van hotel vinden
    const res = await fetch("http://127.0.0.1:8080/hotel/" + selectedOption.value)
    const hotel = await res.json();

    // Geselecteerde hotel in titel zetten
    const hotelValue = document.getElementById('hotelValue');
    hotelValue.textContent = selectedText + " situated at " + hotel.city;
}