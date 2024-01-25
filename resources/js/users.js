getAllUsers()

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

async function createUser(){
    let hotel =  {
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
    fetch("http://127.0.0.1:8080/createuser", {
    method: "POST", // or 'PUT'
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(hotel),
    })
    alert("User successfully created");
}

function editUser(userId) {
    fetch("http://localhost:8080/user/" + userId)
    .then(res => res.json())
    .then(user => {
        let form = `
        <h2>Edit user</h2>
        <form>
            <label>First name:</label>
            <input type="text" id="editFirstName" value=${user.firstName}><br>
            <label>Last name:</label>
            <input type="text" id="editLastName" value=${user.lastName}><br>
            <label>Date of Birth:</label>
            <input type="text" id="editDateOfBirth" value=${user.dateOfBirth}><br>
            <label>Street:</label>
            <input type="text" id="editStreet" value=${user.street}><br>
            <label>House number:</label>
            <input type="text" id="editHouseNumber" value=${user.houseNumber}><br>
            <label>Zip code:</label>
            <input type="text" id="editZipCode" value=${user.zipCode}><br>
            <label>City:</label>
            <input type="text" id="editCity" value=${user.city}><br>
            <label>Country:</label>
            <input type="text" id="editCountry" value=${user.country}><br>
            <label>Email:</label>
            <input type="text" id="editEmail" value=${user.email}><br>
            <label>Phone number:</label>
            <input type="text" id="editPhoneNumber" value=${user.phoneNumber}><br>
            <button onclick="submitForm(${userId})">Save changes</button>
        </form>
        `
    document.getElementById("editUser").innerHTML = form;
    })
}

async function submitForm(userId) {
    let edditedUser =  {
        "firstName": document.getElementById("editFirstName").value,
        "lastName": document.getElementById("editLastName").value,
        "dateOfBirth": document.getElementById("editDateOfBirth").value,
        "street": document.getElementById("editStreet").value,
        "houseNumber": document.getElementById("editHouseNumber").value,
        "zipCode": document.getElementById("editZipCode").value,
        "city": document.getElementById("editCity").value,
        "country": document.getElementById("editCountry").value,
        "email": document.getElementById("editEmail").value,
        "phoneNumber": document.getElementById("editPhoneNumber").value
    }

    fetch("http://127.0.0.1:8080/edituser/" + userId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(edditedUser),
    })
    alert("Changes saved successfully")
}

async function deleteUser(userId) {
    console.log(userId)
    fetch("http://localhost:8080/deleteuser/" + userId);
    location.reload();
}
