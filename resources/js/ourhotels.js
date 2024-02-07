//Startup script:
document.addEventListener('DOMContentLoaded', async function () {
    // Hoteldropdown vullen met hotels
    await getAllHotels().then(hotels => {
        populateDropdown(hotels, "hotelDropdown", 1)
    });
    changeHotel();
});

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