//Startup script:
document.addEventListener('DOMContentLoaded', async function () {
    await getAllHotels().then(hotels => {
        populateDropdown(hotels, "hotelDropdown", 1)
        populateDropdown(hotels, "hotelDropdown2", 1)
        });
        getAllReservations();
    
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
    let reservation =  {
        "ciDate": document.getElementById("checkIn").value,
        "coDate": document.getElementById("checkOut").value,
        "adults": document.getElementById("adults").value,
        "children": document.getElementById("children").value,     
    }
    const res = await fetch("http://127.0.0.1:8080/createreservation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
    });

    // Check if the response status is OK (200)
    if (res.ok) {
        const createdReservation = await res.json();
        console.log(createdReservation);
        assignRoom(createdReservation);
        assignUser(createdReservation);
        alert("Reservation successfully created");
        getAllReservations();
    }
}

async function assignRoom(reservation) {
    let roomId = document.getElementById("room").value;
    console.log(reservation.id);
    await fetch("http://127.0.0.1:8080/reservations/assignroom?reservationId=" + reservation.id + "&roomId=" + roomId, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }})
}

async function assignUser(reservation) {
    let userId = document.getElementById("user").value;
    await fetch("http://127.0.0.1:8080/reservations/assignuser?reservationId=" + reservation.id + "&userId=" + userId, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }})
}

async function deleteReservation(reservationId) {
    await fetch("http://localhost:8080/deletereservation/" + reservationId);
    alert("Reservation successfully deleted");
    getAllReservations();
}

async function editReservation() {
    //TO BE CONTINUED!!!
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