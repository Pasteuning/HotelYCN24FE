//Startup script:
document.addEventListener('DOMContentLoaded', function () {

    // Make a GET request to retrieve the SessionDTO from the backend
    fetch(url + "/get-sessiondto")
    .then(response => response.json())
    .then(sessionDTO => {
        // Use the sessionDTO as needed
        console.log(sessionDTO);

        // Continue with your logic here
        getUser(sessionDTO.userId).then(u => {
            document.getElementById("user-name").textContent += u.firstName + " " + u.lastName
        });
        getReservations(sessionDTO.userId, "reservations", "future");
        getReservations(sessionDTO.userId, "past-reservations", "past");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
    });

    
    // // Naam inladen
    // getUser(sessionDTO.userId).then(u => { 
    //     document.getElementById("user-name").textContent += u.firstName + " " + u.lastName
    // })
    // getReservations(sessionDTO.userId, "reservations", "future");
    // getReservations(sessionDTO.userId, "past-reservations", "past")
    

});


async function getUser(userId) {
    const response = await fetch(url+`/user/${userId}`)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const user = await response.json();
    return user;
}


async function getReservations(userId, elementId, time) {
    const response = await fetch(url+`/${userId}/reservations?pastOrFuture=${time}`)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const res = await response.json();
    console.log(res)

    let reservationHTML = ""
    for (let i = 0; i < res.length; i++) {
        
        // Voegt "not" toe als er geen surcharge is
        let surcharge = "";
        if (res[i].reservation.surcharge) {
            surcharge = " not ";
        }

        // Communicatie over betalingstatus
        let status = "";
        if (res[i].reservation.status === "BOOKED") {
            status = "Paid with IDEAL";
        } else if (res[i].reservation.status === "RESERVED") {
            status = "Not paid yet";
        } else if (res[i].reservation.status === "CANCELLED") {
            status = "Reservation has been cancelled";
        } else {
            status = "Unknown"
        }

        reservationHTML += `
        <div id="reservation">
            <p>${res[i].hotelName}</p>
            <p>${res[i].reservation.ciDate} - ${res[i].reservation.coDate}</p>
            <p>${res[i].reservation.adults} adults, ${res[i].reservation.children} children (surcharge ${surcharge} applied)</p>
            <p>Special requests: ${res[i].reservation.specialRequest}</p>
            <p>Status: ${status}</p>
        </div>
        `
    }
    document.getElementById(elementId).innerHTML = reservationHTML;


}





async function editUser(){
    "test"
}

async function deleteAccount(){
    "test2"
}
