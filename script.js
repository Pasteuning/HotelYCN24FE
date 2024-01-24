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
    document.getElementById("hotelcreated").innerHTML = "Hotel succesfully created";
    location.reload();
}

function deleteHotel(hotelId) {
    console.log(hotelId)
    fetch("http://localhost:8080/deletehotel/" + id);
    location.reload();
}


function getAllRooms(){
    fetch("http://127.0.0.1:8080/allrooms")
    .then(res => res.json())
    .then (rooms => {
        let roomhtml = ""
        for (let x=0; x<rooms.length; x++){
            roomhtml+=`
            <tr>
                <td>${rooms[x].id}</td>
                <td>${rooms[x].room_type}</td>
                <td>${rooms[x].noBeds}</td>
                <td>${rooms[x].price}</td>
                <td><button onclick="editRoom(${rooms[x].id})">Edit room</button></td>
                <td><button onclick="deleteRoom(${rooms[x].id})">Delete room</button></td>
             </tr>
            `
        }
        document.getElementById("rooms").innerHTML = roomhtml;
    })
}

function editRoom(roomId){
    fetch("http://127.0.0.1:8080/room/" + roomId)
    .then(res => res.json())
    .then (room => {
        let form = `
        <h2> Edit room</h2>
        <form>
            <label>Room Type:</label>
            <input type="text" id="editRoomType" value=${room.roomType}>
            <label>Number of Beds:</label>
            <input type="text" id="editNoBeds" value=${room.noBeds}>
            <label>Price:</label>
            <input type="number" id="editPrice" value=${room.price}>
            <button onclick="submitForm(${roomId})">Submit</button>
        </form>
        `
        document.getElementById("editRoom").innerHTML = form;
        
    })
}
function submitFormRoom(roomId){
    let editedRoom = {
        "roomType": document.getElementById("editRoomType").value,
        "noBeds": document.getElementById("editNoBeds").value,
        "price": document.getElementById("editPrice").value,
    }
    fetch("http://127.0.0.1:8080/editroom/" + roomId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedRoom),
    })
}

function createRoom(){
    let room = {
        "roomType": document.getElementById("room_type").value,
        "noBeds": document.getElementById("no_beds").value,
        "price": document.getElementById("price").value
    }
    fetch("http://127.0.0.1:8080/createroom", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
        })
        document.getElementById("roomCreated").innerHTML = "Room succesfully created";

}


function deleteRoom(roomId) {
    console.log(roomId)
    fetch("http://localhost:8080/deleteroom/" + roomId);

}


