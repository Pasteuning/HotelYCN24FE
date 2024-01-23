window.onload = function() {
    document.getElementById("viewhotels").click();
}

function getAllHotels(){
    fetch("http://127.0.0.1:8080/allhotels")
    .then(res => res.json())
    .then (hotels => {
        let hotelhtml = ""
        for (let i=0; i<hotels.length; i++){
            hotelhtml+=`
            <tr>
                <td>${hotels[i].id}</td>
                <td>${hotels[i].name}</td>
                <td>${hotels[i].street}</td>
                <td>${hotels[i].houseNumber}</td>
                <td>${hotels[i].zipCode}</td>
                <td>${hotels[i].city}</td>
                <td>${hotels[i].country}</td>
                <td><button onclick="editHotel(${hotels[i].id})">Edit hotel</button></td>
                <td><button onclick="deleteHotel(${hotels[i].id})">Delete hotel</button></td>
             </tr>
            `
        }
        document.getElementById("hotels").innerHTML = hotelhtml;
    })
}

function createHotel(){
    let hotel =  {
        "name": document.getElementById("name").value,
        "street": document.getElementById("street").value,
        "houseNumber": document.getElementById("houseNumber").value,
        "zipCode": document.getElementById("zipCode").value,
        "city": document.getElementById("city").value,
        "country": document.getElementById("country").value       
    }
    fetch("http://127.0.0.1:8080/createhotel", {
    method: "POST", // or 'PUT'
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(hotel),
    })
    document.getElementById("hotelcreated").innerHTML = "Hotel succesfully created";
    location.reload();
}

function editHotel(hotelId) {
    fetch("http://localhost:8080/hotel/" + hotelId)
    .then(res => res.json())
    .then(hotel => {
        let form = `
        <h2>Edit hotel</h2>
        <form>
            <label>Name:</label>
            <input type="text" id="editName" value=${hotel.name}><br>
            <label>Street:</label>
            <input type="text" id="editStreet" value=${hotel.street}><br>
            <label>House number:</label>
            <input type="text" id="editHouseNumber" value=${hotel.houseNumber}><br>
            <label>Zip code:</label>
            <input type="text" id="editZipCode" value=${hotel.zipCode}><br>
            <label>City:</label>
            <input type="text" id="editCity" value=${hotel.city}><br>
            <label>Country:</label>
            <input type="text" id="editCountry" value=${hotel.country}><br>
            <button onclick="submitHotelForm(${hotelId})">Submit</button>
        </form>
        `
    document.getElementById("editHotel").innerHTML = form;
    })
}

function submitHotelForm(hotelId) {
    let edditedHotel =  {
        "name": document.getElementById("editName").value,
        "street": document.getElementById("editStreet").value,
        "houseNumber": document.getElementById("editHouseNumber").value,
        "zipCode": document.getElementById("editZipCode").value,
        "city": document.getElementById("editCity").value,
        "country": document.getElementById("editCountry").value     
    }

    fetch("http://127.0.0.1:8080/edithotel/" + hotelId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(edditedHotel),
    })
}

function deleteHotel(hotelId) {
    console.log(hotelId)
    fetch("http://localhost:8080/deletehotel/" + hotelId);
    location.reload();
}



function getAllUsers(){
    fetch("http://127.0.0.1:8080/allusers")
    .then(res => res.json())
    .then (users => {
        let userhtml = ""
        for (let i=0; i<users.length; i++){
            userhtml+=`
            <tr>
                <td>${users[i].id}</td>
                <td>${users[i].firstName}</td>
                <td>${users[i].lastName}</td>
                <td>${users[i].dateOfBirth}</td>
                <td>${users[i].street}</td>
                <td>${users[i].houseNumber}</td>
                <td>${users[i].zipCode}</td>
                <td>${users[i].city}</td>
                <td>${users[i].country}</td>
                <td>${users[i].email}</td>
                <td>${users[i].phoneNumber}</td>
                <td><button onclick="editUser(${users[i].id})">Edit user</button></td>
                <td><button onclick="deleteUser(${users[i].id})">Delete user</button></td>
             </tr>
            `
        }
        document.getElementById("users").innerHTML = userhtml;
    })
}

function createUser(){
    let hotel =  {
        "firstName": document.getElementById("userFirstName").value,
        "lastName": document.getElementById("userLastName").value,
        "dateOfBirth": document.getElementById("userDateOfBirth").value,
        "street": document.getElementById("userStreet").value,
        "houseNumber": document.getElementById("userHouseNumber").value,
        "zipCode": document.getElementById("userZipCode").value,
        "city": document.getElementById("userCity").value,
        "country": document.getElementById("userCountry").value,      
        "email": document.getElementById("userEmail").value,     
        "phoneNumber": document.getElementById("userPhoneNumber").value      
    }
    fetch("http://127.0.0.1:8080/createuser", {
    method: "POST", // or 'PUT'
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(hotel),
    })
    document.getElementById("usercreated").innerHTML = "User succesfully created";
}

function editUser(userId) {
    fetch("http://localhost:8080/user/" + userId)
    .then(res => res.json())
    .then(user => {
        let form = `
        <h2>Edit user</h2>
        <form>
            <label>First name:</label>
            <input type="text" id="editUserFirstName" value=${user.firstName}><br>
            <label>Last name:</label>
            <input type="text" id="editUserLastName" value=${user.lastName}><br>
            <label>Date of Birth:</label>
            <input type="text" id="editUserDateOfBirth" value=${user.dateOfBirth}><br>
            <label>Street:</label>
            <input type="text" id="editUserStreet" value=${user.street}><br>
            <label>House number:</label>
            <input type="text" id="editUserHouseNumber" value=${user.houseNumber}><br>
            <label>Zip code:</label>
            <input type="text" id="editUserZipCode" value=${user.zipCode}><br>
            <label>City:</label>
            <input type="text" id="editUserCity" value=${user.city}><br>
            <label>Country:</label>
            <input type="text" id="editUserCountry" value=${user.country}><br>
            <label>Email:</label>
            <input type="text" id="editUserEmail" value=${user.email}><br>
            <label>Phone number:</label>
            <input type="text" id="editUserPhoneNumber" value=${user.phoneNumber}><br>
            <button onclick="submitUserForm(${userId})">Submit</button>
        </form>
        `
    document.getElementById("editUser").innerHTML = form;
    })
}

function submitUserForm(userId) {
    let edditedUser =  {
        "firstName": document.getElementById("editUserFirstName").value,
        "lastName": document.getElementById("editUserLastName").value,
        "dateOfBirth": document.getElementById("editUserDateOfBirth").value,
        "street": document.getElementById("editUserStreet").value,
        "houseNumber": document.getElementById("editUserHouseNumber").value,
        "zipCode": document.getElementById("editUserZipCode").value,
        "city": document.getElementById("editUserCity").value,
        "country": document.getElementById("editUserCountry").value,
        "email": document.getElementById("editUserEmail").value,
        "phoneNumber": document.getElementById("editUserPhoneNumber").value
    }

    fetch("http://127.0.0.1:8080/edituser/" + userId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(edditedUser),
    })
}

function deleteUser(userId) {
    console.log(userId)
    fetch("http://localhost:8080/deleteuser/" + userId);
    location.reload();
}