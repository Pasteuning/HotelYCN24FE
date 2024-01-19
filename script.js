
function getAllHotels(){
    fetch("http://127.0.0.1:8080/hotel")
    .then(res => res.json())
    .then (hotels => {
        let hotelhtml = ""
        for (let i=0; i<hotels.length; i++){
            hotelhtml+=`
            <tr>
                <td>${hotels[i].id}</td>
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