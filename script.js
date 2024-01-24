
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
            <button onclick="submitForm(${hotelId})">Submit</button>
        </form>
        `
    document.getElementById("editHotel").innerHTML = form;
    })
}

function submitForm(hotelId) {
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

function deleteHotel(hotelId) {
    console.log(hotelId)
    fetch("http://localhost:8080/deletehotel/" + hotelId);
    location.reload();
}