//Startup script:
document.addEventListener('DOMContentLoaded', async function () {

    // account data ophalen
    let account = await getAccountData();

    // geen account gevonden is terug naar login pagina
    if (!account) {
        window.location.href = "login.html";
    }
    let user = account.user;

    // globale variabelen maken
    window.loggedInAccount = account;
    window.loggedInUser = user;
    window.reservationTime = "future";

    document.getElementById("user-name").textContent += user.firstName + " " + user.lastName;
    document.getElementById("loyaltyPoints").textContent += account.loyaltyPoints;
    document.querySelector("#hide-cancelled").checked = true;

    // reserveringen inladen
    displayReservations(reservationTime, isChecked());

    setupCheckboxFunction()
});


async function getAccountData() {
    try {
        // token meesturen en account ophalen
        const response = await fetch(url + "/get-account", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem('TOKEN')
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}

function isChecked() {
    return document.getElementById('hide-cancelled').checked;
}


function toggleResBtn(time, isCheckboxChecked) {
    // Remove "active" class from all buttons
    document.getElementById("future-btn").classList.remove("active");
    document.getElementById("past-btn").classList.remove("active");

    // Add "active" class to the clicked button
    if (time === "future") {
        document.getElementById("future-btn").classList.add("active");
    } else if (time === "past") {
        document.getElementById("past-btn").classList.add("active");
    }
}



async function displayReservations(time, isCheckboxChecked) {
    // time = "past" of "future" of "current"
    if (time === 'current') { 
        time = window.reservationTime;
    } else {
        window.reservationTime = time;
    }
    toggleResBtn(time);


    let userId = window.loggedInUser.id;

    const response = await fetch(url+`/${userId}/reservations?pastOrFuture=${time}`)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const res = await response.json();
    
    // if (res.length === 0) {
    //     document.getElementById("reservation-list").innerHTML = `No reservations found`;
    //     return;
    // }

    let reservationCount = 0;
    let reservationHTML = `<table>`;
    for (let i = 0; i < res.length; i++) {
        if (isCheckboxChecked && res[i].reservation.status === "CANCELLED") {
            continue;
        }
        
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
        <tr id="reservation-${res[i].reservation.id}" class="text-white">
            <td class="res-data">${res[i].hotelName}</td>
            <td class="res-data">${res[i].reservation.ciDate} - ${res[i].reservation.coDate}</td>
            <td class="res-data">${status}</td>
        `;
        
        // Cancel button toevoegen alleen als status "CANCELLED" is
        if (res[i].reservation.status !== "CANCELLED" && time === "future") {
            reservationHTML += `<td class="res-data res-btn"><button class="btn btn-outline-secondary text-white btn-sm" type="button" onclick="cancelReservation(${res[i].reservation.id})">Cancel reservation</button></td>`;
        } else {
            reservationHTML += `<td></td>`
        }

        if (res[i].reservation.status !== "CANCELLED" && time === "past") {
            reservationHTML += `
            <td class="res-data res-btn"><button class="btn btn-success btn-sm" type="button" onclick="writeReview(${res[i].hotelId})">Write review</button></td>
            </tr>`;
        }

        reservationCount++
    }
    
    reservationHTML += `</table>`;

    // Als er geen reservations zijn, wordt er 'No reservations found getoond'
    if (reservationCount === 0) {
        document.getElementById("reservation-list").innerHTML = `No reservations found`;
    } else {
        document.getElementById("reservation-list").innerHTML = reservationHTML;
    }    
}


function displayEditPage() {
    // main elementen verbergen en edit pagina zichtbaar maken
    let mainElements = document.getElementsByClassName('main-elements');
    for (var i = 0; i < mainElements.length; i++) {
        mainElements[i].style.display = 'none';
    }
    document.getElementById('edit-user').style.display = 'block';
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Use smooth scrolling for a nicer effect
    });
}

function displayAccountPage() {
    document.getElementById('edit-user').style.display = 'none';
    // main elementen verbergen en edit pagina zichtbaar maken
    let mainElements = document.getElementsByClassName('main-elements');
    for (var i = 0; i < mainElements.length; i++) {
        mainElements[i].style.display = 'block';
    }
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
}


function editUser() {

    displayEditPage();
    
    const userId = window.loggedInUser.id;

    fetch(url + "/user/" + userId)
    .then(res => res.json())
    .then(u => {
        document.getElementById("firstName").value = u.firstName;
        document.getElementById("lastName").value = u.lastName;
        document.getElementById("dateOfBirth").value = u.dateOfBirth;
        document.getElementById("street").value = u.street;
        document.getElementById("houseNumber").value = u.houseNumber;
        document.getElementById("zipCode").value = u.zipCode;
        document.getElementById("city").value = u.city;
        document.getElementById("country").value = u.country;
        document.getElementById("email").value = u.email;
        document.getElementById("phoneNumber").value = u.phoneNumber;
    });
}

async function submitForm() {
    const userId = window.loggedInUser.id;

    let editedUser =  {
        "firstName": document.getElementById("firstName").value,
        "lastName": document.getElementById("lastName").value,
        "dateOfBirth": document.getElementById("dateOfBirth").value,
        "street": document.getElementById("street").value,
        "houseNumber": document.getElementById("houseNumber").value,
        "zipCode": document.getElementById("zipCode").value,
        "city": document.getElementById("city").value,
        "country": document.getElementById("country").value,
        "email": document.getElementById("email").value,
        "phoneNumber": document.getElementById("phoneNumber").value
    }

    // check of alle velden ingevuld zijn
    for (const key in editedUser) {
        if (!editedUser[key]) {
            const message = "Please fill in all fields.";
            invalidForm(message);
            return;
        }
    }

    const response = await fetch(url+"/edituser/" + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
    });
    const result = await response.json();
    
    if (result === true) {
        alert("Changes saved successfully");
        location.reload();
    }
    else {
        alert("An error occurred while saving the changes")
    }  
}




function cancelEdit() {
    displayAccountPage()
}



async function deleteAccount() {
    let accountId = window.loggedInAccount.id;
    if (confirm("Are you sure you want to delete your account?")) {
        await fetch(url + "/delete-account/" + accountId, {
            method: 'DELETE'
        });
        alert("You are no longer part of the elite class of the community. You've been downgraded to a commoner")
        location.reload();
    }
    
}




function writeReview(hotelId) {
    console.log("HotelId: " + hotelId);
    alert("Mag niet!!")
}


function displayReviews() {}



async function cancelReservation(reservationId) {
    // Verwijder cancel button als reservering is gecancelled
    if (!window.confirm("Are you sure you want to cancel this reservation? ")) {
        return;
    }

    const response = await fetch(url + `/cancel-reservation/${reservationId}`, {
        method: 'DELETE'
    });

    const result = await response.json();
    if (result === true) {
        alert("Successfully canceled reservation");
        document.getElementById(`reservation-${reservationId}`).remove();
        displayReservations("future", isChecked());
        location.reload();
    } else {
        alert("An error occurred while canceling the reservation")
    }
}


function setupCheckboxFunction() {
    const termsCheckbox = document.getElementById('terms-checkbox');
    const registerBtn = document.getElementById('save-changes-btn');

    termsCheckbox.addEventListener('change', function () {
        registerBtn.disabled = !termsCheckbox.checked;
    });
}


function invalidForm(message) {
    let errorMessage = document.getElementById('invalid-create');

    errorMessage.textContent = message;

    // Set up the fade-out transition
    errorMessage.style.transition = 'opacity 1s';

    // Hide the error message after 1.5 seconds
    setTimeout(() => {
        errorMessage.style.opacity = '0'; // Set opacity to 0 for fade-out
        
        // Clear the text and reset the opacity when hiding
        setTimeout(() => {
            errorMessage.textContent = ' ';
            errorMessage.style.opacity = '1'; // Reset opacity for future use
        }, 500); // fade-out transition
    }, 1500); // delay before starting the fade-out transition
}


function logout() {
    localStorage.removeItem('TOKEN');
    alert("You are logged out")
    location.reload();
}



function showPasswordField() {
    document.getElementById('pw-field').style.display = 'flex';
    document.getElementById('pw-btn').style.display = 'none';
}

function hidePasswordField() {
    // Moet class weghalen en toevoegen want anders doet hij het blijkbaar niet 
    document.getElementById("pw-btn").classList.remove("text-center");
    document.getElementById('pw-field').style.display = 'none';
    document.getElementById('pw-btn').style.display = 'block';
    document.getElementById("pw-btn").classList.add("text-center");
}


function savePassword() {
    const password = document.getElementById('password').value;

    if (password === '') {
        alert("Password field cannot be empty")
        return;
    }
    if (password.length > 100) {
        alert("Password cannot have more than 100 characters")
        return;
    }

    fetch(url + '/account/change-password', {
        method: 'PUT',
        body: password,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('TOKEN')
        },
    })
    .then(res => res.json())
    .then(status => {
        if (status) {
            alert("Password successfully changed") 
        } else {
            alert("Error occured while saving new password")
        }
        hidePasswordField();
        document.getElementById("password").value = '';
    })
}