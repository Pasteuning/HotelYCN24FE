//hotel dropdown direct vullen met hotels
getAllHotels().then(hotels => {
    populateHotelsDropdown(hotels);
})

function getAllHotels(){
    return fetch("http://127.0.0.1:8080/allhotels")
    .then(hotels => hotels.json());
}

function getHotel(hotelId) {
    return fetch("http://127.0.0.1:8080/hotel/" + hotelId)
    .then(res => res.json())
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
    //methode om alle kamers uit de hotel dropdown te laten zien.
    //methode werkt op onchange, dus wordt aangeroepen als de hotel dropdown waarde verandert.
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


async function createRoom() {
    let hotelId = document.getElementById("hotelDropdown").value;

    let room = {
        //id: generated
        "roomType": document.getElementById("roomTypeDropdown").value,
        "noBeds": document.getElementById("noBeds").value,
        "price": document.getElementById("price").value
    }
    
    fetch("http://127.0.0.1:8080/createroom?hotelId=" + hotelId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
    })
    .then(alert("De error handling van deze functie werkt alleen met deze alert ertussen. Fix dit nog!!"))
    .then(res => res.json())
    .then(createdRoom => {
        if (createdRoom !== null) {
            alert("Room successfully created");  
        } else {
            alert("Room creation failed");
        }  
    });
}