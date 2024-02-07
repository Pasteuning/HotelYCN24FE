<<<<<<< HEAD
//hotel dropdown direct vullen met hotels
getAllHotels().then(hotels => {
    populateHotelsDropdown(hotels);
})
=======
document.addEventListener('DOMContentLoaded', async function () {
    //hotel dropdown direct vullen met hotels
    await getAllHotels().then(hotels => {
    populateDropdown(hotels, "hotelDropdown", 1);
    });
    displayRooms();
});
>>>>>>> development

function getAllHotels(){
    return fetch("http://127.0.0.1:8080/allhotels")
    .then(hotels => hotels.json());
}

<<<<<<< HEAD
function getHotel(hotelId) {
    return fetch("http://127.0.0.1:8080/hotel/" + hotelId)
    .then(res => res.json())
}

function getRooms(hotelId){
    return fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
    .then(rooms => rooms.json());
}
=======
>>>>>>> development

function populateDropdown(items, elementId, setValue) {
    //methode om een dropdown(elementId) te vullen met items en de selector op een item te zetten
    const dropdown = document.getElementById(elementId);

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
    dropdown.value = setValue;
}

<<<<<<< HEAD
function displayRooms() {
=======

async function displayRooms() {
>>>>>>> development
    //methode om alle kamers uit de hotel dropdown te laten zien.
    //methode werkt op onchange, dus wordt aangeroepen als de hotel dropdown waarde verandert.
    const hotelId = document.getElementById("hotelDropdown").value;

    await fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
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
            <tr>
                <td><button onclick="editRoom('${rooms[i].id}', '${hotelId}')">Edit</button>
                <button onclick="deleteRoom(${rooms[i].id})">Delete</button></td>
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
    
<<<<<<< HEAD
    fetch("http://127.0.0.1:8080/createroom?hotelId=" + hotelId, {
=======
    await fetch("http://127.0.0.1:8080/createroom?hotelId=" + hotelId, {
>>>>>>> development
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
    })
<<<<<<< HEAD
    .then(alert("De error handling van deze functie werkt alleen met deze alert ertussen. Fix dit nog!!"))
=======
>>>>>>> development
    .then(res => res.json())
    .then(createdRoom => {
        if (createdRoom !== null) {
            alert("Room successfully created");  
        } else {
            alert("Room creation failed");
        }  
    });
<<<<<<< HEAD
=======
    //kamerweergave verversen
    displayRooms()
}


async function editRoom(roomId, hotelId) {
    await fetch("http://localhost:8080/room/" + roomId)
    .then(res => res.json())
    .then(room => {
        let form = `
        <h2>Edit Room</h2>
        <label>Hotel: </label>
        <select id="editHotelDropdown"></select><br>

        <label>Room type: </label>
        <select id="editRoomTypeDropdown" value="${room.roomType}">
            <option value="0">Single</option>
            <option value="1">Double</option>
            <option value="2">Family</option>
        </select><br>

        <label>Number of beds</label>
        <input type="text: " id="editNoBeds" value="${room.noBeds}"><br>
        <label>Price: </label>
        <input type="text" id="editPrice" value="${room.price}"><br>
        <button onclick="submitRoomForm(${room.id})">Save changes</button>      
        `

        getAllHotels().then(hotels => {
            populateDropdown(hotels, "editHotelDropdown", hotelId);
            });
        
        document.getElementById("editRoom").innerHTML = form;
    });
}

function submitRoomForm(roomId) {
    let edditedRoom = {
        "roomType": document.getElementById("editRoomTypeDropdown").value,
        "noBeds": document.getElementById("editNoBeds").value,
        "price": document.getElementById("editPrice").value
    };
    let edditedHotelId = document.getElementById("editHotelDropdown").value;
    fetch("http://localhost:8080/editroom/" + roomId + "?hotelId=" + edditedHotelId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(edditedRoom),
    })
    alert("Changes saved successfully");
    displayRooms(); 
}



function deleteRoom(roomId) {
    if (confirm("Are you sure you want to delete room: " + roomId)) {
        fetch("http://localhost:8080/deleteroom/" + roomId)
        .then(response => {
            displayRooms();
        });
    }
>>>>>>> development
}