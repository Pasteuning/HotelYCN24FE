window.onload = function () {
    console.log("load");
    // roep gewoon de functie aan die de click op de button ook aanroept
    // document.getElementById("viewhotels").click();
    getAllHotels();
};

function getAllHotels() {
    let output = document.getElementById("allhotels");
    output.innerHTML = "";

    fetch("http://127.0.0.1:8080/allhotels")
        .then((res) => res.json())
        .then((hotels) => {
            let hotelhtml = "<table id='hotels' border='0' cellspacing='0'>";
            hotelhtml += "<TR>";
            hotelhtml += "<th>" + "&nbsp;" + "</th>";
            hotelhtml += "<th>" + "Naam" + "</th>";
            hotelhtml += "<th>" + "Straat" + "</th>";
            hotelhtml += "<th>" + "Nr" + "</th>";
            hotelhtml += "<th>" + "Postcode" + "</th>";
            hotelhtml += "<th>" + "Plaats" + "</th>";
            hotelhtml += "<th>" + "Land" + "</th>";
            hotelhtml += "<th>" + "&nbsp;" + "</th>";
            hotelhtml += "<th>" + "&nbsp;" + "</th>";
            hotelhtml += "</TR>";

            for (let i = 0; i < hotels.length; i++) {
                hotelhtml += `
            <tr>
                <td class="identifier">${hotels[i].id}</td>
                <td>${hotels[i].name}</td>
                <td>${hotels[i].street}</td>
                <td>${hotels[i].houseNumber}</td>
                <td>${hotels[i].zipCode}</td>
                <td>${hotels[i].city}</td>
                <td>${hotels[i].country}</td>
                <td><button onclick="editHotel(${hotels[i].id})">Edit</button></td>
                <td><button class="deletebutton" onclick="deleteHotel(${hotels[i].id}, '${hotels[i].name}')">Delete</button></td>
             </tr>
            `;
            }
            hotelhtml += "</table>";
            document.getElementById("allhotels").innerHTML = hotelhtml;
        });
}

function getEditor(hotel) {
    //alert(hotel)
    let editORcreate = hotel == null ? "create" : "edit";

    if (hotel == null) {
        hotel = {
            //id:null,
            name: "",
            street: "",
            houseNumber: "",
            zipCode: "",
            city: "",
            country: "",
        };
    }
    let caption = editORcreate == "create" ? "Nieuw Hotel" : hotel.name;
    let editorHTML = `
    <dialog id="editor" open>
        <h2>`+caption+`</h2>
        <hr/>`;

    if (false && editORcreate == "edit"){
        editorHTML += `<label>ID</label>
        <input type="text" id="identifier" readonly value=${hotel.id}><br>`
    }

    editorHTML += `
        <label>Name</label>
        <input type="text" id="name" value="${hotel.name}"><br>
        <label>Street</label>
        <input type="text" id="street" value="${hotel.street}"><br>
        <label>House number</label>
        <input type="text" id="houseNumber" value="${hotel.houseNumber}"><br>
        <label>Zip code</label>
        <input type="text" id="zipCode" value="${hotel.zipCode}"><br>
        <label>City</label>
        <input type="text" id="city" value="${hotel.city}"><br>
        <label>Country</label>
        <input type="text" id="country" value="${hotel.country}">
        <hr>
        <button onclick="cancelEditHotel(${hotel.id})">Cancel</button>`;
    switch (editORcreate) {
        case "create":
            editorHTML += `<button onclick="createHotel()">Opslaan (create)</button>`;
            break;
        case "edit":
            editorHTML += `<button onclick="slaHotelOp(${hotel.id})">Opslaan (edit)</button>`;
            break;
    }

    editorHTML += `</dialog>`;
    return editorHTML;
}

function editHotel(hotelId) {
    fetch("http://localhost:8080/hotel/" + hotelId)
        .then((res) => res.json())
        .then((hotel) => {
            let form = getEditor(hotel);
            document.getElementById("editorplaceholder").innerHTML = form;
        });
}

function slaHotelOp(hotelId) {
    let editedHotel = {
        name: document.getElementById("name").value,
        street: document.getElementById("street").value,
        houseNumber: document.getElementById("houseNumber").value,
        zipCode: document.getElementById("zipCode").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
    };

    fetch("http://127.0.0.1:8080/edithotel/" + hotelId, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editedHotel),
    }).then((response) => {
        getAllHotels();
        document.getElementById("editor").close();
    });
}

function cancelEditHotel() {
    document.getElementById("editor").close();
}

function newHotel() {
    let form = getEditor(null);
    document.getElementById("editorplaceholder").innerHTML = form;
}

async function createHotel() {
    let hotel = {
        name: document.getElementById("name").value,
        street: document.getElementById("street").value,
        houseNumber: document.getElementById("houseNumber").value,
        zipCode: document.getElementById("zipCode").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
    };
    //console.log(hotel);
    fetch("http://127.0.0.1:8080/createhotel", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(hotel),
    }).then(
        // location.reload();
        // location.reload() = een probleem omdat de kans bestaat dat
        // dat de reload gebeurt voordat de fetch afgerond is.
        // Bijgevolg wordt het gecreeerde hotel niet opgeslagen...

        // wacht daarom op de response voordat jet getAllHotels refreshed
        (response) => {
            getAllHotels();
            document.getElementById("editor").close();
        }
    );
    //document.getElementById("hotelcreated").innerHTML = "Hotel succesfully created";
}

function deleteHotel(id, hotelnaam) {
    if (confirm("Zeker weten dat je hotel " + hotelnaam + " wilt verwijderen?")) {
        fetch("http://localhost:8080/deletehotel/" + id).then((response) => {
            getAllHotels();
        });
    }
    // location.reload();
}