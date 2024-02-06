//Startup script:
document.addEventListener('DOMContentLoaded', async function () {
    // Hoteldropdown vullen met hotels
    await getAllHotels().then(hotels => {
        populateDropdown(hotels, "hotelDropdown", 1)
        populateDropdown(hotels, "hotelDropdown2", 1)
    });
    getAllReservations();

    displayRooms();

    // Datum ophalen in format: YYYY-MM-DD
    // Minimumdatum van checkin op vandaag zetten
    let today = new Date();
    document.getElementById("checkIn").min = today.toISOString().split('T')[0]; 
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


async function displayRooms() {
    //methode om alle kamers uit de hotel dropdown te laten zien.
    //methode werkt op onchange, dus wordt aangeroepen als de hotel dropdown waarde verandert.
    const hotelId = document.getElementById("hotelDropdown2").value;

    await fetch("http://127.0.0.1:8080/hotel/" + hotelId + "/rooms")
    .then(rooms => rooms.json())
    .then(rooms => {
        let roomshtml = `
            <option value="unassigned">Unassigned</option>
            `
        for (let i=0; i<rooms.length; i++) {
            roomshtml +=`
            <option value="${rooms[i].id}">${rooms[i].id}</option>
            `
        }
        
        document.getElementById("roomDropdown").innerHTML = roomshtml;
        document.getElementById("roomDropdown").value = "unassigned";
    })
}





async function getAllReservations(){
    let sort = document.getElementById("sort").value;

    await fetch("http://127.0.0.1:8080/allreservations?sort=" + sort)
    .then(res => res.json())
    .then (reservations => {
        let reservationshtml = `
        <tr id="reservations-header">
            <td>Hotel id</td>
            <td>Hotel</td>
            <td>Room id</td>
            <td>Reservation id</td>
            <td>Check-in date</td>
            <td>Check-out date</td>
            <td>Adults</td>
            <td>Children</td>
            <td>Surcharge</td>
            <td>Status</td>
            <td>User id</td>
            <td>First name</td>
            <td>Last name</td>
        </tr>
        `

        for (let i=0; i<reservations.length; i++) {
            reservationshtml +=`
            <tr>
                <td>${reservations[i].hotelId}</td>
                <td>${reservations[i].hotelName}</td>
                <td>${reservations[i].roomId}</td>
                <td>${reservations[i].reservation.id}</td>
                <td>${reservations[i].reservation.ciDate}</td>
                <td>${reservations[i].reservation.coDate}</td>
                <td>${reservations[i].reservation.adults}</td>
                <td>${reservations[i].reservation.children}</td>
                <td>${reservations[i].reservation.surcharge}</td>
                <td>${reservations[i].reservation.status}</td>                        
                <td>${reservations[i].userId}</td>
                <td>${reservations[i].firstName}</td>
                <td>${reservations[i].lastName}</td>
                <td><button onclick="editReservation(${reservations[i].reservation.id})">Edit reservation</button></td>
                <td><button onclick="deleteReservation(${reservations[i].reservation.id})">Delete reservation</button></td>
            </tr>
            `                            
        }
        document.getElementById("reservations").innerHTML = reservationshtml;
    })
}


async function createReservation() {
    let resDTO =  {
        "hotelId": document.getElementById("hotelDropdown2").value,
        "roomId": document.getElementById("roomDropdown").value,
        "reservation": {
            "ciDate": document.getElementById("checkIn").value,
            "coDate": document.getElementById("checkOut").value,
            "adults": document.getElementById("adults").value,
            "children": document.getElementById("children").value,    
        },
        "userId": 3,
    };
    console.log(resDTO.reservation.ciDate);

    if (resDTO.reservation.ciDate == null) {
        alert("Please fill in check-in date")
    } else if (resDTO.reservation.coDate == null) {
        alert("Please fill in check-out date")
    } else if (resDTO.reservation.adults == null) {
        alert("Please fill in the number of adults")
    } else if (resDTO.reservation.children == null) {
        alert("Please fill in the number of children")
    } else {
        const res = await fetch("http://127.0.0.1:8080/createreservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resDTO),
        });

        const createdReservation = await res.json();
        getAllReservations();
        // if (createdReservation !== null) {
            
        //     console.log(createdReservation);
        //     assignRoom(createdReservation);
        //     assignUser(createdReservation);
        //     alert("Reservation successfully created");
            
}
}

async function assignRoom(reservation) {
    let roomId = document.getElementById("roomDropdown").value;
    if (roomId !== null) {
        console.log(reservation.id);
        await fetch("http://127.0.0.1:8080/reservations/assignroom?reservationId=" + reservation.id + "&roomId=" + roomId, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }})
    }
    
}

async function assignUser(reservation) {
    let userId = document.getElementById("user").value;
    if (userId !== null) {
        await fetch("http://127.0.0.1:8080/reservations/assignuser?reservationId=" + reservation.id + "&userId=" + userId, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }})
    }
}


async function deleteReservation(reservationId) {
    await fetch("http://localhost:8080/deletereservation/" + reservationId);
    alert("Reservation successfully deleted");
    getAllReservations();
}

async function editReservation(reservationId, hotelId) {
    await fetch("http://localhost:8080/editreservation/" + reservationId)
    .then(res => res.json())
    .then(reservation => {
        let form = `
        <h2>Edit Room</h2>
        <label>Hotel: </label>
        <select id="editHotelDropdown"></select><br>

        <label>Room type: </label>
        <select id="editRoomTypeDropdown" value="${reservation.roomType}">
            <option value="0">Single</option>
            <option value="1">Double</option>
            <option value="2">Family</option>
        </select><br>

        <label>Number of beds</label>
        <input type="text: " id="editNoBeds" value="${reservation.noBeds}"><br>
        <label>Price: </label>
        <input type="text" id="editPrice" value="${reservation.price}"><br>
        <button onclick="submitRoomForm(${reservation.id})">Save changes</button>      
        `

        // getAllHotels().then(hotels => {
        //     populateDropdown(hotels, "editHotelDropdown", hotelId);
        //     });
        
        // document.getElementById("editRoom").innerHTML = form;
    });
}

function setMinCheckOutDate() {
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