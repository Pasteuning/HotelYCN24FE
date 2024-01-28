getAllHotels().then(hotels => {
    populateHotelsDropdown(hotels);
})

function getAllHotels(){
    return fetch("http://127.0.0.1:8080/allhotels")
    .then(hotels => hotels.json());
}

function getRooms(hotelId){
    return fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
    .then(rooms => rooms.json());
}

function populateHotelsDropdown(hotels) {
    const dropdown = document.getElementById("hotelDropdown");

    hotels.forEach(hotel => {
        const option = document.createElement("option");
        option.value = hotel.id;
        option.textContent = hotel.name;
        dropdown.appendChild(option);
    });
    displayRooms();
}

function displayRooms() {
    const hotelId = document.getElementById("hotelDropdown").value;

    fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
    .then(rooms => rooms.json())
    .then(rooms => {
        let roomshtml = "";
        for (let i=0; i<rooms.length; i++) {
            roomshtml +=`
            <table class="room">
            <tr>
                <td>Id:</td>
                <td>${rooms[i].id}</td>
            </tr>
            <tr>
                <td>Room Type:</td>
                <td>${rooms[i].roomType}</td>
            </tr>
            <tr>
                <td>Number of beds:</td>
                <td>${rooms[i].noBeds}</td>
            </tr>
            <tr>
                <td>Price:</td>
                <td>€ ${rooms[i].price}</td>
            </tr>
        </table>
            `
        }
        document.getElementById("rooms").innerHTML = roomshtml;
    })
}

function getHotel(hotelId) {
    return fetch("http://127.0.0.1:8080/hotel/" + hotelId)
    .then(res => res.json())
}

async function createRoom() {
    let hotelId = document.getElementById("hotelDropdown").value;
    getHotel(hotelId)
    .then(hotel => {
    let room = {
            "roomType": document.getElementById("roomTypeDropdown").value,
            "noBeds": document.getElementById("noBeds").value,
            "price": document.getElementById("price").value,
            "hotel": {
                "id": hotel.id, 
                "name": hotel.name,
                "street": hotel.street,
                "houseNumber": hotel.houseNumber,
                "zipCode": hotel.zipCode,
                "city": hotel.city,
                "country": hotel.country,
            } 
        }
        fetch("http://127.0.0.1:8080/createroom", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
        })
        alert("Room successfully created")
    })
}