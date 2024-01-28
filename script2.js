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
        "price": document.getElementById("price")
    }
    fetch("http://127.0.0.1:8080/createroom", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
        })
        document.getElementById("roomcreated").innerHTML = "Room succesfully created";
        location.reload();
}


function deleteRoom(roomId) {
    console.log(roomId)
    fetch("http://localhost:8080/deleteroom/" + roomId);
    location.reload();
}
