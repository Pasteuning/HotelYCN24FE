document.addEventListener('DOMContentLoaded', function () {
    getBookingDetails();
});


function getBookingDetails(){
    // Retrieve query parameters from URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = {};
    for (const [key, value] of queryParams) {
        query[key] = value;
    }

    let roomType = query.roomType.charAt(0) + query.roomType.toLowerCase().slice(1);

    let surcharge = 0;
    if (query.children > 0) {
        surcharge = 25;
    }


    let roomPrice = Number(query.price) - Number(surcharge);
    
    // Populate the booking form with the retrieved information
    // For example:
    document.getElementById("bookRoom").innerHTML = `
        <h2 class="mb-4">Booking Details</h2>
        <p>${query.hotelName}</p>
        <p>${roomType} room</p>
        <p>Check-in: ${query.ciDate}</p>
        <p>Check-out: ${query.coDate}</p>
        <p>${query.adults} adults, ${query.children} children</p>
        <hr class="col-10 mt-3 mb-4">

        <p>Room price: €${roomPrice}</p>
        <p>Children surcharge: €${surcharge},-</p>
        <p class="totalPrice">Total price: €${query.price},-</p>
        <hr class="col-10 mt-3 mb-4">

        <button class="btn btn-outline-light btn-sm" id="btn-special-request" onclick="showSpecialRequest()">Special request</button>
        <input class="mt-3" type="text" id="specialRequest" style="display: none" maxlength="500">
        <div class="buttons mt-4">
            <button class="btn btn-light btn-md" onclick="window.location.href = 'booking.html'">Back to Rooms</button>
            <button class="btn btn-outline-light btn-md" onclick="window.open('outside_activities.html', '_blank')">View Outside Activities</button>
        </div>
    `;
}


function enablePasswordField() {
    // Get references to the checkbox and input field
    const createAccountCheckbox = document.getElementById('createAccount');
    const passwordField = document.getElementById('password');

    // Enable or disable the input based on the checkbox state
    passwordField.disabled = !createAccountCheckbox.checked;
}

function enableBookBtn() {
    // Get references to the checkbox and input field
    const donateCheckbox = document.getElementById('donate-chk-2');
    const bookButton = document.getElementById('book-btn');

    // Enable or disable the input based on the checkbox state
    bookButton.disabled = !donateCheckbox.checked;
}

function showDonate(checkboxId, showElementId) {
    const checkbox = document.getElementById(checkboxId);
    const showElement = document.getElementById(showElementId);

    if (checkbox.checked) {
        showElement.style.display = 'flex';
    } else {
        showElement.style.display = 'none';
    }
}

function showSpecialRequest() {
    const inputField = document.getElementById("specialRequest");

    if (inputField.style.display === 'none') {
        inputField.style.display = 'block';
    } else {
        inputField.style.display = 'none';
        inputField.value = '';
    }
}



function confirmReservation() {

    // Retrieve query parameters from URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = {};
    for (const [key, value] of queryParams) {
        query[key] = value;
    }


    let form = getForm();
    if (form === null) {
        return;
    }


    if (document.getElementById("createAccount").checked) {
        
        isEmailAvailable()
        .then(available => {
            if (!available) {
                alert("An account already exists on this email");
                return;
            } else {
                createAccount(form)
                .then(userId => {

                    if (userId === null) {
                        throw new Error("An error occurred while creating an account. Try again later");  
                    } else {
                        createReservation(userId)
                        .then(uuid => {

                            if (uuid !== null) {
                                alert("Reservation created!")
                                // window.location.href = `book_room.html?uuid=${uuid}`;
                                login(uuid)
                            } else {
                                throw new Error("An error occurred while creating a reservation. Try again later");
                            }
                        })
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    } else {
        createUser(form)
        .then(userId => {

            if (userId === null) {
                throw new Error("An error occurred while creating a user. Try again later");
                
            } else {
                createReservation(userId)
                .then(uuid => {
        
                    if (uuid !== null) {
                        window.location.href = `book_room.html?uuid=${uuid}`;
                    } else {
                        throw new Error("An error occurred while creating a reservation. Try again later");
                    }
                })
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}



function getForm() {
    function isFieldEmpty(fieldId) {
        return document.getElementById(fieldId).value.trim() === "";
    }

    if (
        isFieldEmpty("firstName") ||
        isFieldEmpty("lastName") ||
        isFieldEmpty("dateOfBirth") ||
        isFieldEmpty("street") ||
        isFieldEmpty("houseNumber") ||
        isFieldEmpty("zipCode") ||
        isFieldEmpty("city") ||
        isFieldEmpty("country") ||
        isFieldEmpty("email") ||
        isFieldEmpty("phoneNumber")
    ) {
        alert("Please fill in all fields");
        return null;
    }
    
    let user = {
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

    if (document.getElementById("createAccount").checked) {
        let account = { 
            "password": document.getElementById("password").value,
            "user": user
        }
        return account;
    } 
    else return user;
}


function createUser(user) {

    return fetch(url + '/createuser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    .then(res => res.json())
    .catch(error => {
        console.error("Error creating user:", error);
    });
}


function createAccount(account) {

    return fetch(url + "/create-account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
    })
    .then(res => res.json())
    .catch(error => {
        console.error("Error creating account:", error);
    });
}

async function isEmailAvailable() {
    const email = document.getElementById("email").value;

    const res = await fetch(url + "/is-email-available", {
        method: 'POST',
        body: email,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const response = await res.json();
    return response;
}


function createReservation(userId) {
    // Retrieve query parameters from URL
    const queryParams = new URLSearchParams(window.location.search);
    const query = {};
    for (const [key, value] of queryParams) {
        query[key] = value;
    }

    let reservation = {
        "hotelId": query.hotelId,
        "roomId": query.roomId,
        "reservation": {
            "ciDate": query.ciDate,
            "coDate": query.coDate,
            "adults": query.adults,
            "children": query.children,
            "specialRequest": document.getElementById("specialRequest").value
        },
        "userId": userId
    }

    return fetch(url + "/createreservation", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
    })
    .then(uuid => {
        return uuid.text();
    })
    .catch(error => {
        console.error("Error creating reservation:", error);
    });  
}



function login(uuid) {
    // Get the email and password values
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Define the data you want to send
    const data = { email: email, password: password };

    // Make a POST request to your backend
    fetch(url + "/login", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('TOKEN')
        },
        body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.text(); // Get the response body as text
    })
    .then(body => {
        // Parse the JSON only if the response body is not empty
        const account = body ? JSON.parse(body) : null;

        if (account) {
            // Successful login
            // Token in localStorage zetten
            localStorage.setItem('TOKEN', account.token);
            console.log(account)

            // Naar booking confirm pagina
            window.location.href = `book_room.html?uuid=${uuid}`;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
        alert("An error occurred while logging in.");
    });
}

