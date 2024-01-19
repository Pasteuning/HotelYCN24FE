
function getAllHotels(){
    fetch("http://127.0.0.1:8080/hotel")
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
             </tr>
            `

        }
        document.getElementById("hotels").innerHTML=hotelhtml
    })
    
}

function createHotel(){
    let hotel =  {
        "street": document.getElementById("street").value,
        "houseNumber": document.getElementById("houseNumber").value,
        "zipCode": document.getElementById("zipCode").value,
        "city": document.getElementById("city").value,
        "country": document.getElementById("country").value,
        "name": document.getElementById("name").value
    }
    fetch("http://127.0.0.1:8080/hotel", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    })
    //.then(res => res.json())
    // .then(antwoord =>{
    //     alert("het is gelukt")
    //      })

}