document.addEventListener('DOMContentLoaded', function () {
    getReservationStatus();
});

// function createBooking() {
//     
// }


function getUUIDFromURL() {
    const url = window.location.search;
    return new URLSearchParams(url).get('uuid');
    return uuid;
}


function getReservationStatus() {
    
    const uuid = getUUIDFromURL();
    
    fetch(url + `/reservation-status?uuid=${uuid}`)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to fetch reservation status');
            }
        })
        .then(status => {
            setBooked(status)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function setBooked(status) {
    let statusTxt = document.getElementById('txt-status')
    
    switch (status) {
        case 'NOT_PAID':
            statusTxt.textContent = "Not yet paid";
            break;
        case 'NOT_FOUND':
            statusTxt.textContent = "Cannot find this reservation";
            break;
        default:
            statusTxt.style.color = 'rgb(18, 255, 34)';
            let html = `
            <p>You've sold your soul on </p>
            <p">${status}</p>
            <p>Thank you.</p>
            `
            statusTxt.innerHTML = html;
            
            break;
    }
}


function createBooking() {
    
    const uuid = getUUIDFromURL();

    fetch(url + `/create-booking?uuid=${uuid}`, {
        method: 'POST', 
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch reservation status');
        }
    })
    .then(status => {
        if (status) {
            getReservationStatus();
        } else {
            console.log("Error. Do not contact the developers");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function viewOutsideActivities() {
    alert("mag niet!")
}