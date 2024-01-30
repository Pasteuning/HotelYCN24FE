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

function searchRooms() {
    alert("To be continued...");
}

function setMinCheckOutDate(){
    alert("To be continued...")
}